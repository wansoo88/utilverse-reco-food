export interface Chef {
  id: string;
  name: string;
  season: 1 | 2;
  rank: number;
  specialty: string;
  signature: string[];
  emoji: string;
}

// 흑백요리사 시즌 1·2 Top 10
export const CHEFS: Chef[] = [
  // 시즌 1
  { id: 'edward', name: '에드워드 리', season: 1, rank: 1, specialty: '한식 퓨전', signature: ['해장국', '갈비찜', '스테이크'], emoji: '👨‍🍳' },
  { id: 'choi', name: '최현석', season: 1, rank: 2, specialty: '양식', signature: ['파스타', '리조또', '스테이크'], emoji: '🧑‍🍳' },
  { id: 'yeo', name: '여경래', season: 1, rank: 3, specialty: '중식', signature: ['짜장면', '탕수육', '마파두부'], emoji: '👨‍🍳' },
  { id: 'lim', name: '임기학', season: 1, rank: 4, specialty: '한식', signature: ['삼겹살', '된장찌개', '비빔밥'], emoji: '🧑‍🍳' },
  { id: 'han', name: '한식진', season: 1, rank: 5, specialty: '일식', signature: ['초밥', '라멘', '덴푸라'], emoji: '👨‍🍳' },
  // 시즌 2
  { id: 'park2', name: '박민준', season: 2, rank: 1, specialty: '한식 모던', signature: ['한우 스테이크', '된장 파스타', '전'], emoji: '👨‍🍳' },
  { id: 'kim2', name: '김도윤', season: 2, rank: 2, specialty: '프렌치', signature: ['부야베스', '에스카르고', '크레이프'], emoji: '🧑‍🍳' },
  { id: 'lee2', name: '이서진', season: 2, rank: 3, specialty: '이탈리안', signature: ['카르보나라', '오소부코', '티라미수'], emoji: '👨‍🍳' },
  { id: 'jung2', name: '정해원', season: 2, rank: 4, specialty: '아시안 퓨전', signature: ['팟타이', '반미', '쌀국수'], emoji: '🧑‍🍳' },
  { id: 'oh2', name: '오세득', season: 2, rank: 5, specialty: '스패니쉬', signature: ['파에야', '추로스', '가스파초'], emoji: '👨‍🍳' },
];
