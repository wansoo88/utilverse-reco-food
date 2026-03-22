import { NextRequest, NextResponse } from 'next/server';
import { KPOP_IDOLS, KPOP_GROUPS } from '@/data/kpopIdols';
import { COOK_MENUS, ORDER_MENUS } from '@/data/localMenus';
import { CHEFS } from '@/data/chefs';
import { FOOD_TRIVIA } from '@/data/foodTrivia';
import { SEO_KEYWORDS } from '@/data/seoKeywords';

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const cookie = req.cookies.get('admin_session')?.value;
  const header = req.headers.get('x-admin-secret');
  return cookie === secret || header === secret;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase() ?? '';

  const filterItems = <T extends { name?: string; question?: string }>(
    items: T[],
    key: keyof T,
  ): T[] => {
    if (!q) return items.slice(0, 20);
    return items.filter((item) => {
      const val = item[key];
      return typeof val === 'string' && val.toLowerCase().includes(q);
    }).slice(0, 50);
  };

  return NextResponse.json({
    counts: {
      kpopIdols: KPOP_IDOLS.length,
      kpopGroups: KPOP_GROUPS.length,
      cookMenus: COOK_MENUS.length,
      orderMenus: ORDER_MENUS.length,
      chefs: CHEFS.length,
      foodTrivia: FOOD_TRIVIA.length,
      seoKeywords: SEO_KEYWORDS.length,
    },
    preview: {
      kpopIdols: filterItems(KPOP_IDOLS, 'name'),
      cookMenus: filterItems(COOK_MENUS, 'name'),
      orderMenus: filterItems(ORDER_MENUS, 'name'),
      chefs: filterItems(CHEFS, 'name'),
      foodTrivia: q
        ? FOOD_TRIVIA.filter(
            (t) =>
              t.question.toLowerCase().includes(q) ||
              t.answer.toLowerCase().includes(q),
          ).slice(0, 20)
        : FOOD_TRIVIA.slice(0, 5),
    },
  });
}
