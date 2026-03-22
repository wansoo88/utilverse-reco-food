import { NextRequest, NextResponse } from 'next/server';

/**
 * Local DB 업데이트 엔드포인트
 * POST /api/admin/update-db
 *
 * 보안: ADMIN_SECRET 환경변수로 인증
 * 기능: K-pop 아이돌, 흑백요리사, 트렌드 메뉴 데이터를 AI로 최신화
 */

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'dev-secret';

interface UpdateResult {
  category: string;
  status: 'success' | 'skipped' | 'error';
  message: string;
  count?: number;
}

async function fetchLatestFromAI(category: string): Promise<{ data: unknown; count: number }> {
  const geminiKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
  ].filter(Boolean) as string[];

  if (geminiKeys.length === 0) {
    throw new Error('No Gemini API keys configured');
  }

  const prompts: Record<string, string> = {
    kpop: `현재 2026년 기준 K-pop 아이돌 인기 순위를 알려줘.
JSON 형식으로 상위 30개 그룹과 인기 멤버를 포함해줘.
{"groups":[{"name":"그룹명","members":["멤버1","멤버2"],"popularity":{"ko":1,"en":1,"ja":1,"zh":1}}]}`,
    chef: `2026년 흑백요리사 시즌별 참가자와 시그니처 메뉴를 JSON으로 알려줘.
{"chefs":[{"name":"이름","season":1,"rank":1,"signature":["메뉴1"],"specialty":"전문분야"}]}`,
    trend: `2025-2026년 한국 음식 트렌드 메뉴를 JSON으로 50개 알려줘. 해먹기와 시켜먹기를 구분해줘.
{"cook":[{"name":"메뉴명","reason":"설명"}],"order":[{"name":"메뉴명","reason":"설명"}]}`,
  };

  const prompt = prompts[category];
  if (!prompt) throw new Error(`Unknown category: ${category}`);

  const { GoogleGenerativeAI } = await import('@google/generative-ai');

  for (const apiKey of geminiKeys) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(text);

      const count = category === 'kpop'
        ? (parsed.groups?.length ?? 0)
        : category === 'chef'
          ? (parsed.chefs?.length ?? 0)
          : ((parsed.cook?.length ?? 0) + (parsed.order?.length ?? 0));

      return { data: parsed, count };
    } catch {
      continue;
    }
  }

  throw new Error('All API keys exhausted');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { secret?: string; categories?: string[] };
    const secret = body.secret;

    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categories = body.categories ?? ['kpop', 'chef', 'trend'];
    const results: UpdateResult[] = [];

    for (const category of categories) {
      try {
        const { count } = await fetchLatestFromAI(category);
        results.push({
          category,
          status: 'success',
          message: `Fetched ${count} items from AI`,
          count,
        });
      } catch (err) {
        results.push({
          category,
          status: 'error',
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      results,
      note: 'AI에서 최신 데이터를 조회했습니다. 실제 DB 파일 업데이트는 수동으로 반영해야 합니다.',
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    description: 'Local DB Update Admin API',
    categories: ['kpop', 'chef', 'trend'],
    usage: 'POST with { "secret": "your-admin-secret", "categories": ["kpop"] }',
  });
}
