import type { FoodItem } from '@/types/recommend';

// ── 해먹기 메뉴 풀 ────────────────────────────────────────────────────────────

export const COOK_MENUS: FoodItem[] = [
  // 기본 한식
  { name: '김치찌개', reason: '재료 간단, 언제 먹어도 실패 없는 맛', emoji: '🍲' },
  { name: '된장찌개', reason: '구수하고 건강한 한국의 국민 반찬', emoji: '🥘' },
  { name: '순두부찌개', reason: '부드럽고 매콤, 한그릇으로 든든', emoji: '🍲' },
  { name: '부대찌개', reason: '햄·소시지·라면 조합의 진한 국물', emoji: '🍲' },
  { name: '제육볶음', reason: '밥도둑 정석, 매콤달콤 돼지고기', emoji: '🥩' },
  { name: '닭볶음탕', reason: '양념 배인 닭고기 + 감자의 환상 조합', emoji: '🍗' },
  { name: '갈비찜', reason: '특별한 날 분위기 나는 진한 찜요리', emoji: '🥩' },
  { name: '삼겹살 구이', reason: '집에서 즐기는 숯불 느낌 고기파티', emoji: '🥓' },
  // 간단 요리
  { name: '계란후라이 덮밥', reason: '5분 완성, 바쁜 날 최고의 한끼', emoji: '🍳' },
  { name: '볶음밥', reason: '냉장고 재료 활용 실용적 한끼', emoji: '🍚' },
  { name: '참치마요 덮밥', reason: '10분이면 완성되는 편의점급 맛', emoji: '🐟' },
  { name: '계란말이', reason: '간단하지만 고급스러운 반찬', emoji: '🥚' },
  { name: '콩나물국밥', reason: '해장에 딱 맞는 시원한 국물 한그릇', emoji: '🍜' },
  // 면류
  { name: '라면', reason: '언제 먹어도 맛있는 국민 야식', emoji: '🍜' },
  { name: '비빔라면', reason: '매콤새콤, 여름에 더 맛있는 라면', emoji: '🌶️' },
  { name: '파스타', reason: '소스 종류 따라 무한 변신 가능', emoji: '🍝' },
  { name: '봉골레 파스타', reason: '조개향 가득 이탈리안 감성', emoji: '🍝' },
  { name: '우동', reason: '쫄깃한 면발과 시원한 국물', emoji: '🍜' },
  { name: '잡채', reason: '파티에서도 일상에서도 어울리는 요리', emoji: '🍜' },
  // 건강식
  { name: '닭가슴살 샐러드', reason: '다이어트 중에도 든든한 한끼', emoji: '🥗' },
  { name: '두부 스테이크', reason: '칼로리 낮고 단백질 높은 건강식', emoji: '🥬' },
  { name: '연어 덮밥', reason: '오메가3 풍부, 프리미엄 집밥', emoji: '🐟' },
  { name: '아보카도 토스트', reason: '트렌디한 브런치 느낌 홈카페 메뉴', emoji: '🥑' },
  // 특별식
  { name: '카레라이스', reason: '남녀노소 좋아하는 향긋한 카레', emoji: '🍛' },
  { name: '떡볶이', reason: '매콤달콤 국민 간식을 집에서', emoji: '🌶️' },
  { name: '오므라이스', reason: '폭신한 달걀 속 케첩밥의 추억', emoji: '🍳' },
  { name: '감자전', reason: '비오는 날 생각나는 고소한 전', emoji: '🥔' },
  { name: '김치전', reason: '막걸리 한 잔이 생각나는 바삭 전', emoji: '🥞' },
];

export const COOK_MENUS_SOLO: FoodItem[] = [
  { name: '계란후라이 덮밥', reason: '혼밥 최강자, 5분이면 완성', emoji: '🍳' },
  { name: '참치마요 덮밥', reason: '1인분 딱 맞는 간편 덮밥', emoji: '🐟' },
  { name: '라면', reason: '혼자 먹기 좋은 야식의 정석', emoji: '🍜' },
  { name: '볶음밥', reason: '냉장고 남은 재료로 뚝딱', emoji: '🍚' },
  { name: '아보카도 토스트', reason: '브런치 기분 내는 혼밥 메뉴', emoji: '🥑' },
  { name: '닭가슴살 샐러드', reason: '다이어트 혼밥으로 딱', emoji: '🥗' },
];

export const COOK_MENUS_RAIN: FoodItem[] = [
  { name: '부대찌개', reason: '비오는 날 생각나는 얼큰한 국물', emoji: '🍲' },
  { name: '칼국수', reason: '비 오는 날 최고의 손칼국수', emoji: '🍜' },
  { name: '감자전', reason: '빗소리 들으며 먹는 바삭한 전', emoji: '🥔' },
  { name: '김치전', reason: '비오는 날 전통 간식, 막걸리 한잔', emoji: '🥞' },
  { name: '순두부찌개', reason: '빗속에서 먹는 얼큰한 순두부', emoji: '🍲' },
  { name: '된장찌개', reason: '구수한 냄새가 비 오는 날 더 향긋', emoji: '🥘' },
];

export const COOK_MENUS_DIET: FoodItem[] = [
  { name: '닭가슴살 샐러드', reason: '고단백 저칼로리 다이어트 필수', emoji: '🥗' },
  { name: '두부 스테이크', reason: '포만감 높고 칼로리 낮은 건강식', emoji: '🥬' },
  { name: '계란흰자 스크램블', reason: '단백질 폭탄, 아침 다이어트식', emoji: '🥚' },
  { name: '곤약볶음밥', reason: '밥 대신 곤약으로 칼로리 절반', emoji: '🍚' },
  { name: '구운 연어', reason: '오메가3 + 고단백 완벽 다이어트식', emoji: '🐟' },
  { name: '채소 된장국', reason: '저나트륨 건강 국물 한그릇', emoji: '🥦' },
];

// ── 시켜먹기 메뉴 풀 ────────────────────────────────────────────────────────────

export const ORDER_MENUS: FoodItem[] = [
  // 대표 배달
  { name: '치킨', reason: '언제나 실패 없는 국민 배달 음식', emoji: '🍗' },
  { name: '피자', reason: '나눠 먹기 좋고 배달 빠른 인기 메뉴', emoji: '🍕' },
  { name: '짜장면', reason: '40분이면 오는 빠르고 든든한 중식', emoji: '🍜' },
  { name: '짬뽕', reason: '얼큰하고 해물 가득 인기 중식', emoji: '🍜' },
  { name: '탕수육', reason: '바삭한 탕수육, 중식 배달의 꽃', emoji: '🍖' },
  { name: '떡볶이 세트', reason: '떡볶이+순대+튀김 완벽 분식 세트', emoji: '🌶️' },
  // 한식 배달
  { name: '국밥', reason: '따뜻하고 든든한 한그릇 배달', emoji: '🍲' },
  { name: '삼겹살 배달', reason: '집에서 구워 먹는 고기파티', emoji: '🥓' },
  { name: '갈비탕', reason: '진한 국물의 프리미엄 한식 배달', emoji: '🍲' },
  { name: '도시락', reason: '균형 잡힌 한식 도시락 배달', emoji: '🍱' },
  // 간식/야식
  { name: '족발', reason: '쫄깃한 족발, 맥주 한잔과 최상', emoji: '🐷' },
  { name: '보쌈', reason: '신선한 채소와 함께 즐기는 수육', emoji: '🥬' },
  { name: '마라탕', reason: '중독성 있는 얼얼한 마라 국물', emoji: '🌶️' },
  { name: '초밥', reason: '집에서 즐기는 프리미엄 일식 세트', emoji: '🍱' },
  { name: '버거', reason: '간편하게 즐기는 패스트푸드 세트', emoji: '🍔' },
  { name: '샌드위치', reason: '가볍게 한끼 해결하는 브런치풍', emoji: '🥪' },
  // 특별 메뉴
  { name: '스시 오마카세 배달', reason: '특별한 날 집에서 즐기는 오마카세', emoji: '🍣' },
  { name: '수제버거', reason: '두툼한 패티, 감자튀김 세트', emoji: '🍔' },
  { name: '파스타 & 리조또', reason: '이탈리안 레스토랑 배달로 즐기기', emoji: '🍝' },
  { name: '태국음식 세트', reason: '팟타이·똠얌꿍 이국적인 배달', emoji: '🌿' },
];

export const ORDER_MENUS_LATE: FoodItem[] = [
  { name: '야식 치킨', reason: '야식의 끝판왕, 맥주와 최강 조합', emoji: '🍗' },
  { name: '족발', reason: '늦은 밤 쫄깃한 족발 야식', emoji: '🐷' },
  { name: '라면 배달', reason: '야심한 밤 출출함 해결 1순위', emoji: '🍜' },
  { name: '피자', reason: '야식으로 딱인 치즈 가득 피자', emoji: '🍕' },
  { name: '편의점 삼각김밥 세트', reason: '가볍게 해결하는 야식 조합', emoji: '🍙' },
  { name: '마라탕', reason: '중독적인 야식, 밤에 더 맛있는 마라', emoji: '🌶️' },
];

export const ORDER_MENUS_DIET: FoodItem[] = [
  { name: '닭가슴살 도시락', reason: '다이어트 맞춤 고단백 배달', emoji: '🍱' },
  { name: '샐러드 배달', reason: '칼로리 계산된 건강 샐러드', emoji: '🥗' },
  { name: '저칼로리 한식 도시락', reason: '균형 잡힌 다이어트 한식 세트', emoji: '🍱' },
  { name: '아사이볼', reason: '트렌디한 슈퍼푸드 다이어트식', emoji: '🫐' },
  { name: '그릴 연어 도시락', reason: '오메가3 가득 다이어트 배달', emoji: '🐟' },
];
