/**
 * K-pop 아이돌 로컬 추천 (AI 없을 때 폴백)
 * - 확인된 메뉴 우선 → 부족하면 localMenus에서 랜덤 매칭
 */
import { KPOP_IDOLS, searchIdols, type KpopIdol } from '@/data/kpopIdols';
import { COOK_MENUS, ORDER_MENUS } from '@/data/localMenus';
import type { FoodItem } from '@/types/recommend';

export interface KpopRecommendResponse {
  idol: string;
  group: string;
  items: FoodItem[];
  tip?: string;
  _fallback?: boolean;
}

/** 아이돌의 확인된 메뉴를 FoodItem으로 변환 */
const idolMenusToItems = (idol: KpopIdol, lang: string): FoodItem[] =>
  idol.favoriteMenus.map((menu) => ({
    name: menu,
    reason: lang === 'ko'
      ? `${idol.name}이(가) 좋아하는 메뉴`
      : lang === 'en'
        ? `${idol.nameEn}'s favorite`
        : lang === 'ja'
          ? `${idol.nameJa}のお気に入り`
          : `${idol.nameZh}最爱的`,
  }));

/** 로컬 메뉴 풀에서 랜덤 보충 */
const fillFromPool = (existing: FoodItem[], needed: number): FoodItem[] => {
  const pool = [...COOK_MENUS, ...ORDER_MENUS];
  const existingNames = new Set(existing.map((i) => i.name));
  const available = pool.filter((i) => !existingNames.has(i.name));

  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, needed);
};

export const kpopLocalRecommend = (
  query: string,
  lang: 'ko' | 'en' | 'ja' | 'zh' = 'ko',
): KpopRecommendResponse => {
  // 아이돌 검색
  const matches = searchIdols(query, lang);
  const idol = matches[0];

  if (!idol) {
    // 아이돌 못 찾으면 랜덤 인기 아이돌 추천
    const randomIdx = Math.floor(Math.random() * Math.min(20, KPOP_IDOLS.length));
    const randomIdol = KPOP_IDOLS[randomIdx];
    const items = idolMenusToItems(randomIdol, lang);
    const fillers = fillFromPool(items, Math.max(0, 3 - items.length));

    return {
      idol: randomIdol.name,
      group: randomIdol.group,
      items: [...items, ...fillers].slice(0, 3),
      tip: lang === 'ko'
        ? `${randomIdol.name}의 추천 메뉴예요!`
        : `Recommended by ${randomIdol.nameEn}!`,
      _fallback: true,
    };
  }

  const items = idolMenusToItems(idol, lang);
  const fillers = fillFromPool(items, Math.max(0, 3 - items.length));

  return {
    idol: idol.name,
    group: idol.group,
    items: [...items, ...fillers].slice(0, 3),
    tip: lang === 'ko'
      ? `${idol.name}(${idol.group})의 추천 메뉴예요!`
      : `Recommended by ${idol.nameEn} (${idol.groupEn})!`,
    _fallback: true,
  };
};
