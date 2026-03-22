export interface FoodItem {
  name: string;
  reason: string;
  emoji?: string;
}

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

/** AI 검색 모드: cook + order 동시 반환 */
export interface DualRecommendResponse {
  dual: true;
  cook: {
    items: FoodItem[];
    tip?: string;
  };
  order: {
    items: FoodItem[];
    tip?: string;
  };
  _fallback?: boolean;
}

export type AnyRecommendResponse = RecommendResponse | DualRecommendResponse;

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
  distance: number; // meters
  naverMapUrl: string;
}
