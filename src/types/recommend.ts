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

export interface RecommendError {
  error: 'food_only' | 'rate_limit' | 'unknown';
}
