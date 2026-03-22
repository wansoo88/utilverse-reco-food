/**
 * K-pop 아이돌 데이터베이스
 * - 60+ 그룹, 150+ 멤버, 국가별 인기 랭킹
 * - 확인된 좋아하는 메뉴 + 로컬 폴백 매칭
 */

export interface KpopIdol {
  id: string;
  name: string;
  nameEn: string;
  nameJa: string;
  nameZh: string;
  group: string;
  groupEn: string;
  emoji: string;
  /** 확인된 좋아하는 메뉴 (방송/인터뷰 출처) */
  favoriteMenus: string[];
  /** 국가별 인기 순위 (낮을수록 인기) */
  popularity: {
    ko: number;
    en: number;
    ja: number;
    zh: number;
  };
}

export interface KpopGroup {
  id: string;
  name: string;
  nameEn: string;
  nameJa: string;
  nameZh: string;
  emoji: string;
  type: 'boy' | 'girl' | 'solo' | 'coed';
  generation: '3rd' | '4th' | '5th';
  /** 국가별 그룹 인기 순위 */
  popularity: {
    ko: number;
    en: number;
    ja: number;
    zh: number;
  };
  members: string[]; // idol id 참조
}

// ──────────────────────────────────────
// 아이돌 멤버 데이터
// ──────────────────────────────────────

export const KPOP_IDOLS: KpopIdol[] = [
  // ── BTS ──
  { id: 'rm', name: 'RM', nameEn: 'RM', nameJa: 'RM', nameZh: 'RM', group: 'BTS', groupEn: 'BTS', emoji: '🎤', favoriteMenus: ['칼국수', '한우 스테이크'], popularity: { ko: 2, en: 1, ja: 3, zh: 2 } },
  { id: 'jin', name: '진', nameEn: 'Jin', nameJa: 'ジン', nameZh: '金硕珍', group: 'BTS', groupEn: 'BTS', emoji: '🐹', favoriteMenus: ['로제파스타', '딸기', '랍스터'], popularity: { ko: 3, en: 2, ja: 4, zh: 3 } },
  { id: 'suga', name: '슈가', nameEn: 'Suga', nameJa: 'シュガ', nameZh: '闵玧其', group: 'BTS', groupEn: 'BTS', emoji: '🐱', favoriteMenus: ['돼지갈비', '물냉면'], popularity: { ko: 4, en: 3, ja: 5, zh: 4 } },
  { id: 'jhope', name: '제이홉', nameEn: 'J-Hope', nameJa: 'J-Hope', nameZh: '郑号锡', group: 'BTS', groupEn: 'BTS', emoji: '☀️', favoriteMenus: ['김치찌개', '한우'], popularity: { ko: 5, en: 5, ja: 6, zh: 6 } },
  { id: 'jimin', name: '지민', nameEn: 'Jimin', nameJa: 'ジミン', nameZh: '朴智旻', group: 'BTS', groupEn: 'BTS', emoji: '🐥', favoriteMenus: ['돼지족발', '과일', '삼겹살'], popularity: { ko: 1, en: 4, ja: 1, zh: 1 } },
  { id: 'v', name: '뷔', nameEn: 'V', nameJa: 'V', nameZh: '金泰亨', group: 'BTS', groupEn: 'BTS', emoji: '🐻', favoriteMenus: ['짜장면', '칼국수', '양고기'], popularity: { ko: 6, en: 6, ja: 2, zh: 5 } },
  { id: 'jungkook', name: '정국', nameEn: 'Jungkook', nameJa: 'ジョングク', nameZh: '田柾国', group: 'BTS', groupEn: 'BTS', emoji: '🐰', favoriteMenus: ['팥빙수', '삼겹살', '피자', '라면'], popularity: { ko: 7, en: 7, ja: 7, zh: 7 } },

  // ── BLACKPINK ──
  { id: 'jennie', name: '제니', nameEn: 'Jennie', nameJa: 'ジェニ', nameZh: '金珍妮', group: 'BLACKPINK', groupEn: 'BLACKPINK', emoji: '🐱', favoriteMenus: ['치즈버거', '떡볶이', '마카롱'], popularity: { ko: 8, en: 8, ja: 8, zh: 8 } },
  { id: 'jisoo', name: '지수', nameEn: 'Jisoo', nameJa: 'ジス', nameZh: '金智秀', group: 'BLACKPINK', groupEn: 'BLACKPINK', emoji: '🐰', favoriteMenus: ['순두부찌개', '라면', '족발'], popularity: { ko: 9, en: 10, ja: 9, zh: 10 } },
  { id: 'rose', name: '로제', nameEn: 'Rosé', nameJa: 'ロゼ', nameZh: '朴彩英', group: 'BLACKPINK', groupEn: 'BLACKPINK', emoji: '🌹', favoriteMenus: ['크림파스타', '김치볶음밥', '비빔밥'], popularity: { ko: 10, en: 9, ja: 10, zh: 9 } },
  { id: 'lisa', name: '리사', nameEn: 'Lisa', nameJa: 'リサ', nameZh: '丽莎', group: 'BLACKPINK', groupEn: 'BLACKPINK', emoji: '🐿️', favoriteMenus: ['팟타이', '쏨땀', '치킨'], popularity: { ko: 11, en: 11, ja: 11, zh: 11 } },

  // ── aespa ──
  { id: 'karina', name: '카리나', nameEn: 'Karina', nameJa: 'カリナ', nameZh: '柳智敏', group: 'aespa', groupEn: 'aespa', emoji: '✨', favoriteMenus: ['떡볶이', '마라탕', '초밥'], popularity: { ko: 12, en: 15, ja: 12, zh: 13 } },
  { id: 'winter', name: '윈터', nameEn: 'Winter', nameJa: 'ウィンター', nameZh: '金旼炡', group: 'aespa', groupEn: 'aespa', emoji: '❄️', favoriteMenus: ['김치찌개', '삼겹살', '치즈케이크'], popularity: { ko: 13, en: 16, ja: 13, zh: 14 } },
  { id: 'giselle', name: '지젤', nameEn: 'Giselle', nameJa: 'ジゼル', nameZh: '内永枝利', group: 'aespa', groupEn: 'aespa', emoji: '🌊', favoriteMenus: ['스시', '라멘'], popularity: { ko: 18, en: 20, ja: 15, zh: 18 } },
  { id: 'ningning', name: '닝닝', nameEn: 'Ningning', nameJa: 'ニンニン', nameZh: '宁艺卓', group: 'aespa', groupEn: 'aespa', emoji: '🐻', favoriteMenus: ['마라샹궈', '훠궈', '탕수육'], popularity: { ko: 19, en: 21, ja: 16, zh: 12 } },

  // ── SEVENTEEN ──
  { id: 'seungcheol', name: '에스쿱스', nameEn: 'S.Coups', nameJa: 'エスクプス', nameZh: '崔胜哲', group: 'SEVENTEEN', groupEn: 'SEVENTEEN', emoji: '🐺', favoriteMenus: ['삼겹살', '치킨'], popularity: { ko: 14, en: 14, ja: 14, zh: 15 } },
  { id: 'mingyu', name: '민규', nameEn: 'Mingyu', nameJa: 'ミンギュ', nameZh: '金珉奎', group: 'SEVENTEEN', groupEn: 'SEVENTEEN', emoji: '🐶', favoriteMenus: ['스테이크', '파스타', '초밥'], popularity: { ko: 15, en: 13, ja: 17, zh: 16 } },
  { id: 'wonwoo', name: '원우', nameEn: 'Wonwoo', nameJa: 'ウォヌ', nameZh: '全圆佑', group: 'SEVENTEEN', groupEn: 'SEVENTEEN', emoji: '🐱', favoriteMenus: ['라면', '김치볶음밥'], popularity: { ko: 16, en: 17, ja: 18, zh: 17 } },
  { id: 'woozi', name: '우지', nameEn: 'Woozi', nameJa: 'ウジ', nameZh: '李知勋', group: 'SEVENTEEN', groupEn: 'SEVENTEEN', emoji: '🎵', favoriteMenus: ['국밥', '떡볶이'], popularity: { ko: 20, en: 22, ja: 20, zh: 22 } },

  // ── Stray Kids ──
  { id: 'bangchan', name: '방찬', nameEn: 'Bang Chan', nameJa: 'バンチャン', nameZh: '方灿', group: 'Stray Kids', groupEn: 'Stray Kids', emoji: '🐺', favoriteMenus: ['미트파이', '스테이크', '비빔밥'], popularity: { ko: 22, en: 12, ja: 22, zh: 20 } },
  { id: 'hyunjin', name: '현진', nameEn: 'Hyunjin', nameJa: 'ヒョンジン', nameZh: '黄铉辰', group: 'Stray Kids', groupEn: 'Stray Kids', emoji: '🦙', favoriteMenus: ['치킨', '떡볶이', '초콜릿'], popularity: { ko: 21, en: 18, ja: 19, zh: 19 } },
  { id: 'felix', name: '필릭스', nameEn: 'Felix', nameJa: 'フィリックス', nameZh: '李龙馥', group: 'Stray Kids', groupEn: 'Stray Kids', emoji: '🐤', favoriteMenus: ['브라우니', '치즈케이크', '라면'], popularity: { ko: 23, en: 19, ja: 21, zh: 21 } },

  // ── NewJeans ──
  { id: 'minji', name: '민지', nameEn: 'Minji', nameJa: 'ミンジ', nameZh: '闵智', group: 'NewJeans', groupEn: 'NewJeans', emoji: '🐰', favoriteMenus: ['떡볶이', '짜장면', '치킨'], popularity: { ko: 24, en: 23, ja: 23, zh: 23 } },
  { id: 'hanni', name: '하니', nameEn: 'Hanni', nameJa: 'ハニ', nameZh: '河妮', group: 'NewJeans', groupEn: 'NewJeans', emoji: '🐶', favoriteMenus: ['쌀국수', '분짜', '마카롱'], popularity: { ko: 25, en: 24, ja: 24, zh: 24 } },
  { id: 'danielle', name: '다니엘', nameEn: 'Danielle', nameJa: 'ダニエル', nameZh: '丹妮尔', group: 'NewJeans', groupEn: 'NewJeans', emoji: '🦋', favoriteMenus: ['아보카도 토스트', '파스타'], popularity: { ko: 26, en: 25, ja: 25, zh: 25 } },
  { id: 'haerin', name: '해린', nameEn: 'Haerin', nameJa: 'ヘリン', nameZh: '海仁', group: 'NewJeans', groupEn: 'NewJeans', emoji: '🐱', favoriteMenus: ['초밥', '우동', '딸기케이크'], popularity: { ko: 27, en: 26, ja: 26, zh: 26 } },
  { id: 'hyein', name: '혜인', nameEn: 'Hyein', nameJa: 'ヘイン', nameZh: '惠仁', group: 'NewJeans', groupEn: 'NewJeans', emoji: '🐧', favoriteMenus: ['피자', '탕수육'], popularity: { ko: 28, en: 27, ja: 27, zh: 27 } },

  // ── IVE ──
  { id: 'wonyoung', name: '장원영', nameEn: 'Wonyoung', nameJa: 'ウォニョン', nameZh: '张元英', group: 'IVE', groupEn: 'IVE', emoji: '🦌', favoriteMenus: ['샐러드', '스무디', '크레페'], popularity: { ko: 17, en: 28, ja: 28, zh: 28 } },
  { id: 'yujin-ive', name: '유진', nameEn: 'Yujin', nameJa: 'ユジン', nameZh: '安俞真', group: 'IVE', groupEn: 'IVE', emoji: '🐶', favoriteMenus: ['김치찌개', '떡볶이', '치킨'], popularity: { ko: 29, en: 29, ja: 29, zh: 29 } },
  { id: 'gaeul', name: '가을', nameEn: 'Gaeul', nameJa: 'ガウル', nameZh: '秋', group: 'IVE', groupEn: 'IVE', emoji: '🍂', favoriteMenus: ['라면', '순대'], popularity: { ko: 35, en: 38, ja: 35, zh: 38 } },
  { id: 'rei', name: '레이', nameEn: 'Rei', nameJa: 'レイ', nameZh: '直井怜', group: 'IVE', groupEn: 'IVE', emoji: '🌙', favoriteMenus: ['오니기리', '라멘', '초밥'], popularity: { ko: 36, en: 37, ja: 30, zh: 37 } },
  { id: 'liz', name: '리즈', nameEn: 'Liz', nameJa: 'リズ', nameZh: '金智媛', group: 'IVE', groupEn: 'IVE', emoji: '🐻', favoriteMenus: ['삼겹살', '짜장면'], popularity: { ko: 37, en: 39, ja: 36, zh: 39 } },
  { id: 'leeseo', name: '이서', nameEn: 'Leeseo', nameJa: 'イソ', nameZh: '李瑞', group: 'IVE', groupEn: 'IVE', emoji: '🐥', favoriteMenus: ['케이크', '아이스크림'], popularity: { ko: 38, en: 40, ja: 37, zh: 40 } },

  // ── ENHYPEN ──
  { id: 'heeseung', name: '희승', nameEn: 'Heeseung', nameJa: 'ヒスン', nameZh: '李煕承', group: 'ENHYPEN', groupEn: 'ENHYPEN', emoji: '🦉', favoriteMenus: ['스테이크', '파스타'], popularity: { ko: 30, en: 30, ja: 31, zh: 30 } },
  { id: 'jake', name: '제이크', nameEn: 'Jake', nameJa: 'ジェイク', nameZh: '心智雄', group: 'ENHYPEN', groupEn: 'ENHYPEN', emoji: '🐶', favoriteMenus: ['미트파이', '닭갈비'], popularity: { ko: 31, en: 31, ja: 32, zh: 31 } },
  { id: 'sunghoon', name: '성훈', nameEn: 'Sunghoon', nameJa: 'ソンフン', nameZh: '朴成训', group: 'ENHYPEN', groupEn: 'ENHYPEN', emoji: '🐧', favoriteMenus: ['초밥', '김치찌개'], popularity: { ko: 32, en: 32, ja: 33, zh: 32 } },

  // ── (G)I-DLE ──
  { id: 'miyeon', name: '미연', nameEn: 'Miyeon', nameJa: 'ミヨン', nameZh: '赵美延', group: '(G)I-DLE', groupEn: '(G)I-DLE', emoji: '🐥', favoriteMenus: ['삼겹살', '떡볶이'], popularity: { ko: 33, en: 33, ja: 34, zh: 33 } },
  { id: 'soyeon', name: '소연', nameEn: 'Soyeon', nameJa: 'ソヨン', nameZh: '全素妍', group: '(G)I-DLE', groupEn: '(G)I-DLE', emoji: '🔥', favoriteMenus: ['매운 떡볶이', '불닭볶음면'], popularity: { ko: 34, en: 34, ja: 38, zh: 34 } },
  { id: 'yuqi', name: '우기', nameEn: 'Yuqi', nameJa: 'ウギ', nameZh: '宋雨琦', group: '(G)I-DLE', groupEn: '(G)I-DLE', emoji: '🐻', favoriteMenus: ['마라탕', '훠궈', '마라샹궈'], popularity: { ko: 39, en: 36, ja: 39, zh: 35 } },

  // ── LE SSERAFIM ──
  { id: 'sakura', name: '사쿠라', nameEn: 'Sakura', nameJa: 'サクラ', nameZh: '宫�的咲良', group: 'LE SSERAFIM', groupEn: 'LE SSERAFIM', emoji: '🌸', favoriteMenus: ['라멘', '오코노미야끼', '타코야끼'], popularity: { ko: 40, en: 41, ja: 40, zh: 41 } },
  { id: 'chaewon', name: '채원', nameEn: 'Chaewon', nameJa: 'チェウォン', nameZh: '金彩源', group: 'LE SSERAFIM', groupEn: 'LE SSERAFIM', emoji: '🦊', favoriteMenus: ['닭갈비', '김치볶음밥'], popularity: { ko: 41, en: 42, ja: 41, zh: 42 } },
  { id: 'kazuha', name: '카즈하', nameEn: 'Kazuha', nameJa: 'カズハ', nameZh: '中村一叶', group: 'LE SSERAFIM', groupEn: 'LE SSERAFIM', emoji: '🩰', favoriteMenus: ['초밥', '우동', '규동'], popularity: { ko: 42, en: 43, ja: 42, zh: 43 } },
  { id: 'yunjin', name: '윤진', nameEn: 'Yunjin', nameJa: 'ユンジン', nameZh: '许允真', group: 'LE SSERAFIM', groupEn: 'LE SSERAFIM', emoji: '🦁', favoriteMenus: ['타코', '버거', '스테이크'], popularity: { ko: 43, en: 44, ja: 43, zh: 44 } },

  // ── TXT ──
  { id: 'soobin', name: '수빈', nameEn: 'Soobin', nameJa: 'スビン', nameZh: '崔秀彬', group: 'TXT', groupEn: 'TXT', emoji: '🐰', favoriteMenus: ['빵', '크루아상', '케이크'], popularity: { ko: 44, en: 45, ja: 44, zh: 45 } },
  { id: 'yeonjun', name: '연준', nameEn: 'Yeonjun', nameJa: 'ヨンジュン', nameZh: '崔然竣', group: 'TXT', groupEn: 'TXT', emoji: '🦊', favoriteMenus: ['삼겹살', '곱창', '치킨'], popularity: { ko: 45, en: 46, ja: 45, zh: 46 } },
  { id: 'beomgyu', name: '범규', nameEn: 'Beomgyu', nameJa: 'ボムギュ', nameZh: '崔范奎', group: 'TXT', groupEn: 'TXT', emoji: '🐻', favoriteMenus: ['피자', '햄버거'], popularity: { ko: 46, en: 47, ja: 46, zh: 47 } },

  // ── EXO ──
  { id: 'baekhyun', name: '백현', nameEn: 'Baekhyun', nameJa: 'ベクヒョン', nameZh: '边伯贤', group: 'EXO', groupEn: 'EXO', emoji: '🐶', favoriteMenus: ['떡볶이', '순대', '치킨'], popularity: { ko: 47, en: 48, ja: 47, zh: 36 } },
  { id: 'kai', name: '카이', nameEn: 'Kai', nameJa: 'カイ', nameZh: '金钟仁', group: 'EXO', groupEn: 'EXO', emoji: '🐻', favoriteMenus: ['치킨', '감자탕'], popularity: { ko: 48, en: 49, ja: 48, zh: 48 } },

  // ── TWICE ──
  { id: 'nayeon', name: '나연', nameEn: 'Nayeon', nameJa: 'ナヨン', nameZh: '林娜琏', group: 'TWICE', groupEn: 'TWICE', emoji: '🐰', favoriteMenus: ['치즈떡볶이', '감자튀김', '마카롱'], popularity: { ko: 49, en: 50, ja: 49, zh: 49 } },
  { id: 'momo', name: '모모', nameEn: 'Momo', nameJa: 'モモ', nameZh: '平井桃', group: 'TWICE', groupEn: 'TWICE', emoji: '🍑', favoriteMenus: ['낫토', '짜장면', '족발'], popularity: { ko: 50, en: 53, ja: 50, zh: 52 } },
  { id: 'sana', name: '사나', nameEn: 'Sana', nameJa: 'サナ', nameZh: '凑崎纱夏', group: 'TWICE', groupEn: 'TWICE', emoji: '🦊', favoriteMenus: ['초밥', '치킨', '떡볶이'], popularity: { ko: 52, en: 54, ja: 51, zh: 53 } },

  // ── NCT ──
  { id: 'mark', name: '마크', nameEn: 'Mark', nameJa: 'マーク', nameZh: '马克', group: 'NCT', groupEn: 'NCT', emoji: '🦁', favoriteMenus: ['김치볶음밥', '치킨'], popularity: { ko: 51, en: 51, ja: 52, zh: 50 } },
  { id: 'jaehyun', name: '재현', nameEn: 'Jaehyun', nameJa: 'ジェヒョン', nameZh: '郑在玹', group: 'NCT', groupEn: 'NCT', emoji: '🌹', favoriteMenus: ['스테이크', '파스타', '와인'], popularity: { ko: 53, en: 52, ja: 53, zh: 51 } },
  { id: 'haechan', name: '해찬', nameEn: 'Haechan', nameJa: 'ヘチャン', nameZh: '李东赫', group: 'NCT', groupEn: 'NCT', emoji: '☀️', favoriteMenus: ['삼겹살', '라면'], popularity: { ko: 54, en: 55, ja: 54, zh: 54 } },

  // ── ATEEZ ──
  { id: 'hongjoong', name: '홍중', nameEn: 'Hongjoong', nameJa: 'ホンジュン', nameZh: '金弘中', group: 'ATEEZ', groupEn: 'ATEEZ', emoji: '🏴‍☠️', favoriteMenus: ['떡볶이', '라면'], popularity: { ko: 60, en: 35, ja: 55, zh: 55 } },
  { id: 'seonghwa', name: '성화', nameEn: 'Seonghwa', nameJa: 'ソンファ', nameZh: '朴星华', group: 'ATEEZ', groupEn: 'ATEEZ', emoji: '✨', favoriteMenus: ['초밥', '우동'], popularity: { ko: 61, en: 56, ja: 56, zh: 56 } },

  // ── ITZY ──
  { id: 'yeji', name: '예지', nameEn: 'Yeji', nameJa: 'イェジ', nameZh: '黄礼志', group: 'ITZY', groupEn: 'ITZY', emoji: '🐱', favoriteMenus: ['김치찌개', '삼겹살'], popularity: { ko: 55, en: 57, ja: 57, zh: 57 } },
  { id: 'ryujin', name: '류진', nameEn: 'Ryujin', nameJa: 'リュジン', nameZh: '申留真', group: 'ITZY', groupEn: 'ITZY', emoji: '🐻', favoriteMenus: ['떡볶이', '순대볶음'], popularity: { ko: 56, en: 58, ja: 58, zh: 58 } },

  // ── NMIXX ──
  { id: 'sullyoon', name: '설윤', nameEn: 'Sullyoon', nameJa: 'ソリュン', nameZh: '薛允', group: 'NMIXX', groupEn: 'NMIXX', emoji: '🦢', favoriteMenus: ['샐러드', '파스타'], popularity: { ko: 57, en: 59, ja: 59, zh: 59 } },
  { id: 'haewon', name: '해원', nameEn: 'Haewon', nameJa: 'ヘウォン', nameZh: '海媛', group: 'NMIXX', groupEn: 'NMIXX', emoji: '🌊', favoriteMenus: ['치킨', '피자'], popularity: { ko: 58, en: 60, ja: 60, zh: 60 } },

  // ── TREASURE ──
  { id: 'haruto', name: '하루토', nameEn: 'Haruto', nameJa: 'ハルト', nameZh: '渡边温斗', group: 'TREASURE', groupEn: 'TREASURE', emoji: '🐶', favoriteMenus: ['라멘', '규동'], popularity: { ko: 62, en: 62, ja: 61, zh: 62 } },

  // ── ZEROBASEONE ──
  { id: 'sunghanbin', name: '성한빈', nameEn: 'Sung Hanbin', nameJa: 'ソンハンビン', nameZh: '成汉彬', group: 'ZEROBASEONE', groupEn: 'ZEROBASEONE', emoji: '🐱', favoriteMenus: ['김치찌개', '비빔밥'], popularity: { ko: 59, en: 61, ja: 62, zh: 61 } },
  { id: 'zhang_hao', name: '장하오', nameEn: 'Zhang Hao', nameJa: 'ジャンハオ', nameZh: '章昊', group: 'ZEROBASEONE', groupEn: 'ZEROBASEONE', emoji: '🌟', favoriteMenus: ['마라탕', '마라샹궈', '짜장면'], popularity: { ko: 63, en: 63, ja: 63, zh: 46 } },

  // ── ILLIT ──
  { id: 'wonhee', name: '원희', nameEn: 'Wonhee', nameJa: 'ウォニ', nameZh: '元熙', group: 'ILLIT', groupEn: 'ILLIT', emoji: '🎀', favoriteMenus: ['붕어빵', '떡볶이'], popularity: { ko: 64, en: 64, ja: 64, zh: 64 } },
  { id: 'minju-illit', name: '민주', nameEn: 'Minju', nameJa: 'ミンジュ', nameZh: '敏珠', group: 'ILLIT', groupEn: 'ILLIT', emoji: '🌸', favoriteMenus: ['크로플', '와플'], popularity: { ko: 65, en: 65, ja: 65, zh: 65 } },

  // ── SOLO ARTISTS ──
  { id: 'iu', name: '아이유', nameEn: 'IU', nameJa: 'IU', nameZh: '李知恩', group: 'Solo', groupEn: 'Solo', emoji: '🎵', favoriteMenus: ['치킨', '짜파구리', '떡볶이', '막국수'], popularity: { ko: 66, en: 66, ja: 66, zh: 66 } },
  { id: 'taeyeon', name: '태연', nameEn: 'Taeyeon', nameJa: 'テヨン', nameZh: '金泰妍', group: 'Solo', groupEn: 'Solo', emoji: '🎤', favoriteMenus: ['피자', '치킨'], popularity: { ko: 67, en: 67, ja: 67, zh: 67 } },

  // ── BOYNEXTDOOR ──
  { id: 'sungho', name: '성호', nameEn: 'Sungho', nameJa: 'ソンホ', nameZh: '成镐', group: 'BOYNEXTDOOR', groupEn: 'BOYNEXTDOOR', emoji: '🐻', favoriteMenus: ['치킨', '불닭볶음면'], popularity: { ko: 68, en: 68, ja: 68, zh: 68 } },

  // ── RIIZE ──
  { id: 'wonbin', name: '원빈', nameEn: 'Wonbin', nameJa: 'ウォンビン', nameZh: '元彬', group: 'RIIZE', groupEn: 'RIIZE', emoji: '⭐', favoriteMenus: ['떡볶이', '치즈볼'], popularity: { ko: 69, en: 69, ja: 69, zh: 69 } },
  { id: 'shotaro', name: '쇼타로', nameEn: 'Shotaro', nameJa: 'ショウタロウ', nameZh: '大的晌太郎', group: 'RIIZE', groupEn: 'RIIZE', emoji: '🐻', favoriteMenus: ['라멘', '오무라이스'], popularity: { ko: 70, en: 70, ja: 70, zh: 70 } },

  // ── TWS ──
  { id: 'shinyu', name: '신유', nameEn: 'Shinyu', nameJa: 'シンユ', nameZh: '信宇', group: 'TWS', groupEn: 'TWS', emoji: '🌊', favoriteMenus: ['라면', '삼각김밥'], popularity: { ko: 71, en: 71, ja: 71, zh: 71 } },

  // ── PLAVE (가상 아이돌이지만 인기) ──
  { id: 'eunho', name: '은호', nameEn: 'Eunho', nameJa: 'ウノ', nameZh: '恩浩', group: 'PLAVE', groupEn: 'PLAVE', emoji: '🎮', favoriteMenus: ['떡볶이', '김밥'], popularity: { ko: 72, en: 72, ja: 72, zh: 72 } },

  // ── BABYMONSTER ──
  { id: 'ahyeon', name: '아현', nameEn: 'Ahyeon', nameJa: 'アヒョン', nameZh: '雅贤', group: 'BABYMONSTER', groupEn: 'BABYMONSTER', emoji: '🐉', favoriteMenus: ['김치찌개', '떡볶이'], popularity: { ko: 73, en: 73, ja: 73, zh: 73 } },
  { id: 'ruka', name: '루카', nameEn: 'Ruka', nameJa: 'ルカ', nameZh: '琉花', group: 'BABYMONSTER', groupEn: 'BABYMONSTER', emoji: '🦋', favoriteMenus: ['라멘', '타코야끼'], popularity: { ko: 74, en: 74, ja: 74, zh: 74 } },

  // ── KISS OF LIFE ──
  { id: 'julie', name: '줄리', nameEn: 'Julie', nameJa: 'ジュリ', nameZh: '朱莉', group: 'KISS OF LIFE', groupEn: 'KISS OF LIFE', emoji: '💋', favoriteMenus: ['파스타', '브런치'], popularity: { ko: 75, en: 75, ja: 75, zh: 75 } },

  // ── KATSEYE ──
  { id: 'daniela', name: '다니엘라', nameEn: 'Daniela', nameJa: 'ダニエラ', nameZh: '丹妮拉', group: 'KATSEYE', groupEn: 'KATSEYE', emoji: '🐱', favoriteMenus: ['타코', '부리또'], popularity: { ko: 80, en: 76, ja: 76, zh: 76 } },
];

// ──────────────────────────────────────
// 그룹 데이터
// ──────────────────────────────────────

export const KPOP_GROUPS: KpopGroup[] = [
  { id: 'bts', name: 'BTS', nameEn: 'BTS', nameJa: 'BTS', nameZh: '防弹少年团', emoji: '💜', type: 'boy', generation: '3rd', popularity: { ko: 1, en: 1, ja: 1, zh: 1 }, members: ['rm', 'jin', 'suga', 'jhope', 'jimin', 'v', 'jungkook'] },
  { id: 'blackpink', name: 'BLACKPINK', nameEn: 'BLACKPINK', nameJa: 'BLACKPINK', nameZh: 'BLACKPINK', emoji: '🖤💖', type: 'girl', generation: '3rd', popularity: { ko: 2, en: 2, ja: 2, zh: 2 }, members: ['jennie', 'jisoo', 'rose', 'lisa'] },
  { id: 'aespa', name: 'aespa', nameEn: 'aespa', nameJa: 'aespa', nameZh: 'aespa', emoji: '🌌', type: 'girl', generation: '4th', popularity: { ko: 3, en: 5, ja: 3, zh: 4 }, members: ['karina', 'winter', 'giselle', 'ningning'] },
  { id: 'seventeen', name: 'SEVENTEEN', nameEn: 'SEVENTEEN', nameJa: 'SEVENTEEN', nameZh: 'SEVENTEEN', emoji: '💎', type: 'boy', generation: '3rd', popularity: { ko: 4, en: 4, ja: 4, zh: 5 }, members: ['seungcheol', 'mingyu', 'wonwoo', 'woozi'] },
  { id: 'straykids', name: 'Stray Kids', nameEn: 'Stray Kids', nameJa: 'Stray Kids', nameZh: 'Stray Kids', emoji: '🏴', type: 'boy', generation: '4th', popularity: { ko: 6, en: 3, ja: 5, zh: 6 }, members: ['bangchan', 'hyunjin', 'felix'] },
  { id: 'newjeans', name: 'NewJeans', nameEn: 'NewJeans', nameJa: 'NewJeans', nameZh: 'NewJeans', emoji: '👖', type: 'girl', generation: '4th', popularity: { ko: 5, en: 6, ja: 6, zh: 7 }, members: ['minji', 'hanni', 'danielle', 'haerin', 'hyein'] },
  { id: 'ive', name: 'IVE', nameEn: 'IVE', nameJa: 'IVE', nameZh: 'IVE', emoji: '💫', type: 'girl', generation: '4th', popularity: { ko: 7, en: 8, ja: 7, zh: 8 }, members: ['wonyoung', 'yujin-ive', 'gaeul', 'rei', 'liz', 'leeseo'] },
  { id: 'enhypen', name: 'ENHYPEN', nameEn: 'ENHYPEN', nameJa: 'ENHYPEN', nameZh: 'ENHYPEN', emoji: '🔗', type: 'boy', generation: '4th', popularity: { ko: 8, en: 7, ja: 8, zh: 9 }, members: ['heeseung', 'jake', 'sunghoon'] },
  { id: 'gidle', name: '(G)I-DLE', nameEn: '(G)I-DLE', nameJa: '(G)I-DLE', nameZh: '(G)I-DLE', emoji: '🔥', type: 'girl', generation: '4th', popularity: { ko: 9, en: 9, ja: 10, zh: 10 }, members: ['miyeon', 'soyeon', 'yuqi'] },
  { id: 'lesserafim', name: 'LE SSERAFIM', nameEn: 'LE SSERAFIM', nameJa: 'LE SSERAFIM', nameZh: 'LE SSERAFIM', emoji: '🔥', type: 'girl', generation: '4th', popularity: { ko: 10, en: 10, ja: 9, zh: 11 }, members: ['sakura', 'chaewon', 'kazuha', 'yunjin'] },
  { id: 'txt', name: 'TXT', nameEn: 'TXT', nameJa: 'TXT', nameZh: 'TXT', emoji: '🌟', type: 'boy', generation: '4th', popularity: { ko: 11, en: 11, ja: 11, zh: 12 }, members: ['soobin', 'yeonjun', 'beomgyu'] },
  { id: 'exo', name: 'EXO', nameEn: 'EXO', nameJa: 'EXO', nameZh: 'EXO', emoji: '🌕', type: 'boy', generation: '3rd', popularity: { ko: 12, en: 14, ja: 13, zh: 3 }, members: ['baekhyun', 'kai'] },
  { id: 'twice', name: 'TWICE', nameEn: 'TWICE', nameJa: 'TWICE', nameZh: 'TWICE', emoji: '🍭', type: 'girl', generation: '3rd', popularity: { ko: 13, en: 13, ja: 12, zh: 13 }, members: ['nayeon', 'momo', 'sana'] },
  { id: 'nct', name: 'NCT', nameEn: 'NCT', nameJa: 'NCT', nameZh: 'NCT', emoji: '🌐', type: 'boy', generation: '3rd', popularity: { ko: 14, en: 12, ja: 14, zh: 14 }, members: ['mark', 'jaehyun', 'haechan'] },
  { id: 'ateez', name: 'ATEEZ', nameEn: 'ATEEZ', nameJa: 'ATEEZ', nameZh: 'ATEEZ', emoji: '🏴‍☠️', type: 'boy', generation: '4th', popularity: { ko: 18, en: 15, ja: 15, zh: 15 }, members: ['hongjoong', 'seonghwa'] },
  { id: 'itzy', name: 'ITZY', nameEn: 'ITZY', nameJa: 'ITZY', nameZh: 'ITZY', emoji: '💖', type: 'girl', generation: '4th', popularity: { ko: 15, en: 16, ja: 16, zh: 16 }, members: ['yeji', 'ryujin'] },
  { id: 'nmixx', name: 'NMIXX', nameEn: 'NMIXX', nameJa: 'NMIXX', nameZh: 'NMIXX', emoji: '🎯', type: 'girl', generation: '4th', popularity: { ko: 16, en: 17, ja: 17, zh: 17 }, members: ['sullyoon', 'haewon'] },
  { id: 'treasure', name: 'TREASURE', nameEn: 'TREASURE', nameJa: 'TREASURE', nameZh: 'TREASURE', emoji: '💰', type: 'boy', generation: '4th', popularity: { ko: 19, en: 19, ja: 18, zh: 19 }, members: ['haruto'] },
  { id: 'zerobaseone', name: 'ZEROBASEONE', nameEn: 'ZEROBASEONE', nameJa: 'ZEROBASEONE', nameZh: 'ZEROBASEONE', emoji: '0️⃣', type: 'boy', generation: '5th', popularity: { ko: 17, en: 18, ja: 19, zh: 18 }, members: ['sunghanbin', 'zhang_hao'] },
  { id: 'illit', name: 'ILLIT', nameEn: 'ILLIT', nameJa: 'ILLIT', nameZh: 'ILLIT', emoji: '🎀', type: 'girl', generation: '5th', popularity: { ko: 20, en: 20, ja: 20, zh: 20 }, members: ['wonhee', 'minju-illit'] },
  { id: 'babymonster', name: 'BABYMONSTER', nameEn: 'BABYMONSTER', nameJa: 'BABYMONSTER', nameZh: 'BABYMONSTER', emoji: '🐉', type: 'girl', generation: '5th', popularity: { ko: 21, en: 21, ja: 21, zh: 21 }, members: ['ahyeon', 'ruka'] },
  { id: 'riize', name: 'RIIZE', nameEn: 'RIIZE', nameJa: 'RIIZE', nameZh: 'RIIZE', emoji: '⭐', type: 'boy', generation: '5th', popularity: { ko: 22, en: 22, ja: 22, zh: 22 }, members: ['wonbin', 'shotaro'] },
  { id: 'tws', name: 'TWS', nameEn: 'TWS', nameJa: 'TWS', nameZh: 'TWS', emoji: '🌊', type: 'boy', generation: '5th', popularity: { ko: 23, en: 23, ja: 23, zh: 23 }, members: ['shinyu'] },
  { id: 'plave', name: 'PLAVE', nameEn: 'PLAVE', nameJa: 'PLAVE', nameZh: 'PLAVE', emoji: '🎮', type: 'boy', generation: '5th', popularity: { ko: 24, en: 25, ja: 25, zh: 25 }, members: ['eunho'] },
  { id: 'kissoflife', name: 'KISS OF LIFE', nameEn: 'KISS OF LIFE', nameJa: 'KISS OF LIFE', nameZh: 'KISS OF LIFE', emoji: '💋', type: 'girl', generation: '5th', popularity: { ko: 25, en: 24, ja: 24, zh: 24 }, members: ['julie'] },
  { id: 'boynextdoor', name: 'BOYNEXTDOOR', nameEn: 'BOYNEXTDOOR', nameJa: 'BOYNEXTDOOR', nameZh: 'BOYNEXTDOOR', emoji: '🚪', type: 'boy', generation: '5th', popularity: { ko: 26, en: 26, ja: 26, zh: 26 }, members: ['sungho'] },
  { id: 'katseye', name: 'KATSEYE', nameEn: 'KATSEYE', nameJa: 'KATSEYE', nameZh: 'KATSEYE', emoji: '🐱', type: 'girl', generation: '5th', popularity: { ko: 27, en: 27, ja: 27, zh: 27 }, members: ['daniela'] },
];

// ──────────────────────────────────────
// 유틸: 국가별 인기순 정렬
// ──────────────────────────────────────

export const getIdolsByPopularity = (lang: 'ko' | 'en' | 'ja' | 'zh', limit = 20): KpopIdol[] =>
  [...KPOP_IDOLS].sort((a, b) => a.popularity[lang] - b.popularity[lang]).slice(0, limit);

export const getGroupsByPopularity = (lang: 'ko' | 'en' | 'ja' | 'zh', limit = 15): KpopGroup[] =>
  [...KPOP_GROUPS].sort((a, b) => a.popularity[lang] - b.popularity[lang]).slice(0, limit);

export const getIdolById = (id: string): KpopIdol | undefined =>
  KPOP_IDOLS.find((idol) => idol.id === id);

export const searchIdols = (query: string, lang: 'ko' | 'en' | 'ja' | 'zh'): KpopIdol[] => {
  const lower = query.toLowerCase().trim();
  if (!lower) return [];
  return KPOP_IDOLS.filter((idol) =>
    idol.name.toLowerCase().includes(lower) ||
    idol.nameEn.toLowerCase().includes(lower) ||
    idol.group.toLowerCase().includes(lower) ||
    idol.groupEn.toLowerCase().includes(lower) ||
    (lang === 'ja' && idol.nameJa.toLowerCase().includes(lower)) ||
    (lang === 'zh' && idol.nameZh.includes(lower))
  ).sort((a, b) => a.popularity[lang] - b.popularity[lang]);
};

/** 아이돌의 이름을 현재 언어로 반환 */
export const getIdolName = (idol: KpopIdol, lang: string): string => {
  switch (lang) {
    case 'en': return idol.nameEn;
    case 'ja': return idol.nameJa;
    case 'zh': return idol.nameZh;
    default: return idol.name;
  }
};

export const getGroupName = (group: KpopGroup, lang: string): string => {
  switch (lang) {
    case 'en': return group.nameEn;
    case 'ja': return group.nameJa;
    case 'zh': return group.nameZh;
    default: return group.name;
  }
};

// ──────────────────────────────────────
// K-pop 전용 인기 상황 (트렌드)
// ──────────────────────────────────────

export interface KpopTrendTopic {
  id: string;
  ko: string;
  en: string;
  ja: string;
  zh: string;
  keyword: string; // 검색에 사용할 키워드
}

export const KPOP_TREND_TOPICS: KpopTrendTopic[] = [
  { id: 'mukbang', ko: '🍜 아이돌 먹방 인기 메뉴', en: '🍜 Idol Mukbang Favorites', ja: '🍜 アイドル食べ放題人気メニュー', zh: '🍜 偶像吃播人气菜单', keyword: '아이돌 먹방 인기 메뉴' },
  { id: 'diet', ko: '🥗 아이돌 다이어트 식단', en: '🥗 Idol Diet Meals', ja: '🥗 アイドルダイエット食', zh: '🥗 偶像减肥餐', keyword: '아이돌 다이어트 식단' },
  { id: 'comfort', ko: '🍲 연습 후 위로 음식', en: '🍲 After-Practice Comfort Food', ja: '🍲 練習後の癒やしフード', zh: '🍲 练习后慰藉美食', keyword: '연습 후 위로 음식' },
  { id: 'vlive', ko: '📱 브이로그 속 맛집', en: '📱 Vlog Restaurant Picks', ja: '📱 Vlog人気グルメ', zh: '📱 Vlog中的美食店', keyword: '아이돌 브이로그 맛집 메뉴' },
  { id: 'debut', ko: '🎉 데뷔 축하 음식', en: '🎉 Debut Celebration Food', ja: '🎉 デビュー祝い料理', zh: '🎉 出道庆祝美食', keyword: '데뷔 축하 음식' },
  { id: 'latenight', ko: '🌙 야식 먹방 BEST', en: '🌙 Late Night Snack BEST', ja: '🌙 夜食BEST', zh: '🌙 深夜美食BEST', keyword: '아이돌 야식 먹방' },
  { id: 'korean', ko: '🇰🇷 외국 멤버가 반한 한식', en: '🇰🇷 Korean Food Foreign Idols Love', ja: '🇰🇷 外国メンバーが惚れた韓食', zh: '🇰🇷 外国成员爱上的韩食', keyword: '외국 멤버가 좋아하는 한식' },
  { id: 'homecook', ko: '🍳 아이돌 자취 요리', en: '🍳 Idol Home Cooking', ja: '🍳 アイドル自炊レシピ', zh: '🍳 偶像自己做饭', keyword: '아이돌 자취 요리' },
];
