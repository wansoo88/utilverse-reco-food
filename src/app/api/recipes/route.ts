import { NextRequest, NextResponse } from 'next/server';

export interface RecipeItem {
  title: string;
  creator: string;
  platform: 'youtube' | 'recipe';
  url: string;
}

const RECIPE_SYSTEM_PROMPT = `You are a Korean food recipe curator. Given a food name, suggest 5 popular trending recipe resources.

Return ONLY a raw JSON array (no markdown, no explanation):
[
  { "title": "recipe title", "creator": "channel or site name", "platform": "youtube" or "recipe", "searchQuery": "optimal search query" }
]

Rules:
- Mix platforms: about 3 youtube, 2 recipe
- Use real popular Korean cooking channels: 백종원의 요리비책, 만개의레시피, 쿠킹하루, 집밥 백선생, 에브리데이쿡, 이밥차, 뚝딱이형
- For non-Korean lang, use appropriate popular cooking channels in that language
- searchQuery = the most effective search term to find this specific recipe
- Keep titles realistic and concise (under 30 chars)`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { foodName?: string; lang?: string };
    const foodName = typeof body.foodName === 'string' ? body.foodName.trim() : '';
    const lang = typeof body.lang === 'string' ? body.lang : 'ko';

    if (!foodName) return NextResponse.json({ recipes: [] });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ recipes: [] });

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
      systemInstruction: RECIPE_SYSTEM_PROMPT,
    });

    const langHint = lang !== 'ko' ? ` (respond in ${lang.toUpperCase()} for title/creator)` : '';
    const result = await model.generateContent(`${foodName} 레시피 5개 추천${langHint}`);
    const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();

    const raw = JSON.parse(text) as Array<{
      title: string;
      creator: string;
      platform: string;
      searchQuery: string;
    }>;

    const recipes: RecipeItem[] = raw.slice(0, 5).map((item) => {
      const q = encodeURIComponent(item.searchQuery ?? item.title);
      const url =
        item.platform === 'recipe'
          ? `https://www.10000recipe.com/recipe/list.html?q=${q}`
          : `https://www.youtube.com/results?search_query=${q}`;

      return {
        title: item.title,
        creator: item.creator,
        platform: (item.platform === 'recipe' ? 'recipe' : 'youtube') as 'youtube' | 'recipe',
        url,
      };
    });

    return NextResponse.json({ recipes });
  } catch {
    return NextResponse.json({ recipes: [] });
  }
}
