export interface FoodItem {
  name: string;
  reason: string;
  emoji?: string;
}

/** AI/로컬 공통 — 메뉴 3개 반환 (cook/order 구분 없음) */
export interface MenuRecommendResponse {
  items: FoodItem[];
  tip?: string;
  _fallback?: boolean;
}

/** 레거시 호환: 단일 모드 (메뉴 추천 탭에서 필터 사용 시) */
export interface CookResponse {
  type: 'cook';
  items: FoodItem[];
  tip?: string;
  _fallback?: boolean;
}

export interface OrderResponse {
  type: 'order';
  items: FoodItem[];
  tip?: string;
  _fallback?: boolean;
}

export type RecommendResponse = CookResponse | OrderResponse;

/** 통합 응답 타입 */
export type AnyRecommendResponse = MenuRecommendResponse | RecommendResponse;

export interface RecommendError {
  error: 'food_only' | 'rate_limit' | 'unknown';
}

/** 네이버 근처 맛집 */
export interface NearbyRestaurant {
  name: string;
  category: string;
  address: string;
  roadAddress: string;
  telephone: string;
  distance: number;
  naverMapUrl: string;
}
