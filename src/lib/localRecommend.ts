import {
  COOK_MENUS,
  COOK_MENUS_SOLO,
  COOK_MENUS_RAIN,
  COOK_MENUS_DIET,
  ORDER_MENUS,
  ORDER_MENUS_LATE,
  ORDER_MENUS_DIET,
} from '@/data/localMenus';
import type { FilterState } from '@/types/filter';
import type { FoodItem, MenuRecommendResponse } from '@/types/recommend';

// 상황어 → 키워드 매핑
const SITUATION_KEYWORDS: Record<string, string[]> = {
  rain: ['비', '비오는', '비가', '우중', '장마', '흐린', '비올때'],
  late: ['야근', '야식', '늦게', '밤에', '새벽', '술', '맥주', '야밤', '심야'],
  diet: ['다이어트', '살빼기', '저칼로리', '건강', '가볍게', '헬스', '단백질', '저탄수'],
  morning: ['아침', '브런치', '모닝', '기상', '출근 전'],
  spicy: ['매운', '얼큰', '화끈', '불닭', '마라'],
  comfort: ['위로', '따뜻', '집밥', '편안', '포근', '그리운'],
  quick: ['빠르게', '급하게', '간단히', '5분', '10분', '즉석'],
};

function detectSituation(query: string): string[] {
  const lower = query.toLowerCase();
  return Object.entries(SITUATION_KEYWORDS)
    .filter(([, keywords]) => keywords.some((kw) => lower.includes(kw)))
    .map(([key]) => key);
}

function getTimeOfDay(): 'morning' | 'lunch' | 'afternoon' | 'dinner' | 'late' {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 14) return 'lunch';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'dinner';
  return 'late';
}

const TIME_PRIORITY: Record<string, string[]> = {
  morning: ['계란후라이 덮밥', '아보카도 토스트', '계란말이', '우동'],
  lunch: ['제육볶음', '카레라이스', '비빔밥', '국밥', '파스타'],
  afternoon: ['떡볶이', '감자전', '라면', '분식'],
  dinner: ['김치찌개', '삼겹살 구이', '된장찌개', '닭볶음탕', '치킨', '족발'],
  late: ['라면', '치킨', '족발', '피자', '마라탕'],
};

function scoreMenu(item: FoodItem, query: string): number {
  if (!query) return 0;
  const lower = query.toLowerCase();
  const name = item.name.toLowerCase();
  if (lower.includes(name) || name.includes(lower)) return 10;
  const words = lower.split(/\s+/).filter(Boolean);
  return words.filter((w) => name.includes(w) || item.reason?.toLowerCase().includes(w)).length;
}

// 메뉴 추천 (3개, type 구분 없음)
export const localRecommend = (
  filters: FilterState,
  query = '',
): MenuRecommendResponse => {
  const vibes = filters.vibes ?? [];
  const detectedSituations = detectSituation(query);
  const timeOfDay = getTimeOfDay();

  // cook + order 풀을 합쳐서 상황에 맞게 선별
  let pool: FoodItem[] = [];

  // 상황별 풀 추가
  if (vibes.includes('rain') || detectedSituations.includes('rain')) {
    pool = [...COOK_MENUS_RAIN, ...ORDER_MENUS];
  } else if (vibes.includes('late') || detectedSituations.includes('late') || timeOfDay === 'late') {
    pool = [...ORDER_MENUS_LATE, ...COOK_MENUS, ...ORDER_MENUS];
  } else if (vibes.includes('diet') || detectedSituations.includes('diet')) {
    pool = [...COOK_MENUS_DIET, ...ORDER_MENUS_DIET];
  } else if (filters.house === 'solo') {
    pool = [...COOK_MENUS_SOLO, ...ORDER_MENUS, ...COOK_MENUS];
  } else {
    pool = [...COOK_MENUS, ...ORDER_MENUS];
  }

  // 중복 제거
  const seen = new Set<string>();
  const deduped = pool.filter((item) => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });

  // 점수 계산
  const scored = deduped.map((item) => ({
    item,
    score: scoreMenu(item, query),
    timePriority: TIME_PRIORITY[timeOfDay]?.includes(item.name) ? 1 : 0,
  }));

  scored.sort((a, b) => {
    const diff = (b.score + b.timePriority) - (a.score + a.timePriority);
    return diff !== 0 ? diff : Math.random() - 0.5;
  });

  const selected = scored.slice(0, 3).map((s) => s.item);

  return {
    items: selected,
    tip: '',
    _fallback: true,
  };
};
