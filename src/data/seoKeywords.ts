export interface SeoKeyword {
  slug: string;
  ko: { title: string; description: string };
  en: { title: string; description: string };
  ja: { title: string; description: string };
  zh: { title: string; description: string };
  preset: { vibes?: string[]; house?: string; budget?: string };
}

export const SEO_KEYWORDS: SeoKeyword[] = [
  {
    slug: '비오는날-혼밥-추천',
    ko: { title: '비오는날 혼밥 뭐 먹지? AI 추천', description: '비 오는 날 혼자 먹기 좋은 메뉴를 AI가 추천해드려요' },
    en: { title: 'What to eat alone on a rainy day?', description: 'AI recommends the best solo meals for rainy days' },
    ja: { title: '雨の日の一人ごはん何食べる？', description: '雨の日に一人で食べるメニューをAIが提案' },
    zh: { title: '下雨天一个人吃什么？', description: 'AI推荐下雨天适合一人食的菜单' },
    preset: { vibes: ['rain'], house: 'solo' },
  },
  {
    slug: '야근후-간단한-저녁',
    ko: { title: '야근 후 간단한 저녁 메뉴 추천', description: '야근 후 지친 몸에 딱 맞는 간단한 저녁 메뉴' },
    en: { title: 'Easy dinner after overtime work', description: 'Quick and easy dinner ideas after a long day at work' },
    ja: { title: '残業後の簡単夕食メニュー', description: '残業後に疲れた体に優しい簡単夕食を提案' },
    zh: { title: '加班后吃什么简单的晚餐？', description: 'AI推荐加班后快速简单的晚餐菜单' },
    preset: { vibes: ['late'] },
  },
  {
    slug: '다이어트-점심-추천',
    ko: { title: '다이어트 중 점심 뭐 먹지?', description: '칼로리 걱정 없는 다이어트 점심 메뉴 AI 추천' },
    en: { title: 'Diet-friendly lunch ideas', description: 'AI recommends healthy low-calorie lunch options' },
    ja: { title: 'ダイエット中のランチ何食べる？', description: 'カロリー控えめなダイエット向けランチをAIが提案' },
    zh: { title: '减肥期间吃什么午餐？', description: 'AI推荐低卡路里的减肥午餐菜单' },
    preset: { vibes: ['diet'] },
  },
  {
    slug: '흑백요리사-레시피-추천',
    ko: { title: '흑백요리사 출연 메뉴 따라하기', description: '흑백요리사 셰프들의 시그니처 메뉴를 집에서 따라해보세요' },
    en: { title: "Black and White Chef's recipe recommendations", description: "Try recreating Black and White Chef's signature dishes at home" },
    ja: { title: 'シェフのレシピおすすめ', description: '人気シェフのシグネチャーメニューを自宅で再現' },
    zh: { title: '大厨菜谱推荐', description: '在家尝试复现大厨们的招牌菜单' },
    preset: { vibes: ['chef'] },
  },
  {
    slug: '만원이하-저녁-추천',
    ko: { title: '만원 이하 저녁 메뉴 추천', description: '1만원 이하로 즐길 수 있는 실속 저녁 메뉴 AI 추천' },
    en: { title: 'Dinner under $10 recommendations', description: 'AI recommends budget-friendly dinner options under $10' },
    ja: { title: '1000円以下の夕食メニュー', description: '1000円以内で楽しめるコスパ夕食をAIが提案' },
    zh: { title: '60元以下晚餐推荐', description: 'AI推荐60元以内实惠的晚餐菜单' },
    preset: { budget: 'under10k' },
  },
  {
    slug: '커플-데이트-메뉴',
    ko: { title: '커플 데이트 뭐 먹지?', description: '연인과 함께하는 특별한 식사 메뉴 AI 추천' },
    en: { title: 'Couple date meal ideas', description: 'AI recommends romantic meal ideas for couples' },
    ja: { title: 'カップルデートのメニュー', description: '恋人と楽しむ特別な食事をAIが提案' },
    zh: { title: '情侣约会吃什么？', description: 'AI推荐适合情侣约会的浪漫餐食菜单' },
    preset: { house: 'couple' },
  },
  {
    slug: '야식-배달-추천',
    ko: { title: '야식 배달 뭐 시킬까?', description: '늦은 밤 출출할 때 딱 맞는 야식 배달 메뉴 추천' },
    en: { title: 'Late night delivery food ideas', description: 'AI recommends the best late-night delivery options' },
    ja: { title: '夜食デリバリー何注文する？', description: '夜遅くに食べたい出前メニューをAIが提案' },
    zh: { title: '夜宵外卖点什么？', description: 'AI推荐深夜最适合的夜宵外卖菜单' },
    preset: {},
  },
  {
    slug: '가족-주말-브런치',
    ko: { title: '가족 주말 브런치 메뉴', description: '온 가족이 함께 즐기는 주말 브런치 메뉴 AI 추천' },
    en: { title: 'Family weekend brunch ideas', description: 'AI recommends the perfect weekend brunch for the whole family' },
    ja: { title: '家族の週末ブランチメニュー', description: '家族みんなで楽しむ週末ブランチをAIが提案' },
    zh: { title: '家庭周末早午餐菜单', description: 'AI推荐全家一起享用的周末早午餐菜单' },
    preset: { house: 'family' },
  },
  {
    slug: '매운거-추천-메뉴',
    ko: { title: '매운거 땡길 때 추천 메뉴', description: '얼큰하고 매콤한 메뉴 AI 추천 — 매운 맛 당길 때 딱!'},
    en: { title: 'Spicy food recommendations', description: 'AI recommends the best spicy dishes when you crave heat' },
    ja: { title: '辛いもの食べたい時のおすすめ', description: '辛いものが食べたい時のベストメニューをAIが提案' },
    zh: { title: '想吃辣的时候推荐什么？', description: 'AI推荐想吃辣时的最佳辣味菜单' },
    preset: {},
  },
  {
    slug: '혼밥-자취생-일주일-식단',
    ko: { title: '자취생 일주일 식단 추천', description: '1인 자취생을 위한 일주일 식단 AI 추천' },
    en: { title: 'Weekly meal plan for solo living', description: 'AI recommends a weekly meal plan for people living alone' },
    ja: { title: '一人暮らし一週間の食事計画', description: '一人暮らし向け一週間の献立をAIが提案' },
    zh: { title: '独居一周饮食计划推荐', description: 'AI为独居人士推荐一周饮食计划' },
    preset: { house: 'solo' },
  },
];
