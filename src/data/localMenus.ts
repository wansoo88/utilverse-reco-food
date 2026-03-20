import type { FoodItem } from '@/types/recommend';

// Gemini API 쿼터 초과 시 사용하는 폴백 메뉴 풀
export const COOK_MENUS: FoodItem[] = [
  { name: '김치찌개', reason: '재료가 간단하고 실패 없이 맛있어요', emoji: '🍲' },
  { name: '계란후라이 덮밥', reason: '5분이면 완성되는 초간단 한끼', emoji: '🍳' },
  { name: '된장찌개', reason: '구수하고 건강한 한국의 맛', emoji: '🥘' },
  { name: '파스타', reason: '다양한 소스로 변형 가능한 만능 요리', emoji: '🍝' },
  { name: '볶음밥', reason: '냉장고 속 재료를 활용한 실용적인 한끼', emoji: '🍚' },
  { name: '라면', reason: '언제 먹어도 맛있는 국민 야식', emoji: '🍜' },
  { name: '순두부찌개', reason: '부드럽고 매콤한 한국식 comfort food', emoji: '🍲' },
  { name: '제육볶음', reason: '밥도둑의 정석, 매콤달콤한 돼지고기', emoji: '🥩' },
];

export const ORDER_MENUS: FoodItem[] = [
  { name: '치킨', reason: '언제나 실패 없는 국민 배달 음식', emoji: '🍗' },
  { name: '피자', reason: '나눠먹기 좋고 배달 속도 빠른 인기 메뉴', emoji: '🍕' },
  { name: '짜장면', reason: '40분이면 오는 빠르고 든든한 중식', emoji: '🍜' },
  { name: '떡볶이', reason: '분식집 배달로 즐기는 국민 간식', emoji: '🌶️' },
  { name: '초밥', reason: '집에서 즐기는 프리미엄 일식', emoji: '🍱' },
  { name: '버거', reason: '간편하게 즐기는 패스트푸드의 정석', emoji: '🍔' },
  { name: '족발', reason: '술 없이도 맛있는 쫄깃한 야식', emoji: '🐷' },
  { name: '국밥', reason: '따뜻하고 든든한 한 그릇', emoji: '🍲' },
];
