export interface Chef {
  id: string;
  name: string;
  alias?: string; // 별명/닉네임
  season: 1 | 2;
  rank: number;
  spoon: 'white' | 'black'; // 백수저/흑수저
  specialty: string;
  signature: string[];
  emoji: string;
}

// 흑백요리사 시즌 1·2 — 실제 참가자 기반 (TOP 8 / TOP 7)
export const CHEFS: Chef[] = [
  // ── 시즌 1 TOP 8 (2024) ──
  { id: 's1-1', name: '권성준', alias: '나폴리맛피아', season: 1, rank: 1, spoon: 'black', specialty: '이탈리안', signature: ['밤 티라미수', '피자', '파스타'], emoji: '🍕' },
  { id: 's1-2', name: '에드워드 리', season: 1, rank: 2, spoon: 'white', specialty: '한식 퓨전', signature: ['한식 퓨전', '갈비찜', '스테이크'], emoji: '👨‍🍳' },
  { id: 's1-3', name: '장호준', season: 1, rank: 3, spoon: 'white', specialty: '일식', signature: ['간모도키', '풋콩 두부 그라탕'], emoji: '🍣' },
  { id: 's1-4', name: '윤남노', alias: '요리하는 돌아이', season: 1, rank: 4, spoon: 'black', specialty: '한식', signature: ['한식 창작요리', '비빔밥'], emoji: '🔥' },
  { id: 's1-5', name: '강승원', alias: '트리플스타', season: 1, rank: 5, spoon: 'white', specialty: '프렌치', signature: ['두부 멘보샤', '프렌치 코스'], emoji: '⭐' },
  { id: 's1-6', name: '김미령', alias: '이모카세 1호', season: 1, rank: 6, spoon: 'black', specialty: '한식 가정식', signature: ['두부 만두', '두부찌개'], emoji: '🥘' },
  { id: 's1-7', name: '정지선', season: 1, rank: 7, spoon: 'white', specialty: '한식', signature: ['황금두부', '두부 딤섬'], emoji: '🧑‍🍳' },
  { id: 's1-8', name: '최현석', season: 1, rank: 8, spoon: 'white', specialty: '양식', signature: ['파스타', '리조또', '스테이크'], emoji: '🧑‍🍳' },

  // ── 시즌 2 TOP 7 (2025-2026) ──
  { id: 's2-1', name: '최강록', alias: '조림핑', season: 2, rank: 1, spoon: 'white', specialty: '한식 / 조림', signature: ['장어 조림', '한식 조림'], emoji: '🏆' },
  { id: 's2-2', name: '이하성', alias: '요리괴물', season: 2, rank: 2, spoon: 'black', specialty: '프렌치 파인다이닝', signature: ['파인다이닝 코스', '프렌치 요리'], emoji: '👨‍🍳' },
  { id: 's2-3', name: '후덕죽', season: 2, rank: 3, spoon: 'white', specialty: '중식', signature: ['불도장', '중식 보양식'], emoji: '🥢' },
  { id: 's2-4', name: '정호영', season: 2, rank: 4, spoon: 'white', specialty: '일식', signature: ['정통 일식', '이자카야 메뉴'], emoji: '🍱' },
  { id: 's2-5', name: '윤나라', alias: '술 빚는 윤주모', season: 2, rank: 5, spoon: 'black', specialty: '전통주 / 한식', signature: ['전통주 페어링', '한식 창작'], emoji: '🍶' },
  { id: 's2-6', name: '선재스님', season: 2, rank: 6, spoon: 'white', specialty: '사찰음식', signature: ['사찰음식', '채식 요리'], emoji: '🙏' },
  { id: 's2-7', name: '임성근', season: 2, rank: 7, spoon: 'white', specialty: '한식', signature: ['한식 정통', '당근 잡채'], emoji: '🍚' },
];
