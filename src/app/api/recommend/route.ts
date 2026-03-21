import { NextRequest, NextResponse } from 'next/server';
import { validateInput, sanitizeInput } from '@/lib/security';
import { localRecommend } from '@/lib/localRecommend';
import { DEFAULT_FILTER, type FilterState } from '@/types/filter';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { query?: string; filters?: unknown; lang?: string; ingredients?: string[]; exclude?: string[] };
    const rawQuery = typeof body.query === 'string' ? body.query : '';
    const lang = typeof body.lang === 'string' ? body.lang : 'ko';
    const ingredients = Array.isArray(body.ingredients) ? body.ingredients as string[] : [];
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

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(localRecommend(filters));
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const { buildUserPrompt, SYSTEM_PROMPT } = await import('@/lib/promptBuilder');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      // 무료 한도 최대 모델: gemini-2.0-flash-lite (1,500 RPD, 빠른 응답)
      model: 'gemini-2.0-flash-lite',
      systemInstruction: SYSTEM_PROMPT,
    });

    const userPrompt = buildUserPrompt(sanitized, filters, lang, ingredients, exclude);
    const result = await model.generateContent(userPrompt);
    const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();

    const parsed = JSON.parse(text) as unknown;
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(localRecommend(DEFAULT_FILTER));
  }
}
