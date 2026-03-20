import { COOK_MENUS, ORDER_MENUS } from '@/data/localMenus';
import type { FilterState } from '@/types/filter';
import type { RecommendResponse } from '@/types/recommend';

// Gemini API 실패 시 로컬 폴백 추천
export const localRecommend = (filters: FilterState): RecommendResponse => {
  const pool = filters.mode === 'order' ? ORDER_MENUS : COOK_MENUS;

  // 랜덤 셔플 후 5개 선택
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);

  return {
    type: filters.mode === 'order' ? 'order' : 'cook',
    items: shuffled,
    tip: '잠시 후 다시 시도하면 AI 추천을 받을 수 있어요',
    _fallback: true,
  };
};
