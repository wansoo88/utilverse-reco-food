// 넷플릭스 천하제빵 : 베이크 유어 드림 출연진 & 매장 정보
export interface BakeryEntry {
  id: string;
  name: string;       // 출연진 이름 (별명)
  bakeryName: string;  // 매장명
  location: string;    // 매장 위치
  signature: string[]; // 대표 메뉴
  emoji: string;
  naverMapQuery: string; // 네이버 지도 검색 쿼리
}

// 천하제빵 주요 출연진 빵집 (실제 매장 기반)
export const BAKERY_ENTRIES: BakeryEntry[] = [
  {
    id: 'b1',
    name: '정정훈 (망원동 빵대장)',
    bakeryName: '어글리베이커리',
    location: '서울 마포구 망원동',
    signature: ['대파빵', '말차 맘모스', '크로플'],
    emoji: '🥖',
    naverMapQuery: '어글리베이커리 망원동',
  },
  {
    id: 'b2',
    name: '임동석 (완판의 달인)',
    bakeryName: '수밀 블랑제리',
    location: '서울 구로구',
    signature: ['그린 치아바타', '소금 치아바타', '캄파뉴'],
    emoji: '🍞',
    naverMapQuery: '수밀블랑제리 구로',
  },
  {
    id: 'b3',
    name: '임훈 (연남동 빵터진집)',
    bakeryName: '푸하하크림빵',
    location: '서울 마포구 연남동',
    signature: ['소금크림빵', '제주말차크림빵', '커스터드크림빵'],
    emoji: '🧁',
    naverMapQuery: '푸하하크림빵 연남동',
  },
  {
    id: 'b4',
    name: '김담현 (춘천 싹쓸이)',
    bakeryName: '꼼아파리',
    location: '강원 춘천시',
    signature: ['감자 크루아상', '감자 앙버터', '바게트'],
    emoji: '🥐',
    naverMapQuery: '꼼아파리 춘천',
  },
  {
    id: 'b5',
    name: '이경무 (디저트 마초)',
    bakeryName: '하루베이커리',
    location: '충남 아산시',
    signature: ['호두찰식빵', '크림빵', '식빵'],
    emoji: '🍰',
    naverMapQuery: '하루베이커리 아산',
  },
  {
    id: 'b6',
    name: '윤화영',
    bakeryName: '프레드므아 청담',
    location: '서울 강남구 청담동',
    signature: ['크로와상', '바게트', '까눌레'],
    emoji: '🇫🇷',
    naverMapQuery: '프레드므아 청담',
  },
  {
    id: 'b7',
    name: '김은희',
    bakeryName: '갈릭보이',
    location: '서울 종로구',
    signature: ['갈릭빵', '마늘바게트', '갈릭치아바타'],
    emoji: '🧄',
    naverMapQuery: '갈릭보이 종로',
  },
  {
    id: 'b8',
    name: '김명준',
    bakeryName: '노틀던',
    location: '서울 성동구 서울숲',
    signature: ['사워도우', '르뱅', '호밀빵'],
    emoji: '🌾',
    naverMapQuery: '노틀던 서울숲',
  },
];
