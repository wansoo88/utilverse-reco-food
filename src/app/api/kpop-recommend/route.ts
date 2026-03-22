import { NextRequest, NextResponse } from 'next/server';
import { validateInput, sanitizeInput } from '@/lib/security';
import { kpopLocalRecommend } from '@/lib/kpopLocalRecommend';
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
      idolName?: string;
      groupName?: string;
      lang?: string;
    };
    const rawQuery = typeof body.query === 'string' ? body.query : '';
    const lang = (typeof body.lang === 'string' ? body.lang : 'ko') as 'ko' | 'en' | 'ja' | 'zh';
    const idolName = typeof body.idolName === 'string' ? body.idolName : undefined;
    const groupName = typeof body.groupName === 'string' ? body.groupName : undefined;

    // Layer 2: 서버 사이드 검증
    const validation = validateInput(rawQuery || idolName || '음식 추천');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.reason }, { status: 400 });
    }

    const sanitized = sanitizeInput(rawQuery);

    const geminiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
    ].filter(Boolean) as string[];
    const gptKey = process.env.GPT_API_KEY;

    const { KPOP_SYSTEM_PROMPT, buildKpopUserPrompt } = await import('@/lib/kpopPromptBuilder');
    const userPrompt = buildKpopUserPrompt(sanitized, idolName, groupName, lang);

    // Step 1: Gemini 시도
    if (geminiKeys.length > 0) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const GEMINI_MODELS = ['gemini-2.0-flash-lite', 'gemini-2.0-flash'] as const;

      for (const apiKey of geminiKeys) {
        const genAI = new GoogleGenerativeAI(apiKey);
        let keyExhausted = false;

        for (const modelName of GEMINI_MODELS) {
          try {
            const model = genAI.getGenerativeModel({
              model: modelName,
              systemInstruction: KPOP_SYSTEM_PROMPT,
            });
            const result = await model.generateContent(userPrompt);
            const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
            trackUsage({ ts: Date.now(), provider: 'gemini', model: modelName, endpoint: 'kpop-recommend', estimatedTokens: estimateTokens(userPrompt + text) });
            return NextResponse.json(JSON.parse(text));
          } catch (err) {
            if (isQuotaError(err)) {
              keyExhausted = true;
            } else {
              break;
            }
          }
        }

        if (!keyExhausted) break;
      }
    }

    // Step 2: GPT 폴백
    if (gptKey) {
      try {
        const parsed = await callGpt(userPrompt, KPOP_SYSTEM_PROMPT, gptKey);
        trackUsage({ ts: Date.now(), provider: 'gpt', model: 'gpt-4o-mini', endpoint: 'kpop-recommend', estimatedTokens: estimateTokens(userPrompt + JSON.stringify(parsed)) });
        return NextResponse.json(parsed);
      } catch {
        // GPT 실패 → 로컬 폴백
      }
    }

    // Step 3: 로컬 폴백
    trackUsage({ ts: Date.now(), provider: 'local', model: 'local', endpoint: 'kpop-recommend', estimatedTokens: 0 });
    return NextResponse.json(kpopLocalRecommend(idolName ?? sanitized, lang));
  } catch {
    trackUsage({ ts: Date.now(), provider: 'local', model: 'local', endpoint: 'kpop-recommend', estimatedTokens: 0 });
    return NextResponse.json(kpopLocalRecommend('', 'ko'));
  }
}
