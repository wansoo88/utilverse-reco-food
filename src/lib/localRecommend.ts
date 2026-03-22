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
import type { FoodItem, RecommendResponse, DualRecommendResponse } from '@/types/recommend';

// 상황어 → 키워드 매핑 (쿼리 분석용)
const SITUATION_KEYWORDS: Record<string, string[]> = {
  rain: ['비', '비오는', '비가', '우중', '장마', '흐린', '비올때'],
  late: ['야근', '야식', '늦게', '밤에', '새벽', '술', '맥주', '야밤', '심야'],
  diet: ['다이어트', '살빼기', '저칼로리', '건강', '가볍게', '헬스', '단백질', '저탄수'],
  morning: ['아침', '브런치', '모닝', '기상', '출근 전'],
  spicy: ['매운', '얼큰', '화끈', '불닭', '마라'],
  comfort: ['위로', '따뜻', '집밥', '편안', '포근', '그리운'],
  quick: ['빠르게', '급하게', '간단히', '5분', '10분', '즉석'],
};

// 쿼리에서 상황 감지
function detectSituation(query: string): string[] {
  const lower = query.toLowerCase();
  return Object.entries(SITUATION_KEYWORDS)
    .filter(([, keywords]) => keywords.some((kw) => lower.includes(kw)))
    .map(([key]) => key);
}

// 시간대 감지
function getTimeOfDay(): 'morning' | 'lunch' | 'afternoon' | 'dinner' | 'late' {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 14) return 'lunch';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'dinner';
  return 'late';
}

// 시간대별 추천 가중치 조정 (해당 메뉴를 앞으로)
const TIME_PRIORITY: Record<string, string[]> = {
  morning: ['계란후라이 덮밥', '아보카도 토스트', '계란말이', '우동'],
  lunch: ['제육볶음', '카레라이스', '비빔밥', '국밥', '파스타'],
  afternoon: ['떡볶이', '감자전', '라면', '분식'],
  dinner: ['김치찌개', '삼겹살 구이', '된장찌개', '닭볶음탕', '치킨', '족발'],
  late: ['라면', '치킨', '족발', '피자', '마라탕'],
};

// 이름 기반 메뉴 쿼리 키워드 매칭 점수 계산
function scoreMenu(item: FoodItem, query: string): number {
  if (!query) return 0;
  const lower = query.toLowerCase();
  const name = item.name.toLowerCase();
  // 이름 직접 포함 시 높은 점수
  if (lower.includes(name) || name.includes(lower)) return 10;
  // 단어 단위 부분 일치
  const words = lower.split(/\s+/).filter(Boolean);
  return words.filter((w) => name.includes(w) || item.reason?.toLowerCase().includes(w)).length;
}

// Gemini API 실패 시 로컬 폴백 추천
export const localRecommend = (
  filters: FilterState,
  query = '',
  ingredients: string[] = [],
): RecommendResponse => {
  // mode 'any'일 때: 쿼리/상황어로 판단, 기본값은 order
  const detectedOrder = detectSituation(query).includes('late') ||
    ['치킨', '피자', '짜장', '배달', '시켜', '주문'].some((kw) => query.includes(kw));
  const isOrder = filters.mode === 'order' || (filters.mode === 'any' && (detectedOrder || query === ''));
  const vibes = filters.vibes ?? [];
  const detectedSituations = detectSituation(query);
  const timeOfDay = getTimeOfDay();

  let pool: FoodItem[];

  if (isOrder) {
    // 시켜먹기: 상황에 따른 풀 선택
    if (vibes.includes('late') || detectedSituations.includes('late') || timeOfDay === 'late') {
      pool = [...ORDER_MENUS_LATE, ...ORDER_MENUS];
    } else if (vibes.includes('diet') || detectedSituations.includes('diet')) {
      pool = [...ORDER_MENUS_DIET, ...ORDER_MENUS];
    } else {
      pool = [...ORDER_MENUS];
    }
  } else {
    // 해먹기: 상황에 따른 풀 선택
    if (vibes.includes('rain') || detectedSituations.includes('rain')) {
      pool = [...COOK_MENUS_RAIN, ...COOK_MENUS];
    } else if (vibes.includes('diet') || detectedSituations.includes('diet')) {
      pool = [...COOK_MENUS_DIET, ...COOK_MENUS];
    } else if (filters.house === 'solo') {
      pool = [...COOK_MENUS_SOLO, ...COOK_MENUS];
    } else {
      pool = [...COOK_MENUS];
    }
  }

  // 재료 필터링 (냉장고 파먹기)
  if (ingredients.length > 0) {
    const ingredientFiltered = pool.filter((item) =>
      ingredients.some((ing) => item.name.includes(ing) || item.reason?.includes(ing)),
    );
    // 매칭 결과가 충분하면 사용, 아니면 전체 풀 유지
    if (ingredientFiltered.length >= 3) pool = [...ingredientFiltered, ...pool];
  }

  // 중복 제거
  const seen = new Set<string>();
  const deduped = pool.filter((item) => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });

  // 쿼리 매칭 점수 계산
  const scored = deduped.map((item) => ({
    item,
    score: scoreMenu(item, query),
    timePriority: TIME_PRIORITY[timeOfDay]?.includes(item.name) ? 1 : 0,
  }));

  // 점수 높은 순 정렬 후 랜덤 셔플 (점수 동일 시 랜덤)
  scored.sort((a, b) => {
    const diff = (b.score + b.timePriority) - (a.score + a.timePriority);
    return diff !== 0 ? diff : Math.random() - 0.5;
  });

  const selected = scored.slice(0, 4).map((s) => s.item);

  return {
    type: isOrder ? 'order' : 'cook',
    items: selected,
    tip: '잠시 후 다시 시도하면 AI 추천을 받을 수 있어요',
    _fallback: true,
  };
};

// 듀얼 모드 로컬 폴백: cook + order 동시 반환
export const localDualRecommend = (
  filters: FilterState,
  query = '',
): DualRecommendResponse => {
  const cookResult = localRecommend({ ...filters, mode: 'cook' }, query);
  const orderResult = localRecommend({ ...filters, mode: 'order' }, query);

  return {
    dual: true,
    cook: {
      items: cookResult.items,
      tip: cookResult.tip,
    },
    order: {
      items: orderResult.items,
      tip: orderResult.tip,
    },
    _fallback: true,
  };
};
