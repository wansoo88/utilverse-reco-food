import { NextRequest, NextResponse } from 'next/server';
import { validateInput, sanitizeInput } from '@/lib/security';
import { localRecommend } from '@/lib/localRecommend';
import { DEFAULT_FILTER } from '@/types/filter';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { query?: string; filters?: unknown };
    const rawQuery = typeof body.query === 'string' ? body.query : '';

    // Layer 2: 서버 사이드 검증
    const validation = validateInput(rawQuery);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.reason }, { status: 400 });
    }

    const sanitized = sanitizeInput(rawQuery);
    const filters = typeof body.filters === 'object' && body.filters !== null
      ? { ...DEFAULT_FILTER, ...(body.filters as object) }
      : DEFAULT_FILTER;

    const apiKey = process.env.GEMINI_API_KEY;

    // Gemini API 키가 없으면 폴백
    if (!apiKey) {
      return NextResponse.json(localRecommend(filters));
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const { buildUserPrompt, SYSTEM_PROMPT } = await import('@/lib/promptBuilder');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const userPrompt = buildUserPrompt(sanitized, filters, 'ko');
    const result = await model.generateContent(userPrompt);
    const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();

    const parsed = JSON.parse(text) as unknown;
    return NextResponse.json(parsed);
  } catch {
    // 쿼터 초과나 파싱 실패 시 폴백
    return NextResponse.json(localRecommend(DEFAULT_FILTER));
  }
}
