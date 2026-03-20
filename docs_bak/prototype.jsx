import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   i18n TRANSLATIONS
   ═══════════════════════════════════════════════════ */
const TRANSLATIONS = {
  ko: {
    title: "오늘뭐먹지",
    sub: "상황에 딱 맞는 메뉴, AI가 골라줄게요",
    filter: "필터",
    how: "어떻게?",
    who: "누구와?",
    vibe: "상황",
    budgetLabel: "예산",
    ingLabel: "재료",
    cta: "메뉴 추천받기",
    ctaSub: "필터 없이도 OK! AI가 알아서 추천해요",
    cook: "해먹기",
    order: "시켜먹기",
    anyMode: "다 좋아",
    p1: "1인",
    p2: "2인",
    fam: "가족",
    babyQ: "아이?",
    noBaby: "없음",
    infant: "영유아",
    kid: "아동",
    rain: "비오는날",
    late: "야근후",
    diet: "다이어트",
    hangover: "해장",
    night: "야식",
    lazy: "귀찮은날",
    spicy: "매운거",
    quick: "15분이내",
    newMenu: "새로운거",
    guest: "손님접대",
    fridge: "냉장고털기",
    sweet: "단짠단짠",
    chef: "흑백요리사",
    b5k: "5천↓",
    b10k: "1만↓",
    b20k: "2만↓",
    bAny: "상관없음",
    myCal: "식단",
    monthly: "월간",
    weekly: "주간",
    todayIs: "오늘은",
    altTitle: "이런 메뉴는 어때요?",
    addCal: "식단에 추가",
    savedMsg: "저장됨!",
    retry: "다시",
    reSearch: "다시 검색",
    editBtn: "수정→",
    ld1: "상황 분석 중...",
    ld2: "메뉴 선정 중...",
    ld3: "레시피 & 맛집 검색...",
    excludeMsg: "최근 먹은 메뉴 제외 중",
    ytLabel: "추천 레시피 영상",
    blogLabel: "추천 블로그",
    restLabel: "근처 맛집",
    orderBtn: "주문",
    noRecord: "—",
    fridgeInput: "재료 입력 후 Enter",
    fallbackBadge: "📡 일반 추천",
    fallbackNote: "AI 할당량 초과 → 로컬 추천 모드",
    aiBadge: "🤖 AI 추천",
    privTitle: "개인정보처리방침",
    aboutTitle: "서비스 소개",
    contactTitle: "문의",
    aboutDesc: "오늘뭐먹지는 AI 기반 메뉴 추천 서비스입니다. 사용자의 상황, 가구 유형, 예산에 맞는 최적의 식사를 추천합니다.",
    privDesc: "본 서비스는 개인정보를 서버에 저장하지 않으며, 모든 데이터는 브라우저 로컬에 저장됩니다.",
    copyright: "© 2026 오늘뭐먹지 by utilverse.net",
    placeholders: [
      "비오는날 따뜻한 국물 뭐 먹지?",
      "흑백요리사 메뉴 해먹고 싶어",
      "야근후 간단한 거 추천해줘",
      "단짠단짠 디저트 뭐 먹지?",
      "아기도 먹을 수 있는 저녁 메뉴",
    ],
    chefBanner: "🏆 흑백요리사 셰프 추천 메뉴로 골라보세요!",
    filtersLoaded: "✅ 이전 필터 불러옴",
    securityBlock: "🚫 음식과 관련 없는 질문은 답변할 수 없어요",
  },
  en: {
    title: "What to Eat?",
    sub: "AI picks the perfect meal for you",
    filter: "Filters",
    how: "How?",
    who: "Who?",
    vibe: "Vibe",
    budgetLabel: "Budget",
    ingLabel: "Ingredients",
    cta: "Get Recommendation",
    ctaSub: "No filters needed!",
    cook: "Cook",
    order: "Delivery",
    anyMode: "Any",
    p1: "Solo",
    p2: "Couple",
    fam: "Family",
    babyQ: "Baby?",
    noBaby: "No",
    infant: "Infant",
    kid: "Kid",
    rain: "Rainy",
    late: "After work",
    diet: "Diet",
    hangover: "Hangover",
    night: "Late night",
    lazy: "Lazy",
    spicy: "Spicy",
    quick: "Under 15m",
    newMenu: "New",
    guest: "Guest",
    fridge: "Fridge",
    sweet: "Sweet&Salty",
    chef: "Chef's Pick",
    b5k: "$5↓",
    b10k: "$10↓",
    b20k: "$20↓",
    bAny: "Any",
    myCal: "Meals",
    monthly: "Month",
    weekly: "Week",
    todayIs: "Today, let's",
    altTitle: "How about these?",
    addCal: "Save",
    savedMsg: "Saved!",
    retry: "Retry",
    reSearch: "Search again",
    editBtn: "Edit→",
    ld1: "Analyzing...",
    ld2: "Picking menu...",
    ld3: "Searching...",
    excludeMsg: "Excluding recent meals",
    ytLabel: "Recipe Videos",
    blogLabel: "Blogs",
    restLabel: "Nearby",
    orderBtn: "Order",
    noRecord: "—",
    fridgeInput: "Type ingredient + Enter",
    fallbackBadge: "📡 Local",
    fallbackNote: "AI quota reached → local mode",
    aiBadge: "🤖 AI",
    privTitle: "Privacy",
    aboutTitle: "About",
    contactTitle: "Contact",
    aboutDesc: "AI-powered meal recommendation service.",
    privDesc: "No personal data stored on servers. All data is local.",
    copyright: "© 2026 What to Eat? by utilverse.net",
    placeholders: ["Rainy day comfort food?", "Quick meal after work", "Something sweet and salty"],
    chefBanner: "🏆 Try celebrity chef dishes!",
    filtersLoaded: "✅ Filters loaded",
    securityBlock: "🚫 Food-related questions only",
  },
};

const LANG_LIST = [
  { id: "ko", flag: "🇰🇷" },
  { id: "en", flag: "🇺🇸" },
];

/* ═══════════════════════════════════════════════════
   VIBE TAGS — 흑백요리사 is FIRST
   ═══════════════════════════════════════════════════ */
const VIBE_LIST = [
  { id: "chef", icon: "👨‍🍳", accent: "#7C3AED" },
  { id: "sweet", icon: "🍰", accent: "#EC4899" },
  { id: "rain", icon: "☔" },
  { id: "late", icon: "🌙" },
  { id: "diet", icon: "🥗" },
  { id: "hangover", icon: "🍺" },
  { id: "night", icon: "🌃" },
  { id: "lazy", icon: "😴" },
  { id: "spicy", icon: "🔥" },
  { id: "quick", icon: "⏱" },
  { id: "newMenu", icon: "✨" },
  { id: "guest", icon: "👔" },
  { id: "fridge", icon: "🧊" },
];

const BUDGET_LIST = [
  { id: "5k", key: "b5k" },
  { id: "10k", key: "b10k" },
  { id: "20k", key: "b20k" },
  { id: "any", key: "bAny" },
];

/* Keyword mappings for search bar auto-populate */
const VIBE_KW = {
  ko: { chef: "흑백요리사", sweet: "단짠단짠", rain: "비오는날", late: "야근후", diet: "다이어트", hangover: "해장", night: "야식", lazy: "간단한", spicy: "매운", quick: "15분", newMenu: "새로운", guest: "손님접대", fridge: "냉장고" },
  en: { chef: "chef's pick", sweet: "sweet&salty", rain: "rainy day", late: "after work", diet: "diet", hangover: "hangover", night: "late night", lazy: "easy", spicy: "spicy", quick: "quick", newMenu: "new", guest: "guests", fridge: "fridge" },
};
const HOUSE_KW = {
  ko: { "1p": "혼밥", "2p": "2인", fam: "가족" },
  en: { "1p": "solo", "2p": "couple", fam: "family" },
};
const BUDGET_KW = {
  ko: { "5k": "5천원이하", "10k": "만원이하", "20k": "2만원이하", any: "" },
  en: { "5k": "under $5", "10k": "under $10", "20k": "under $20", any: "" },
};

const CAT_COLORS = {
  한식: { bg: "#FEE2E2", fg: "#DC2626" },
  중식: { bg: "#FEF9C3", fg: "#CA8A04" },
  양식: { bg: "#DBEAFE", fg: "#2563EB" },
  일식: { bg: "#F3E8FF", fg: "#9333EA" },
  분식: { bg: "#FFEDD5", fg: "#EA580C" },
  디저트: { bg: "#FCE7F3", fg: "#DB2777" },
  기타: { bg: "#F3F4F6", fg: "#6B7280" },
};

const difficultyStars = (n) => "★".repeat(n) + "☆".repeat(3 - n);

/* ═══════════════════════════════════════════════════
   SECURITY — Input validation
   ═══════════════════════════════════════════════════ */
const BLOCKED_PATTERNS = [
  /ignore\s*(previous|above|all)\s*instructions/i,
  /you\s*are\s*now/i,
  /system\s*prompt/i,
  /jailbreak/i,
  /pretend\s*you/i,
  /reveal\s*(your|the)\s*(prompt|instructions)/i,
  /DAN\s*mode/i,
  /bypass/i,
  /<script/i,
  /javascript:/i,
  /eval\s*\(/i,
  /SELECT\s+.*FROM/i,
  /DROP\s+TABLE/i,
];

const FOOD_SIGNALS = [
  /먹|음식|메뉴|요리|레시피|식사|배달|맛집|반찬|국|찌개|면|밥|고기|디저트|간식|야식|점심|저녁|아침/,
  /eat|food|cook|recipe|meal|menu|restaurant|dish|lunch|dinner|snack|dessert/i,
];

function validateInput(text) {
  if (!text || text.trim().length === 0) return true;
  const clean = text.trim();
  for (const p of BLOCKED_PATTERNS) {
    if (p.test(clean)) return false;
  }
  if (clean.length > 200) return false;
  if (clean.length > 50 && !FOOD_SIGNALS.some((r) => r.test(clean))) return false;
  return true;
}

/* ═══════════════════════════════════════════════════
   LOCAL FALLBACK ENGINE
   ═══════════════════════════════════════════════════ */
const LOCAL_DB = {
  cook: {
    rain: [
      { menu: "김치수제비", cat: "한식", price: 4000, time: 25, diff: 2 },
      { menu: "감자전", cat: "한식", price: 3000, time: 15, diff: 1 },
      { menu: "칼국수", cat: "한식", price: 4000, time: 30, diff: 2 },
    ],
    late: [
      { menu: "계란볶음밥", cat: "한식", price: 2000, time: 10, diff: 1 },
      { menu: "참치마요덮밥", cat: "일식", price: 3000, time: 8, diff: 1 },
    ],
    chef: [
      { menu: "트러플 비빔밥", cat: "한식", price: 8000, time: 25, diff: 2 },
      { menu: "마파두부", cat: "중식", price: 5000, time: 20, diff: 2 },
      { menu: "까르보나라", cat: "양식", price: 6000, time: 20, diff: 2 },
    ],
    sweet: [
      { menu: "크로플", cat: "디저트", price: 3000, time: 15, diff: 1 },
      { menu: "호떡", cat: "디저트", price: 2000, time: 20, diff: 2 },
    ],
    base: [
      { menu: "된장찌개", cat: "한식", price: 4000, time: 20, diff: 1 },
      { menu: "파스타", cat: "양식", price: 6000, time: 25, diff: 2 },
      { menu: "볶음밥", cat: "중식", price: 3000, time: 15, diff: 1 },
      { menu: "카레라이스", cat: "일식", price: 4000, time: 20, diff: 1 },
      { menu: "오므라이스", cat: "양식", price: 4000, time: 20, diff: 2 },
    ],
  },
  order: {
    rain: [
      { menu: "순대국", cat: "한식", price: 9000 },
      { menu: "짬뽕", cat: "중식", price: 8000 },
    ],
    late: [
      { menu: "마라탕", cat: "중식", price: 13000 },
      { menu: "치킨", cat: "한식", price: 18000 },
    ],
    chef: [
      { menu: "한우불고기세트", cat: "한식", price: 25000 },
      { menu: "딤섬 모듬", cat: "중식", price: 20000 },
    ],
    sweet: [
      { menu: "마카롱 세트", cat: "디저트", price: 12000 },
      { menu: "츄러스", cat: "디저트", price: 5000 },
    ],
    base: [
      { menu: "피자", cat: "양식", price: 15000 },
      { menu: "초밥 세트", cat: "일식", price: 15000 },
      { menu: "떡볶이 세트", cat: "분식", price: 12000 },
      { menu: "비빔밥 정식", cat: "한식", price: 9000 },
    ],
  },
};

function getLocalRecommendation(mealType, vibes, recentMenus) {
  const type = mealType === "order" ? "order" : "cook";
  const db = LOCAL_DB[type];
  let pool = [...db.base];
  vibes.forEach((v) => {
    if (db[v]) pool = [...db[v], ...pool];
  });
  pool = pool.filter((m) => !recentMenus.includes(m.menu));
  pool.sort(() => Math.random() - 0.5);
  const unique = [];
  const seen = new Set();
  for (const item of pool) {
    if (!seen.has(item.menu)) {
      seen.add(item.menu);
      unique.push(item);
    }
  }

  const decision = type === "cook" ? "해먹기" : "시켜먹기";
  const mainItem = unique[0] || db.base[0];
  let sweetSet = null;
  if (vibes.includes("sweet")) {
    const desserts = (db.sweet || []).filter((x) => !recentMenus.includes(x.menu));
    if (desserts.length > 0) {
      sweetSet = { dessert: desserts[0].menu, reason: "단짠 조합!" };
    }
  }

  const result = {
    decision,
    reason: "로컬 추천 모드",
    sweet_set: sweetSet,
    main: {
      menu: mainItem.menu,
      category: mainItem.cat,
      reason: "인기 메뉴 추천",
      price: mainItem.price,
      time_min: mainItem.time || null,
      difficulty: mainItem.diff || null,
    },
    alt: unique.slice(1, 4).map((x) => ({
      menu: x.menu,
      category: x.cat,
      price: x.price,
      time_min: x.time || null,
      difficulty: x.diff || null,
    })),
    _isFallback: true,
  };

  if (type === "cook") {
    result.main.youtube = [
      {
        title: mainItem.menu + " 레시피",
        channel: "YouTube 검색",
        views: "-",
        url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(mainItem.menu + " 레시피"),
      },
    ];
    result.main.blog = [
      {
        title: mainItem.menu + " 만드는 법",
        url: "https://search.naver.com/search.naver?query=" + encodeURIComponent(mainItem.menu + " 레시피"),
      },
    ];
  } else {
    result.main.restaurants = [
      {
        name: mainItem.menu + " 맛집 검색",
        rating: 0,
        delivery_fee: 0,
        estimated_min: 0,
      },
    ];
  }

  return result;
}

/* ═══════════════════════════════════════════════════
   MOCK AI RESPONSES
   ═══════════════════════════════════════════════════ */
const MOCK_COOK = {
  decision: "해먹기",
  reason: "비오는 날 직접 끓인 국물이 최고!",
  sweet_set: { dessert: "호떡", reason: "비오는날엔 갓 구운 호떡" },
  main: {
    menu: "김치수제비",
    category: "한식",
    reason: "흑백요리사 에드워드리 셰프 스타일!",
    price: 4000,
    time_min: 25,
    difficulty: 2,
    youtube: [
      { title: "백종원 김치수제비", channel: "백종원", views: "320만", url: "#" },
      { title: "에드워드리 수제비 비법", channel: "흑백요리사", views: "180만", url: "#" },
      { title: "초간단 수제비 20분", channel: "요리왕비룡", views: "95만", url: "#" },
      { title: "찐 맛집급 수제비", channel: "슈퍼레시피", views: "67만", url: "#" },
      { title: "1인분 수제비 꿀팁", channel: "자취요리", views: "42만", url: "#" },
    ],
    blog: [
      { title: "김치수제비 황금레시피", url: "#" },
      { title: "수제비 반죽 쫄깃하게", url: "#" },
      { title: "에드워드리 수제비 후기", url: "#" },
    ],
  },
  alt: [
    { menu: "감자전", category: "한식", price: 3000, time_min: 15, difficulty: 1 },
    { menu: "부대찌개", category: "한식", price: 6000, time_min: 20, difficulty: 1 },
    { menu: "크림리조또", category: "양식", price: 7000, time_min: 30, difficulty: 2 },
  ],
  _isFallback: false,
};

const MOCK_ORDER = {
  decision: "시켜먹기",
  reason: "야근 후엔 편하게 시켜먹자!",
  sweet_set: { dessert: "마카롱", reason: "야근 보상은 달달하게" },
  main: {
    menu: "마라탕",
    category: "중식",
    reason: "SNS 핫 메뉴! 매콤한 국물로 스트레스 해소",
    price: 13000,
    restaurants: [
      { name: "마라왕 강남점", rating: 4.7, delivery_fee: 2000, estimated_min: 35 },
      { name: "홍라오 마라탕", rating: 4.5, delivery_fee: 3000, estimated_min: 40 },
      { name: "탕화쿵푸마라탕", rating: 4.3, delivery_fee: 1000, estimated_min: 30 },
    ],
  },
  alt: [
    { menu: "순대국", category: "한식", price: 9000 },
    { menu: "초밥 세트", category: "일식", price: 15000 },
    { menu: "양념치킨", category: "한식", price: 18000 },
  ],
  _isFallback: false,
};

/* ═══════════════════════════════════════════════════
   STORAGE HELPERS (SSR-safe)
   ═══════════════════════════════════════════════════ */
function safeGetStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const val = window.localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function safeSetStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

const FILTER_STORAGE_KEY = "wmj_filters_v4";
const CALENDAR_STORAGE_KEY = "wmj_calendar_v4";
const LANG_STORAGE_KEY = "wmj_lang_v4";

/* ═══════════════════════════════════════════════════
   MAIN APP COMPONENT
   ═══════════════════════════════════════════════════ */
export default function WhatToEat() {
  // State
  const [lang, setLang] = useState("ko");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("any");
  const [household, setHousehold] = useState(null);
  const [baby, setBaby] = useState(null);
  const [vibes, setVibes] = useState([]);
  const [budget, setBudget] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [phase, setPhase] = useState("home");
  const [result, setResult] = useState(null);
  const [calendar, setCalendar] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarView, setCalendarView] = useState("month");
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2));
  const [loadingStep, setLoadingStep] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [justSaved, setJustSaved] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [aiQuota, setAiQuota] = useState(50);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState("main");
  const [filterRestoredMsg, setFilterRestoredMsg] = useState(false);
  const [securityError, setSecurityError] = useState(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  // Load persisted data on mount
  useEffect(() => {
    const savedLang = safeGetStorage(LANG_STORAGE_KEY, "ko");
    setLang(savedLang);

    const savedCal = safeGetStorage(CALENDAR_STORAGE_KEY, {});
    setCalendar(savedCal);

    const savedFilters = safeGetStorage(FILTER_STORAGE_KEY, null);
    if (savedFilters) {
      if (savedFilters.mode) setMode(savedFilters.mode);
      if (savedFilters.household) setHousehold(savedFilters.household);
      if (savedFilters.baby) setBaby(savedFilters.baby);
      if (savedFilters.vibes && savedFilters.vibes.length > 0) setVibes(savedFilters.vibes);
      if (savedFilters.budget) setBudget(savedFilters.budget);
      setFilterRestoredMsg(true);
      setTimeout(() => setFilterRestoredMsg(false), 2500);
    }
  }, []);

  // Persist filters
  useEffect(() => {
    safeSetStorage(FILTER_STORAGE_KEY, { mode, household, baby, vibes, budget });
  }, [mode, household, baby, vibes, budget]);

  // Persist calendar
  useEffect(() => {
    safeSetStorage(CALENDAR_STORAGE_KEY, calendar);
  }, [calendar]);

  // Persist lang
  useEffect(() => {
    safeSetStorage(LANG_STORAGE_KEY, lang);
  }, [lang]);

  // Placeholder rotation
  useEffect(() => {
    const placeholders = t.placeholders || [];
    if (placeholders.length === 0) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [lang, t.placeholders]);

  // Recent menus for dedup (last 7 days)
  const recentMenus = Object.values(calendar)
    .filter((entry) => Date.now() - new Date(entry.date).getTime() < 7 * 24 * 60 * 60 * 1000)
    .map((entry) => entry.menu);

  /* ═══ Keyword sync: filters → search bar ═══ */
  const buildSearchQuery = useCallback(
    (newVibes, newHousehold, newBudget) => {
      const vkw = VIBE_KW[lang] || VIBE_KW.ko;
      const hkw = HOUSE_KW[lang] || HOUSE_KW.ko;
      const bkw = BUDGET_KW[lang] || BUDGET_KW.ko;
      const parts = [];
      if (newHousehold && hkw[newHousehold]) parts.push(hkw[newHousehold]);
      newVibes.forEach((v) => {
        if (vkw[v]) parts.push(vkw[v]);
      });
      if (newBudget && newBudget !== "any" && bkw[newBudget]) parts.push(bkw[newBudget]);
      return parts.join(" ");
    },
    [lang]
  );

  const handleToggleVibe = (id) => {
    const newVibes = vibes.includes(id) ? vibes.filter((v) => v !== id) : [...vibes, id];
    setVibes(newVibes);
    setQuery(buildSearchQuery(newVibes, household, budget));
  };

  const handleSelectHousehold = (id) => {
    const newHousehold = household === id ? null : id;
    setHousehold(newHousehold);
    if (id !== "fam") setBaby(null);
    setQuery(buildSearchQuery(vibes, newHousehold, budget));
  };

  const handleSelectBudget = (id) => {
    const newBudget = budget === id ? null : id;
    setBudget(newBudget);
    setQuery(buildSearchQuery(vibes, household, newBudget));
  };

  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setIngredientInput("");
  };

  const handleClearAll = () => {
    setQuery("");
    setVibes([]);
    setHousehold(null);
    setBudget(null);
    setBaby(null);
    setIngredients([]);
  };

  const handleSearch = () => {
    // Security check
    if (!validateInput(query)) {
      setSecurityError(t.securityBlock);
      setTimeout(() => setSecurityError(null), 3000);
      return;
    }
    setSecurityError(null);
    setPhase("loading");
    setLoadingStep(0);
    setJustSaved(false);

    [600, 1400, 2000].forEach((ms, i) => {
      setTimeout(() => setLoadingStep(i + 1), ms);
    });

    setTimeout(() => {
      if (aiQuota <= 0) {
        setResult(getLocalRecommendation(mode, vibes, recentMenus));
      } else {
        setAiQuota((q) => q - 1);
        setResult(mode === "order" ? MOCK_ORDER : MOCK_COOK);
      }
      setPhase("result");
    }, 2600);
  };

  const handleSaveToCalendar = (menu, category, decision) => {
    const dateStr = new Date().toISOString().split("T")[0];
    setCalendar((prev) => ({
      ...prev,
      [dateStr]: { menu, category, decision, date: dateStr },
    }));
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleReset = () => {
    setPhase("home");
    setResult(null);
    setFiltersExpanded(true);
    setCurrentPage("main");
    setShowCalendar(false);
  };

  const activeFilterCount =
    (mode !== "any" ? 1 : 0) +
    (household ? 1 : 0) +
    vibes.length +
    (budget ? 1 : 0);

  const getMonthData = (date) => ({
    firstDay: new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
    totalDays: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
    year: date.getFullYear(),
    month: date.getMonth(),
  });

  const todayStr = new Date().toISOString().split("T")[0];

  /* ═══════════════════════════════════════════════════
     RENDER: Static pages (About / Privacy)
     ═══════════════════════════════════════════════════ */
  if (currentPage !== "main") {
    return (
      <div style={styles.root}>
        <style>{globalCSS}</style>
        <header style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }} onClick={handleReset}>
            <span style={{ fontSize: 20 }}>🍽️</span>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -1 }}>{t.title}</span>
          </div>
        </header>
        <main style={{ ...styles.main, padding: "24px 16px" }}>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>
              {currentPage === "about" ? t.aboutTitle : t.privTitle}
            </h1>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: "#57534E", marginBottom: 24 }}>
              {currentPage === "about" ? t.aboutDesc : t.privDesc}
            </div>
            {currentPage === "privacy" && (
              <div style={{ fontSize: 13, lineHeight: 1.8, color: "#78716C" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#1a1a1a" }}>
                  1. {lang === "ko" ? "수집하는 개인정보" : "Data Collection"}
                </h3>
                <p style={{ marginBottom: 16 }}>
                  {lang === "ko"
                    ? "본 서비스는 회원가입이 없으며, 데이터는 브라우저 localStorage에만 저장됩니다."
                    : "No registration required. Data stored only in browser localStorage."}
                </p>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#1a1a1a" }}>
                  2. {lang === "ko" ? "광고" : "Advertising"}
                </h3>
                <p style={{ marginBottom: 16 }}>
                  {lang === "ko"
                    ? "Google AdSense를 통해 광고가 제공됩니다."
                    : "Ads served via Google AdSense."}
                </p>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#1a1a1a" }}>
                  3. {lang === "ko" ? "문의" : "Contact"}
                </h3>
                <p>contact@utilverse.net</p>
              </div>
            )}
            <button
              style={{ ...styles.ctaButton, marginTop: 24, cursor: "pointer" }}
              onClick={handleReset}
            >
              ← {lang === "ko" ? "메인으로" : "Back"}
            </button>
          </div>
        </main>
        <footer style={styles.footer}>
          <span style={{ fontSize: 10, color: "#D6D3D1" }}>{t.copyright}</span>
        </footer>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════
     RENDER: Main App
     ═══════════════════════════════════════════════════ */
  return (
    <div style={styles.root}>
      <style>{globalCSS}</style>

      {/* HEADER */}
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }} onClick={handleReset}>
          <span style={{ fontSize: 20 }}>🍽️</span>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -1 }}>{t.title}</span>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <div
            style={{
              fontSize: 9,
              padding: "3px 7px",
              borderRadius: 10,
              background: aiQuota > 10 ? "#F0FDF4" : aiQuota > 0 ? "#FFFBEB" : "#FEF2F2",
              color: aiQuota > 10 ? "#16A34A" : aiQuota > 0 ? "#D97706" : "#DC2626",
              fontWeight: 600,
            }}
          >
            🤖 {aiQuota > 0 ? aiQuota : "OFF"}
          </div>

          {/* Language switcher */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowLangMenu(!showLangMenu)} style={styles.headerBtn}>
              {LANG_LIST.find((l) => l.id === lang)?.flag || "🌐"}
            </button>
            {showLangMenu && (
              <div style={styles.langDropdown}>
                {LANG_LIST.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setLang(l.id);
                      setShowLangMenu(false);
                    }}
                    style={{
                      ...styles.langItem,
                      background: lang === l.id ? "#F5F5F4" : "#fff",
                    }}
                  >
                    {l.flag} {l.id.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setShowCalendar(!showCalendar);
              setCurrentPage("main");
            }}
            style={{
              ...styles.headerBtn,
              background: showCalendar ? "#1a1a1a" : "#fff",
              color: showCalendar ? "#fff" : "#57534E",
              border: showCalendar ? "1.5px solid #1a1a1a" : "1.5px solid #E7E5E4",
            }}
          >
            📅
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {showCalendar ? (
          /* ═══ CALENDAR ═══ */
          <div style={{ maxWidth: 460, margin: "0 auto", padding: "16px 0 40px" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 16 }}>
              {[
                ["month", t.monthly],
                ["week", t.weekly],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setCalendarView(key)}
                  style={{
                    padding: "7px 18px",
                    borderRadius: 20,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    background: calendarView === key ? "#1a1a1a" : "#F5F5F4",
                    color: calendarView === key ? "#fff" : "#78716C",
                    cursor: "pointer",
                    fontFamily: "'Noto Sans KR', sans-serif",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div style={styles.calendarCard}>
              {calendarView === "month" ? (
                (() => {
                  const { firstDay, totalDays, year, month } = getMonthData(currentMonth);
                  const cells = [
                    ...Array(firstDay).fill(null),
                    ...Array.from({ length: totalDays }, (_, i) => i + 1),
                  ];
                  return (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <button onClick={() => setCurrentMonth(new Date(year, month - 1))} style={styles.calendarNav}>
                          ◀
                        </button>
                        <span style={{ fontSize: 15, fontWeight: 700 }}>
                          {year}년 {month + 1}월
                        </span>
                        <button onClick={() => setCurrentMonth(new Date(year, month + 1))} style={styles.calendarNav}>
                          ▶
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                        {["일", "월", "화", "수", "목", "금", "토"].map((dayName, idx) => (
                          <div key={idx} style={{ textAlign: "center", fontSize: 10, color: "#A8A29E", fontWeight: 600, padding: 3 }}>
                            {dayName}
                          </div>
                        ))}
                        {cells.map((day, idx) => {
                          if (day === null) return <div key={"empty-" + idx} />;
                          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                          const entry = calendar[dateStr];
                          const isToday = dateStr === todayStr;
                          return (
                            <div
                              key={idx}
                              style={{
                                padding: "3px 1px",
                                borderRadius: 8,
                                minHeight: 52,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                background: isToday ? "#FFF7ED" : entry ? (entry.decision === "해먹기" ? "#F0FDF4" : "#EFF6FF") : "#fff",
                                border: isToday ? "2px solid #FB923C" : "1px solid #F5F5F4",
                              }}
                            >
                              <div style={{ fontSize: 10, color: isToday ? "#EA580C" : "#9CA3AF", fontWeight: isToday ? 700 : 400 }}>
                                {day}
                              </div>
                              {entry && (
                                <div style={{ textAlign: "center" }}>
                                  <div style={{ fontSize: 8, marginTop: 1 }}>{entry.decision === "해먹기" ? "🍳" : "🛵"}</div>
                                  <div
                                    style={{
                                      fontSize: 7,
                                      fontWeight: 600,
                                      color: "#374151",
                                      maxWidth: 44,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {entry.menu}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              ) : (
                (() => {
                  const today = new Date();
                  const startOfWeek = new Date(today);
                  startOfWeek.setDate(today.getDate() - today.getDay());
                  const weekDays = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date(startOfWeek);
                    d.setDate(startOfWeek.getDate() + i);
                    return d;
                  });
                  return (
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, textAlign: "center", marginBottom: 14 }}>{t.weekly}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {weekDays.map((d) => {
                          const ds = d.toISOString().split("T")[0];
                          const entry = calendar[ds];
                          const isToday = ds === todayStr;
                          const dayLabel = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
                          return (
                            <div
                              key={ds}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "9px 12px",
                                borderRadius: 10,
                                gap: 10,
                                background: isToday ? "#FFF7ED" : "#FAFAFA",
                                border: isToday ? "2px solid #FB923C" : "1px solid #F5F5F4",
                              }}
                            >
                              <div style={{ minWidth: 36, textAlign: "center" }}>
                                <div style={{ fontSize: 9, color: "#A8A29E", fontWeight: 600 }}>{dayLabel}</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: isToday ? "#EA580C" : "#374151" }}>
                                  {d.getDate()}
                                </div>
                              </div>
                              {entry ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1 }}>
                                  <span style={{ fontSize: 16 }}>{entry.decision === "해먹기" ? "🍳" : "🛵"}</span>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{entry.menu}</div>
                                    <span
                                      style={{
                                        fontSize: 9,
                                        padding: "1px 5px",
                                        borderRadius: 3,
                                        background: CAT_COLORS[entry.category]?.bg,
                                        color: CAT_COLORS[entry.category]?.fg,
                                      }}
                                    >
                                      {entry.category}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span style={{ fontSize: 12, color: "#D1D5DB" }}>{t.noRecord}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        ) : phase === "home" ? (
          /* ═══ HOME ═══ */
          <div style={{ padding: "28px 0 30px", maxWidth: 500, margin: "0 auto" }}>
            {/* Hero */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 38, marginBottom: 4, animation: "wmjFloat 3s ease-in-out infinite" }}>🍽️</div>
              <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1.2 }}>{t.title}</h1>
              <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 3 }}>{t.sub}</p>
            </div>

            {/* 흑백요리사 Banner */}
            <div
              onClick={() => {
                if (!vibes.includes("chef")) handleToggleVibe("chef");
              }}
              style={styles.chefBanner}
            >
              <span style={{ fontSize: 22 }}>👨‍🍳</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#5B21B6" }}>{t.chefBanner}</div>
              </div>
              <span style={{ fontSize: 12, color: "#7C3AED", fontWeight: 700 }}>
                {vibes.includes("chef") ? "✓ ON" : "→ TRY"}
              </span>
            </div>

            {/* Quota warning */}
            {aiQuota <= 0 && (
              <div style={styles.quotaWarning}>
                📡 {t.fallbackNote}
                <button
                  onClick={() => setAiQuota(50)}
                  style={{
                    fontSize: 9,
                    background: "none",
                    border: "1px solid #FCA5A5",
                    borderRadius: 6,
                    padding: "2px 6px",
                    color: "#DC2626",
                    cursor: "pointer",
                    marginLeft: "auto",
                    fontFamily: "'Noto Sans KR', sans-serif",
                  }}
                >
                  Reset
                </button>
              </div>
            )}

            {/* Filters restored toast */}
            {filterRestoredMsg && (
              <div style={{ textAlign: "center", fontSize: 11, color: "#16A34A", marginBottom: 6 }}>{t.filtersLoaded}</div>
            )}

            {/* Search Bar */}
            <div style={styles.searchBar}>
              <span style={{ fontSize: 17, opacity: 0.4 }}>🔍</span>
              <input
                style={styles.searchInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={(t.placeholders || [])[placeholderIndex] || ""}
              />
              {query && (
                <button
                  onClick={handleClearAll}
                  style={{ background: "none", border: "none", fontSize: 14, color: "#A8A29E", cursor: "pointer" }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Security error */}
            {securityError && (
              <div style={styles.securityAlert}>{securityError}</div>
            )}

            {/* Filter toggle */}
            <button onClick={() => setFiltersExpanded(!filtersExpanded)} style={styles.filterToggle}>
              <span>
                🎛 {t.filter}{" "}
                {activeFilterCount > 0 && <span style={styles.filterBadge}>{activeFilterCount}</span>}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "#A8A29E",
                  transform: filtersExpanded ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                  display: "inline-block",
                }}
              >
                ▾
              </span>
            </button>

            {filtersExpanded && (
              <div style={styles.filterPanel}>
                {/* Meal Mode */}
                <div style={styles.filterRow}>
                  <label style={styles.filterLabel}>{t.how}</label>
                  <div style={styles.filterChips}>
                    {[
                      { id: "any", label: t.anyMode, icon: "🎲", color: "#1a1a1a" },
                      { id: "cook", label: t.cook, icon: "🍳", color: "#16A34A" },
                      { id: "order", label: t.order, icon: "🛵", color: "#2563EB" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMode(mode === m.id ? "any" : m.id)}
                        style={{
                          ...styles.modeChip,
                          background: mode === m.id ? m.color : "#fff",
                          color: mode === m.id ? "#fff" : "#78716C",
                          border: mode === m.id ? `1.5px solid ${m.color}` : "1.5px solid #E7E5E4",
                          boxShadow: mode === m.id ? `0 3px 10px ${m.color}33` : "none",
                        }}
                      >
                        <span>{m.icon}</span> {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Household */}
                <div style={styles.filterRow}>
                  <label style={styles.filterLabel}>{t.who}</label>
                  <div style={styles.filterChips}>
                    {[
                      { id: "1p", label: t.p1, icon: "🧑" },
                      { id: "2p", label: t.p2, icon: "👫" },
                      { id: "fam", label: t.fam, icon: "👨‍👩‍👧‍👦" },
                    ].map((h) => (
                      <button
                        key={h.id}
                        onClick={() => handleSelectHousehold(h.id)}
                        style={{
                          ...styles.selectChip,
                          background: household === h.id ? "#1a1a1a" : "#fff",
                          color: household === h.id ? "#fff" : "#78716C",
                          border: household === h.id ? "1.5px solid #1a1a1a" : "1.5px solid #E7E5E4",
                        }}
                      >
                        <span>{h.icon}</span> {h.label}
                      </button>
                    ))}
                    {household === "fam" && (
                      <div style={styles.babySubFilter}>
                        <span style={{ fontSize: 10, color: "#B45309", fontWeight: 600 }}>👶 {t.babyQ}</span>
                        {[
                          { id: "no", label: t.noBaby, icon: "✕" },
                          { id: "infant", label: t.infant, icon: "👶" },
                          { id: "kid", label: t.kid, icon: "🧒" },
                        ].map((b) => (
                          <button
                            key={b.id}
                            onClick={() => setBaby(baby === b.id ? null : b.id)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: 14,
                              border: "none",
                              fontSize: 11,
                              fontWeight: 600,
                              background: baby === b.id ? "#F59E0B" : "#FEF3C7",
                              color: baby === b.id ? "#fff" : "#92400E",
                              cursor: "pointer",
                              fontFamily: "'Noto Sans KR', sans-serif",
                            }}
                          >
                            {b.icon} {b.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Vibes — 흑백요리사 FIRST */}
                <div style={styles.filterRow}>
                  <label style={styles.filterLabel}>{t.vibe}</label>
                  <div style={{ ...styles.filterChips, maxWidth: 420 }}>
                    {VIBE_LIST.map((v) => {
                      const isActive = vibes.includes(v.id);
                      const accent = v.accent || "#292524";
                      const isChef = v.id === "chef";
                      return (
                        <button
                          key={v.id}
                          onClick={() => handleToggleVibe(v.id)}
                          style={{
                            ...styles.tagChip,
                            background: isActive ? accent : isChef ? "#F5F3FF" : "#fff",
                            color: isActive ? "#fff" : "#78716C",
                            border: isActive
                              ? `1.5px solid ${accent}`
                              : isChef
                                ? "2px dashed #C4B5FD"
                                : "1.5px solid #E7E5E4",
                            boxShadow: isActive && isChef ? "0 3px 12px rgba(124,58,237,0.25)" : "none",
                          }}
                        >
                          {v.icon} {t[v.id] || v.id}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fridge ingredients */}
                {vibes.includes("fridge") && (
                  <div style={{ ...styles.filterRow, background: "#F0FDF4", borderRadius: 12, padding: "10px 12px" }}>
                    <label style={{ ...styles.filterLabel, color: "#16A34A" }}>🧊 {t.ingLabel}</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
                      {ingredients.map((ig) => (
                        <span key={ig} style={styles.ingredientTag}>
                          {ig}{" "}
                          <button
                            onClick={() => setIngredients(ingredients.filter((x) => x !== ig))}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#16A34A",
                              cursor: "pointer",
                              fontWeight: 700,
                              fontSize: 10,
                            }}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                      <input
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
                        placeholder={t.fridgeInput}
                        style={styles.ingredientInput}
                      />
                    </div>
                  </div>
                )}

                {/* Budget */}
                <div style={styles.filterRow}>
                  <label style={styles.filterLabel}>{t.budgetLabel}</label>
                  <div style={styles.filterChips}>
                    {BUDGET_LIST.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => handleSelectBudget(b.id)}
                        style={{
                          ...styles.tagChip,
                          background: budget === b.id ? "#292524" : "#fff",
                          color: budget === b.id ? "#fff" : "#78716C",
                          border: budget === b.id ? "1.5px solid #292524" : "1.5px solid #E7E5E4",
                        }}
                      >
                        {t[b.key] || b.id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <button onClick={handleSearch} style={styles.ctaButton}>
              🍽️ {t.cta}
            </button>
            <div style={{ textAlign: "center", marginTop: 6, fontSize: 11, color: "#C4B5A4" }}>{t.ctaSub}</div>
          </div>
        ) : phase === "loading" ? (
          /* ═══ LOADING ═══ */
          <div style={{ maxWidth: 400, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 20, animation: "wmjFloat 1.5s ease-in-out infinite" }}>
              {loadingStep < 2 ? "🤔" : "🍳"}
            </div>
            {[t.ld1, t.ld2, t.ld3].map((text, i) => (
              <div
                key={i}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: loadingStep > i ? "#1a1a1a" : "#D6D3D1",
                  transition: "color 0.4s",
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {loadingStep > i ? "✅" : loadingStep === i ? <span style={{ animation: "wmjPulse 1s infinite" }}>⏳</span> : "○"}{" "}
                {text}
              </div>
            ))}
            {recentMenus.length > 0 && (
              <div style={{ marginTop: 14, fontSize: 11, color: "#A8A29E" }}>{t.excludeMsg}</div>
            )}
          </div>
        ) : result ? (
          /* ═══ RESULT ═══ */
          <div style={{ maxWidth: 520, margin: "0 auto", padding: "8px 0 30px" }}>
            {/* Compact search bar */}
            <div onClick={handleReset} style={styles.compactSearchBar}>
              <span style={{ fontSize: 13 }}>🔍</span>
              <span style={{ fontSize: 12, color: "#78716C", flex: 1 }}>{query || t.reSearch}</span>
              <span style={{ fontSize: 11, color: "#A8A29E" }}>{t.editBtn}</span>
            </div>

            {/* Fallback notice */}
            {result._isFallback && <div style={styles.fallbackNotice}>📡 {t.fallbackNote}</div>}

            {/* Decision banner */}
            <div
              style={{
                ...styles.decisionBanner,
                background:
                  result.decision === "해먹기"
                    ? "linear-gradient(135deg, #22C55E, #15803D)"
                    : "linear-gradient(135deg, #3B82F6, #1D4ED8)",
              }}
            >
              <span style={{ fontSize: 28 }}>{result.decision === "해먹기" ? "🍳" : "🛵"}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>
                  {t.todayIs} {result.decision}!
                </div>
                <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>{result.reason}</div>
                <span
                  style={{
                    fontSize: 9,
                    padding: "2px 6px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.2)",
                    marginTop: 4,
                    display: "inline-block",
                  }}
                >
                  {result._isFallback ? t.fallbackBadge : t.aiBadge}
                </span>
              </div>
            </div>

            {/* Sweet set */}
            {result.sweet_set && (
              <div style={styles.sweetBanner}>
                <span style={{ fontSize: 20 }}>🍰</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#DB2777" }}>
                    + {t.sweet}: {result.sweet_set.dessert}
                  </div>
                  <div style={{ fontSize: 11, color: "#9D174D" }}>{result.sweet_set.reason}</div>
                </div>
              </div>
            )}

            {/* Main card */}
            <div style={styles.mainCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 4 }}>{result.main.menu}</h2>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 5,
                      background: CAT_COLORS[result.main.category]?.bg,
                      color: CAT_COLORS[result.main.category]?.fg,
                    }}
                  >
                    {result.main.category}
                  </span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#EA580C" }}>
                  ₩{(result.main.price || 0).toLocaleString()}
                </div>
              </div>

              <p style={{ fontSize: 13, color: "#57534E", lineHeight: 1.55, margin: "12px 0 14px" }}>{result.main.reason}</p>

              {result.main.time_min && (
                <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                  <div style={styles.metaInfo}>
                    ⏱ <b>{result.main.time_min}분</b>
                  </div>
                  {result.main.difficulty && (
                    <div style={styles.metaInfo}>
                      <span style={{ color: "#F59E0B" }}>{difficultyStars(result.main.difficulty)}</span>{" "}
                      <b>{["", "쉬움", "보통", "어려움"][result.main.difficulty]}</b>
                    </div>
                  )}
                </div>
              )}

              {/* YouTube */}
              {result.main.youtube && (
                <div style={styles.linksSection}>
                  <div style={styles.linksTitle}>📺 {t.ytLabel}</div>
                  {result.main.youtube.map((yt, i) => (
                    <a key={i} href={yt.url} target="_blank" rel="noopener noreferrer" style={styles.linkItem}>
                      <div style={{ ...styles.linkIcon, background: "#FF0000" }}>▶</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{yt.title}</div>
                        <div style={{ fontSize: 10, color: "#A8A29E" }}>
                          {yt.channel} · {yt.views}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Blog */}
              {result.main.blog && (
                <div style={{ ...styles.linksSection, marginTop: 10 }}>
                  <div style={styles.linksTitle}>📝 {t.blogLabel}</div>
                  {result.main.blog.map((bl, i) => (
                    <a key={i} href={bl.url} target="_blank" rel="noopener noreferrer" style={styles.linkItem}>
                      <div style={{ ...styles.linkIcon, background: "#22C55E" }}>B</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{bl.title}</div>
                    </a>
                  ))}
                </div>
              )}

              {/* Restaurants */}
              {result.main.restaurants && (
                <div style={styles.linksSection}>
                  <div style={styles.linksTitle}>🏪 {t.restLabel}</div>
                  {result.main.restaurants.map((r, i) => (
                    <div key={i} style={styles.restaurantItem}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</div>
                        {r.rating > 0 && (
                          <div style={{ fontSize: 11, color: "#A8A29E", marginTop: 2 }}>
                            ⭐ {r.rating} · 배달비 {r.delivery_fee.toLocaleString()}원 · ~{r.estimated_min}분
                          </div>
                        )}
                      </div>
                      <button style={styles.orderButton}>{t.orderBtn}</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button
                  onClick={() => handleSaveToCalendar(result.main.menu, result.main.category, result.decision)}
                  style={styles.saveButton}
                >
                  {justSaved ? "✅ " + t.savedMsg : "📅 " + t.addCal}
                </button>
                <button onClick={handleSearch} style={styles.retryButton}>
                  🔄 {t.retry}
                </button>
              </div>
            </div>

            {/* Alternatives */}
            <div style={{ marginTop: 20, marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#A8A29E" }}>{t.altTitle}</span>
            </div>
            {result.alt.map((alt, i) => (
              <div key={i} style={styles.altCard}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      background: result.decision === "해먹기" ? "#F0FDF4" : "#EFF6FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}
                  >
                    {result.decision === "해먹기" ? "🍳" : "🛵"}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{alt.menu}</div>
                    <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
                      <span
                        style={{
                          fontSize: 9,
                          padding: "1px 6px",
                          borderRadius: 3,
                          background: CAT_COLORS[alt.category]?.bg,
                          color: CAT_COLORS[alt.category]?.fg,
                          fontWeight: 600,
                        }}
                      >
                        {alt.category}
                      </span>
                      {alt.time_min && <span style={{ fontSize: 10, color: "#A8A29E" }}>⏱ {alt.time_min}분</span>}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#EA580C" }}>₩{(alt.price || 0).toLocaleString()}</div>
                  <button
                    onClick={() => handleSaveToCalendar(alt.menu, alt.category, result.decision)}
                    style={{ background: "none", border: "none", fontSize: 10, color: "#A8A29E", cursor: "pointer" }}
                  >
                    + {t.addCal}
                  </button>
                </div>
              </div>
            ))}

            {/* Ad placeholder */}
            <div style={styles.adPlaceholder}>
              <span style={{ fontSize: 10, color: "#D6D3D1" }}>AD · Google AdSense</span>
            </div>
          </div>
        ) : null}
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 8 }}>
          <button
            onClick={() => {
              setCurrentPage("about");
              setShowCalendar(false);
              setPhase("home");
            }}
            style={styles.footerLink}
          >
            {t.aboutTitle}
          </button>
          <button
            onClick={() => {
              setCurrentPage("privacy");
              setShowCalendar(false);
              setPhase("home");
            }}
            style={styles.footerLink}
          >
            {t.privTitle}
          </button>
          <a href="mailto:contact@utilverse.net" style={styles.footerLink}>
            {t.contactTitle}
          </a>
        </div>
        <div style={{ fontSize: 10, color: "#D6D3D1" }}>{t.copyright}</div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   GLOBAL CSS
   ═══════════════════════════════════════════════════ */
const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #FAFAF9; }
@keyframes wmjFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes wmjFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes wmjPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
input:focus { outline: none; border-color: #A8A29E !important; }
input::placeholder { color: #C4B5A4; }
button { cursor: pointer; font-family: 'Noto Sans KR', sans-serif; -webkit-tap-highlight-color: transparent; }
`;

/* ═══════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════ */
const styles = {
  root: { fontFamily: "'Noto Sans KR', sans-serif", minHeight: "100vh", background: "#FAFAF9", display: "flex", flexDirection: "column" },
  header: { position: "sticky", top: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: "rgba(250,250,249,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid #F5F5F4" },
  headerBtn: { padding: "6px 10px", borderRadius: 16, fontSize: 14, fontWeight: 600, border: "1.5px solid #E7E5E4", background: "#fff", color: "#57534E", fontFamily: "'Noto Sans KR', sans-serif" },
  main: { padding: "0 14px", maxWidth: 580, margin: "0 auto", width: "100%", flex: 1 },
  footer: { padding: "24px 16px 32px", textAlign: "center", borderTop: "1px solid #F5F5F4", marginTop: "auto" },
  footerLink: { background: "none", border: "none", fontSize: 11, color: "#A8A29E", cursor: "pointer", textDecoration: "underline", fontFamily: "'Noto Sans KR', sans-serif" },

  chefBanner: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "linear-gradient(135deg, #F5F3FF, #EDE9FE)", borderRadius: 14, border: "2px solid #C4B5FD", marginBottom: 12, cursor: "pointer", transition: "all 0.2s" },
  quotaWarning: { display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "#FEF2F2", borderRadius: 10, border: "1.5px solid #FECACA", fontSize: 11, color: "#DC2626", fontWeight: 500, marginBottom: 10 },
  securityAlert: { padding: "8px 12px", background: "#FEF2F2", borderRadius: 10, border: "1.5px solid #FECACA", fontSize: 12, color: "#DC2626", fontWeight: 500, marginBottom: 8, textAlign: "center" },

  searchBar: { display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", background: "#fff", borderRadius: 24, border: "2px solid #E7E5E4", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", marginBottom: 12 },
  searchInput: { flex: 1, border: "none", fontSize: 15, fontWeight: 500, color: "#1a1a1a", background: "transparent", fontFamily: "'Noto Sans KR', sans-serif" },

  filterToggle: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "8px 14px", background: "#fff", borderRadius: 12, border: "1.5px solid #E7E5E4", fontSize: 13, fontWeight: 600, color: "#57534E", marginBottom: 8, fontFamily: "'Noto Sans KR', sans-serif" },
  filterBadge: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: 9, background: "#EA580C", color: "#fff", fontSize: 10, fontWeight: 700, marginLeft: 4 },
  filterPanel: { background: "#fff", borderRadius: 16, border: "1.5px solid #F5F5F4", padding: 14, marginBottom: 12, display: "flex", flexDirection: "column", gap: 14 },
  filterRow: { display: "flex", alignItems: "flex-start", gap: 8, flexWrap: "wrap" },
  filterLabel: { fontSize: 11, fontWeight: 700, color: "#A8A29E", minWidth: 38, paddingTop: 8, flexShrink: 0 },
  filterChips: { display: "flex", flexWrap: "wrap", gap: 5, flex: 1 },
  modeChip: { display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, fontFamily: "'Noto Sans KR', sans-serif", transition: "all 0.18s" },
  selectChip: { display: "flex", alignItems: "center", gap: 4, padding: "7px 14px", borderRadius: 18, fontSize: 12, fontWeight: 600, fontFamily: "'Noto Sans KR', sans-serif", transition: "all 0.18s" },
  tagChip: { display: "flex", alignItems: "center", gap: 3, padding: "6px 12px", borderRadius: 16, fontSize: 12, fontWeight: 500, fontFamily: "'Noto Sans KR', sans-serif", transition: "all 0.18s" },
  babySubFilter: { display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", background: "#FFFBEB", borderRadius: 12, border: "1px solid #FDE68A", flexBasis: "100%" },
  ingredientTag: { display: "inline-flex", alignItems: "center", padding: "3px 9px", background: "#DCFCE7", color: "#15803D", borderRadius: 12, fontSize: 11, fontWeight: 600 },
  ingredientInput: { padding: "5px 10px", borderRadius: 10, border: "1.5px solid #D1FAE5", fontSize: 12, fontFamily: "'Noto Sans KR', sans-serif", background: "#fff", width: 140 },

  ctaButton: { display: "block", width: "100%", padding: "14px 0", borderRadius: 24, border: "none", background: "linear-gradient(135deg, #EA580C, #DC2626)", color: "#fff", fontSize: 16, fontWeight: 800, boxShadow: "0 4px 20px rgba(234,88,12,0.25)", letterSpacing: -0.5, textAlign: "center", marginTop: 8, fontFamily: "'Noto Sans KR', sans-serif" },

  compactSearchBar: { display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", background: "#fff", borderRadius: 20, border: "1.5px solid #E7E5E4", marginBottom: 12, cursor: "pointer" },
  fallbackNotice: { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#FFF7ED", borderRadius: 12, border: "1.5px solid #FED7AA", fontSize: 12, color: "#C2410C", fontWeight: 500, marginBottom: 10 },
  decisionBanner: { display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderRadius: 18, color: "#fff", marginBottom: 10 },
  sweetBanner: { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 14, background: "#FDF2F8", border: "1.5px solid #FBCFE8", marginBottom: 10 },
  mainCard: { background: "#fff", borderRadius: 18, padding: 20, border: "1px solid #F5F5F4", boxShadow: "0 2px 16px rgba(0,0,0,0.03)" },
  metaInfo: { display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#78716C" },
  linksSection: { marginTop: 14, padding: 12, background: "#FAFAF9", borderRadius: 12, border: "1px solid #F5F5F4" },
  linksTitle: { fontSize: 12, fontWeight: 700, color: "#57534E", marginBottom: 8 },
  linkItem: { display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid #F5F5F4", textDecoration: "none", cursor: "pointer" },
  linkIcon: { width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700, flexShrink: 0 },
  restaurantItem: { display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid #F5F5F4" },
  orderButton: { padding: "5px 12px", borderRadius: 8, border: "1.5px solid #2563EB", background: "#EFF6FF", color: "#2563EB", fontSize: 11, fontWeight: 700, fontFamily: "'Noto Sans KR', sans-serif" },
  saveButton: { flex: 1, padding: "11px 0", borderRadius: 12, border: "none", background: "#1a1a1a", color: "#fff", fontSize: 12, fontWeight: 700, textAlign: "center", fontFamily: "'Noto Sans KR', sans-serif" },
  retryButton: { padding: "11px 16px", borderRadius: 12, border: "1.5px solid #E7E5E4", background: "#fff", color: "#57534E", fontSize: 12, fontWeight: 700, fontFamily: "'Noto Sans KR', sans-serif" },
  altCard: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #F5F5F4", marginBottom: 6, boxShadow: "0 1px 4px rgba(0,0,0,0.02)" },
  adPlaceholder: { marginTop: 20, padding: 24, background: "#F5F5F4", borderRadius: 14, textAlign: "center", border: "1px dashed #E7E5E4" },

  calendarCard: { background: "#fff", borderRadius: 18, padding: 16, border: "1px solid #F5F5F4", boxShadow: "0 2px 16px rgba(0,0,0,0.03)" },
  calendarNav: { background: "none", border: "1.5px solid #E7E5E4", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#78716C", fontFamily: "'Noto Sans KR', sans-serif", cursor: "pointer" },

  langDropdown: { position: "absolute", right: 0, top: "100%", marginTop: 4, background: "#fff", borderRadius: 12, border: "1.5px solid #E7E5E4", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", overflow: "hidden", zIndex: 200, minWidth: 100 },
  langItem: { display: "block", width: "100%", padding: "8px 14px", border: "none", textAlign: "left", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif" },
};
