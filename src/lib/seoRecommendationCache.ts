import { CHEFS } from '@/data/chefs';
import { SEO_KEYWORDS, type SeoKeyword } from '@/data/seoKeywords';
import { COOK_MENUS, ORDER_MENUS } from '@/data/localMenus';
import type { FilterState } from '@/types/filter';
import type { FoodItem, RecommendResponse } from '@/types/recommend';

const RAIN_HINTS = ['찌개', '국밥', '라면', '우동', '탕', '짬뽕'];
const SWEET_HINTS = ['떡볶이', '파스타', '치킨', '버거', '추로스', '티라미수'];
const DIET_HINTS = ['된장찌개', '순두부찌개', '초밥', '비빔밥', '쌀국수', '가스파초'];
const LATE_HINTS = ['라면', '국밥', '짜장면', '버거', '치킨', '족발'];
const ORDER_SLUG_HINTS = ['배달', 'delivery', '야식'];

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

const includesOneOf = (name: string, hints: string[]) => hints.some((hint) => name.includes(hint));

const inferMode = (keyword: SeoKeyword): FilterState['mode'] => {
  if (keyword.preset.mode) return keyword.preset.mode;
  if (includesOneOf(keyword.slug, ORDER_SLUG_HINTS)) return 'order';
  return 'cook';
};

const buildSeoFilters = (keyword: SeoKeyword): FilterState => ({
  mode: inferMode(keyword),
  house: keyword.preset.house ?? null,
  baby: null,
  vibes: keyword.preset.vibes ?? [],
  budget: keyword.preset.budget ?? 'any',
});

const getChefItems = (): FoodItem[] => (
  CHEFS.flatMap((chef) =>
    chef.signature.map((menu, index) => ({
      name: menu,
      reason: `${chef.name} 셰프의 ${chef.specialty} 감성을 참고한 메뉴`,
      emoji: index % 2 === 0 ? chef.emoji : '🍽️',
    })),
  )
);

const scoreMenu = (item: FoodItem, filters: FilterState) => {
  let score = 0;

  if (filters.vibes.includes('rain') && includesOneOf(item.name, RAIN_HINTS)) score += 4;
  if (filters.vibes.includes('sweet') && includesOneOf(item.name, SWEET_HINTS)) score += 3;
  if (filters.vibes.includes('diet') && includesOneOf(item.name, DIET_HINTS)) score += 4;
  if (filters.vibes.includes('late') && includesOneOf(item.name, LATE_HINTS)) score += 4;
  if (filters.house === 'family' && includesOneOf(item.name, ['치킨', '피자', '파스타', '제육볶음'])) score += 2;
  if (filters.house === 'couple' && includesOneOf(item.name, ['파스타', '초밥', '스테이크', '리조또'])) score += 2;
  if (filters.house === 'solo' && includesOneOf(item.name, ['라면', '국밥', '볶음밥', '덮밥'])) score += 2;
  if (filters.budget === 'under10k' && includesOneOf(item.name, ['라면', '볶음밥', '된장찌개', '떡볶이', '짜장면'])) score += 2;
  if (filters.mode === 'order' && includesOneOf(item.name, ['치킨', '피자', '짜장면', '초밥', '버거', '족발', '국밥', '떡볶이'])) score += 3;
  if (filters.mode === 'cook' && includesOneOf(item.name, ['찌개', '볶음', '파스타', '덮밥'])) score += 2;

  return score;
};

const createRecommendation = (keyword: SeoKeyword): RecommendResponse => {
  const filters = buildSeoFilters(keyword);
  const basePool = filters.mode === 'order' ? ORDER_MENUS : COOK_MENUS;
  const chefPool = filters.vibes.includes('chef') ? getChefItems() : [];
  const pool = [...chefPool, ...basePool];
  const seed = hashString(keyword.slug);

  const items = [...pool]
    .map((item, index) => ({
      item,
      score: scoreMenu(item, filters),
      seedScore: (hashString(`${keyword.slug}:${item.name}:${index}`) + seed) % 997,
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.seedScore - b.seedScore;
    })
    .slice(0, 5)
    .map(({ item }) => item);

  return {
    type: filters.mode === 'order' ? 'order' : 'cook',
    items,
  };
};

export const SEO_RECOMMENDATION_CACHE: Record<string, RecommendResponse> = Object.fromEntries(
  SEO_KEYWORDS.map((keyword) => [keyword.slug, createRecommendation(keyword)]),
);

export const getSeoRecommendation = (keyword: SeoKeyword): RecommendResponse => (
  SEO_RECOMMENDATION_CACHE[keyword.slug] ?? createRecommendation(keyword)
);
