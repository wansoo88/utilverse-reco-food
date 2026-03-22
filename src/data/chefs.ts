export interface Chef {
  id: string;
  name: string;
  season: 1 | 2;
  rank: number; // 1~10 = Top 10, 11+ = 출연자
  specialty: string;
  signature: string[];
  emoji: string;
}

// 흑백요리사 시즌 1·2 — Top 10 + 출연자
export const CHEFS: Chef[] = [
  // ── 시즌 1 Top 10 ──
  { id: 's1-1', name: '에드워드 리', season: 1, rank: 1, specialty: '한식 퓨전', signature: ['해장국', '갈비찜', '스테이크'], emoji: '👨‍🍳' },
  { id: 's1-2', name: '최현석', season: 1, rank: 2, specialty: '양식', signature: ['파스타', '리조또', '스테이크'], emoji: '🧑‍🍳' },
  { id: 's1-3', name: '여경래', season: 1, rank: 3, specialty: '중식', signature: ['짜장면', '탕수육', '마파두부'], emoji: '👨‍🍳' },
  { id: 's1-4', name: '임기학', season: 1, rank: 4, specialty: '한식', signature: ['삼겹살', '된장찌개', '비빔밥'], emoji: '🧑‍🍳' },
  { id: 's1-5', name: '한식진', season: 1, rank: 5, specialty: '일식', signature: ['초밥', '라멘', '덴푸라'], emoji: '👨‍🍳' },
  { id: 's1-6', name: '나폴리맛피아', season: 1, rank: 6, specialty: '이탈리안', signature: ['피자', '파스타', '뇨끼'], emoji: '🍕' },
  { id: 's1-7', name: '조세호', season: 1, rank: 7, specialty: '한식 캐주얼', signature: ['김치볶음밥', '계란말이'], emoji: '🧑‍🍳' },
  { id: 's1-8', name: '박준우', season: 1, rank: 8, specialty: '디저트', signature: ['마카롱', '크로플', '푸딩'], emoji: '🧁' },
  { id: 's1-9', name: '이원일', season: 1, rank: 9, specialty: '한식 모던', signature: ['불고기', '잡채', '전'], emoji: '👨‍🍳' },
  { id: 's1-10', name: '미카엘', season: 1, rank: 10, specialty: '프렌치', signature: ['오믈렛', '수플레', '부야베스'], emoji: '🇫🇷' },

  // ── 시즌 1 출연자 (Top 10 外) ──
  { id: 's1-11', name: '밥굽남', season: 1, rank: 11, specialty: '한식 유튜버', signature: ['제육볶음', '김치찌개'], emoji: '🔥' },
  { id: 's1-12', name: '흑백분식왕', season: 1, rank: 12, specialty: '분식', signature: ['떡볶이', '김밥', '순대'], emoji: '🧑‍🍳' },
  { id: 's1-13', name: '이정민', season: 1, rank: 13, specialty: '중화요리', signature: ['볶음밥', '군만두', '짬뽕'], emoji: '🥟' },
  { id: 's1-14', name: '김은정', season: 1, rank: 14, specialty: '베이커리', signature: ['소금빵', '크로와상', '식빵'], emoji: '🍞' },
  { id: 's1-15', name: '최지호', season: 1, rank: 15, specialty: '바베큐', signature: ['풀드포크', 'BBQ립', '스모크치킨'], emoji: '🥩' },
  { id: 's1-16', name: '서영미', season: 1, rank: 16, specialty: '한식 반찬', signature: ['잡채', '나물', '젓갈'], emoji: '🥗' },
  { id: 's1-17', name: '장도현', season: 1, rank: 17, specialty: '야식', signature: ['치킨', '라면', '핫도그'], emoji: '🍗' },
  { id: 's1-18', name: '윤태영', season: 1, rank: 18, specialty: '타코', signature: ['타코', '부리또', '나초'], emoji: '🌮' },
  { id: 's1-19', name: '홍서빈', season: 1, rank: 19, specialty: '동남아', signature: ['팟타이', '카오팟', '똠양꿍'], emoji: '🍜' },
  { id: 's1-20', name: '강현우', season: 1, rank: 20, specialty: '도시락', signature: ['연어덮밥', '규동', '소보로밥'], emoji: '🍱' },
  { id: 's1-21', name: '박소연', season: 1, rank: 21, specialty: '비건', signature: ['두부스테이크', '콩국수', '채소볶음'], emoji: '🥦' },
  { id: 's1-22', name: '이재현', season: 1, rank: 22, specialty: '카페메뉴', signature: ['브런치플레이트', '에그베네딕트'], emoji: '☕' },

  // ── 시즌 2 Top 10 ──
  { id: 's2-1', name: '박민준', season: 2, rank: 1, specialty: '한식 모던', signature: ['한우 스테이크', '된장 파스타', '전'], emoji: '👨‍🍳' },
  { id: 's2-2', name: '김도윤', season: 2, rank: 2, specialty: '프렌치', signature: ['부야베스', '에스카르고', '크레이프'], emoji: '🧑‍🍳' },
  { id: 's2-3', name: '이서진', season: 2, rank: 3, specialty: '이탈리안', signature: ['카르보나라', '오소부코', '티라미수'], emoji: '👨‍🍳' },
  { id: 's2-4', name: '정해원', season: 2, rank: 4, specialty: '아시안 퓨전', signature: ['팟타이', '반미', '쌀국수'], emoji: '🧑‍🍳' },
  { id: 's2-5', name: '오세득', season: 2, rank: 5, specialty: '스패니쉬', signature: ['파에야', '추로스', '가스파초'], emoji: '👨‍🍳' },
  { id: 's2-6', name: '한예슬', season: 2, rank: 6, specialty: '한식 디저트', signature: ['약과', '인절미', '호떡'], emoji: '🍡' },
  { id: 's2-7', name: '송민호', season: 2, rank: 7, specialty: '퓨전 중식', signature: ['꿔바로우', '유린기', '마라샹궈'], emoji: '🥢' },
  { id: 's2-8', name: '이하늘', season: 2, rank: 8, specialty: '일식', signature: ['돈카츠', '우동', '규카츠'], emoji: '🍱' },
  { id: 's2-9', name: '김태현', season: 2, rank: 9, specialty: '멕시칸', signature: ['타코', '퀘사디아', '엔칠라다'], emoji: '🌶️' },
  { id: 's2-10', name: '박지원', season: 2, rank: 10, specialty: '한식 고급', signature: ['갈비탕', '수육', '한정식'], emoji: '🍲' },

  // ── 시즌 2 출연자 (Top 10 外) ──
  { id: 's2-11', name: '유현수', season: 2, rank: 11, specialty: '양식 캐주얼', signature: ['햄버거', '피시앤칩스', '스테이크'], emoji: '🍔' },
  { id: 's2-12', name: '안성재', season: 2, rank: 12, specialty: '파인다이닝', signature: ['코스요리', '아뮤즈', '디저트'], emoji: '✨' },
  { id: 's2-13', name: '조현민', season: 2, rank: 13, specialty: '한식 국물', signature: ['갈비탕', '설렁탕', '감자탕'], emoji: '🍲' },
  { id: 's2-14', name: '김서현', season: 2, rank: 14, specialty: '베이킹', signature: ['케이크', '타르트', '쿠키'], emoji: '🎂' },
  { id: 's2-15', name: '이준혁', season: 2, rank: 15, specialty: '중화면요리', signature: ['짬뽕', '우육면', '란저우라멘'], emoji: '🍜' },
  { id: 's2-16', name: '최은영', season: 2, rank: 16, specialty: '한식 밥상', signature: ['보쌈', '김치전', '동태찌개'], emoji: '🍚' },
  { id: 's2-17', name: '한재호', season: 2, rank: 17, specialty: '그릴', signature: ['바베큐 립', '스모크 브리스킷'], emoji: '🔥' },
  { id: 's2-18', name: '윤서아', season: 2, rank: 18, specialty: '쌀국수', signature: ['쌀국수', '분짜', '반쎄오'], emoji: '🇻🇳' },
  { id: 's2-19', name: '정민수', season: 2, rank: 19, specialty: '스트릿푸드', signature: ['닭꼬치', '핫도그', '붕어빵'], emoji: '🧆' },
  { id: 's2-20', name: '박서연', season: 2, rank: 20, specialty: '건강식', signature: ['포케', '아사이볼', '샐러드'], emoji: '🥗' },
  { id: 's2-21', name: '김민재', season: 2, rank: 21, specialty: '야식 전문', signature: ['순대국', '곱창', '족발'], emoji: '🌙' },
  { id: 's2-22', name: '이도경', season: 2, rank: 22, specialty: '카레', signature: ['버터치킨커리', '일본카레', '카레우동'], emoji: '🍛' },
];
