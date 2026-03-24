import { NextRequest, NextResponse } from 'next/server';
import { validateInput, sanitizeInput } from '@/lib/security';
import { localRecommend } from '@/lib/localRecommend';
import { DEFAULT_FILTER, type FilterState } from '@/types/filter';
import { trackUsage, estimateTokens } from '@/lib/usageTracker';

const isQuotaError = (err: unknown): boolean => {
  const e = err as Record<string, unknown>;
  return (
    e.status === 429 ||
    (typeof e.message === 'string' && e.message.includes('429'))
  );
};

async function callGpt(
  userPrompt: string,
  systemPrompt: string,
  apiKey: string,
): Promise<unknown> {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey });

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  });

  const text = response.choices[0]?.message.content ?? '{}';
  return JSON.parse(text);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      query?: string;
      filters?: unknown;
      lang?: string;
      exclude?: string[];
    };
    const rawQuery = typeof body.query === 'string' ? body.query : '';
    const lang = typeof body.lang === 'string' ? body.lang : 'ko';
    const exclude = Array.isArray(body.exclude) ? body.exclude as string[] : [];

    // Layer 2: 서버 사이드 검증
    const validation = validateInput(rawQuery);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.reason }, { status: 400 });
    }

    const sanitized = sanitizeInput(rawQuery);
    const filters: FilterState =
      typeof body.filters === 'object' && body.filters !== null
        ? { ...DEFAULT_FILTER, ...(body.filters as Partial<FilterState>) }
        : DEFAULT_FILTER;

    const geminiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
    ].filter(Boolean) as string[];
    const gptKey = process.env.GPT_API_KEY;

    const { buildUserPrompt, SYSTEM_PROMPT } = await import('@/lib/promptBuilder');
    const userPrompt = buildUserPrompt(sanitized, filters, lang, exclude);

    // Step 1: Gemini 시도 (키 순환, flash-lite 단일 모델 — 쿼터 절약)
    if (geminiKeys.length > 0) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const GEMINI_MODEL = 'gemini-2.0-flash-lite';

      for (const apiKey of geminiKeys) {
        const genAI = new GoogleGenerativeAI(apiKey);
        try {
          const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            systemInstruction: SYSTEM_PROMPT,
          });
          const result = await model.generateContent(userPrompt);
          const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
          trackUsage({ ts: Date.now(), provider: 'gemini', model: GEMINI_MODEL, endpoint: 'recommend', estimatedTokens: estimateTokens(userPrompt + text) });
          return NextResponse.json(JSON.parse(text));
        } catch (err) {
          // 쿼터 초과면 다음 키 시도, 그 외 에러는 즉시 폴백
          if (!isQuotaError(err)) break;
        }
      }
    }

    // Step 2: GPT 폴백
    if (gptKey) {
      try {
        const parsed = await callGpt(userPrompt, SYSTEM_PROMPT, gptKey);
        trackUsage({ ts: Date.now(), provider: 'gpt', model: 'gpt-4o-mini', endpoint: 'recommend', estimatedTokens: estimateTokens(userPrompt + JSON.stringify(parsed)) });
        return NextResponse.json(parsed);
      } catch {
        // GPT 실패 → 로컬 폴백
      }
    }

    // Step 3: 로컬 폴백
    trackUsage({ ts: Date.now(), provider: 'local', model: 'local', endpoint: 'recommend', estimatedTokens: 0 });
    return NextResponse.json(localRecommend(filters, sanitized));
  } catch {
    trackUsage({ ts: Date.now(), provider: 'local', model: 'local', endpoint: 'recommend', estimatedTokens: 0 });
    return NextResponse.json(localRecommend(DEFAULT_FILTER));
  }
}
