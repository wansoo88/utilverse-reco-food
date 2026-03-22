import { NextRequest, NextResponse } from 'next/server';
import { validateInput, sanitizeInput } from '@/lib/security';
import { localRecommend, localDualRecommend } from '@/lib/localRecommend';
import { DEFAULT_FILTER, type FilterState } from '@/types/filter';

// Gemini 429 여부 감지
const isQuotaError = (err: unknown): boolean => {
  const e = err as Record<string, unknown>;
  return (
    e.status === 429 ||
    (typeof e.message === 'string' && e.message.includes('429'))
  );
};

// GPT-4o-mini로 음식 추천 (Gemini 전체 쿼터 소진 시 폴백)
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

// AI 호출 공통 로직 (Gemini → GPT → 로컬 폴백)
async function callAI(
  userPrompt: string,
  systemPrompt: string,
  geminiKeys: string[],
  gptKey: string | undefined,
): Promise<unknown | null> {
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
            systemInstruction: systemPrompt,
          });
          const result = await model.generateContent(userPrompt);
          const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
          return JSON.parse(text);
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
      return await callGpt(userPrompt, systemPrompt, gptKey);
    } catch {
      // GPT도 실패하면 null 반환
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      query?: string;
      filters?: unknown;
      lang?: string;
      ingredients?: string[];
      exclude?: string[];
      dual?: boolean;
    };
    const rawQuery = typeof body.query === 'string' ? body.query : '';
    const lang = typeof body.lang === 'string' ? body.lang : 'ko';
    const ingredients = Array.isArray(body.ingredients) ? body.ingredients as string[] : [];
    const exclude = Array.isArray(body.exclude) ? body.exclude as string[] : [];
    const isDual = body.dual === true;

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

    if (isDual) {
      // 듀얼 모드: cook + order 동시 반환
      const { buildDualUserPrompt, DUAL_SYSTEM_PROMPT } = await import('@/lib/promptBuilder');
      const userPrompt = buildDualUserPrompt(sanitized, filters, lang, exclude);
      const result = await callAI(userPrompt, DUAL_SYSTEM_PROMPT, geminiKeys, gptKey);

      if (result && typeof result === 'object' && 'dual' in (result as Record<string, unknown>)) {
        return NextResponse.json(result);
      }

      // AI 실패 시 로컬 듀얼 폴백
      return NextResponse.json(localDualRecommend(filters, sanitized));
    }

    // 단일 모드 (기존 로직)
    const { buildUserPrompt, SYSTEM_PROMPT } = await import('@/lib/promptBuilder');
    const userPrompt = buildUserPrompt(sanitized, filters, lang, ingredients, exclude);
    const result = await callAI(userPrompt, SYSTEM_PROMPT, geminiKeys, gptKey);

    if (result && typeof result === 'object') {
      return NextResponse.json(result);
    }

    // 로컬 폴백
    return NextResponse.json(localRecommend(filters, sanitized, ingredients));
  } catch {
    return NextResponse.json(localRecommend(DEFAULT_FILTER));
  }
}
