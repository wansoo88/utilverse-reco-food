import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BUDGET_KEYWORDS, HOUSE_KEYWORDS, VIBE_KEYWORDS } from '@/data/filterKeywords';
import { SEO_KEYWORDS } from '@/data/seoKeywords';
import { SiteFooter } from '@/components/ui/SiteFooter';
import { getSeoRecommendation } from '@/lib/seoRecommendationCache';
import { buildYoutubeRecipeLinks } from '@/lib/youtubeRecipes';
import { COOK_MENUS, ORDER_MENUS } from '@/data/localMenus';
import { LOCALES, SITE_DESCRIPTION, SITE_NAME, SITE_URL, type Locale } from '@/config/site';
import { getTranslations } from 'next-intl/server';
import { localePath } from '@/lib/localePath';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export const revalidate = 60 * 60 * 24 * 7;

const getLocale = (lang: string): Locale => (
  (LOCALES as readonly string[]).includes(lang) ? (lang as Locale) : 'ko'
);

const PAGE_COPY: Record<Locale, {
  home: string;
  guide: string;
  picks: string;
  conditions: string;
  related: string;
  youtube: string;
  why: string;
  compare: string;
  direct: string;
  cta: string;
  faqTitle: string;
  cookTitle: string;
  cookBody: string;
  orderTitle: string;
  orderBody: string;
  faqQ1Suffix: string;
  faqA1: string;
  faqQ2: string;
  faqA2Cook: string;
  faqA2Order: string;
  faqQ3: string;
  faqA3: string;
  popularTitle: string;
}> = {
  ko: {
    home: '홈',
    guide: 'AI 메뉴 가이드',
    picks: '추천 메뉴',
    conditions: '추천 조건',
    related: '관련 키워드',
    youtube: '유튜브 레시피',
    why: '왜 이 메뉴가 잘 맞을까',
    compare: '해먹기 vs 시켜먹기',
    direct: '이 페이지는 특정 상황에서 바로 고를 수 있는 메뉴를 빠르게 정리한 가이드입니다.',
    cta: '직접 추천받기',
    faqTitle: '자주 묻는 질문',
    cookTitle: '🍳 직접 해먹기',
    cookBody: '재료비가 낮고 취향대로 간·양을 조절할 수 있습니다. 설거지가 번거롭지만 남은 재료를 활용할 수 있어 경제적입니다.',
    orderTitle: '🛵 시켜먹기',
    orderBody: '조리 시간이 0분이고 다양한 메뉴를 선택할 수 있습니다. 배달비가 추가되지만 피곤하거나 재료가 없을 때 최선입니다.',
    faqQ1Suffix: '에서 메뉴를 고를 때 가장 중요한 기준은 무엇인가요?',
    faqA1: '지금 당장의 상황(시간, 피로도, 예산, 인원)을 먼저 파악하세요. 이 페이지에서는 해당 상황에 맞는 필터 조건을 미리 적용해 선택지를 좁혔습니다. 추천 메뉴 5개 중 상단에 위치한 메뉴가 종합 점수가 가장 높습니다.',
    faqQ2: '배달과 직접 요리 중 어떤 쪽이 더 만족스러울까요?',
    faqA2Cook: '재료가 준비돼 있고 요리에 30분 이상 투자할 수 있다면 직접 해먹는 편이 비용 대비 만족도가 높습니다.',
    faqA2Order: '재료가 없거나 피로한 상태라면 배달이 현실적인 선택입니다. 배달비를 고려해도 시간 절약 가치가 큽니다.',
    faqQ3: 'AI 추천이 실제 상황에 맞지 않으면 어떻게 하나요?',
    faqA3: '메인 페이지에서 가구 유형, 상황, 예산 필터를 직접 조정하거나, 검색창에 원하는 상황을 자유롭게 입력하면 더 맞춤화된 결과를 받을 수 있습니다. AI가 매번 다른 메뉴를 제안하므로 다시 추천받기 버튼을 눌러보세요.',
    popularTitle: '오늘의 인기 추천',
  },
  en: {
    home: 'Home',
    guide: 'AI Menu Guide',
    picks: 'Recommended Menus',
    conditions: 'Recommendation Filters',
    related: 'Related Keywords',
    youtube: 'YouTube Recipes',
    why: 'Why this works',
    compare: 'Cook vs Order',
    direct: 'This page is designed to help people narrow down a practical food choice for a specific situation.',
    cta: 'Get a live recommendation',
    faqTitle: 'Frequently Asked Questions',
    cookTitle: '🍳 Cook at home',
    cookBody: 'Lower cost and full control over ingredients and taste. Requires prep time but great for using leftovers.',
    orderTitle: '🛵 Order delivery',
    orderBody: 'Zero cooking time and wide variety. Delivery fee adds cost, but ideal when tired or lacking ingredients.',
    faqQ1Suffix: '— how should I decide which menu to choose?',
    faqA1: 'Start by assessing your current situation: time available, energy level, budget, and number of people. This page pre-applies filters matching that context, so the top-ranked menu has the highest fit score.',
    faqQ2: 'Is cooking at home or ordering delivery more satisfying?',
    faqA2Cook: 'If you have ingredients ready and 30+ minutes to cook, home cooking typically delivers better value.',
    faqA2Order: 'If you\'re tired or lacking ingredients, delivery is the practical choice. The time saved often outweighs the delivery fee.',
    faqQ3: 'What if the AI recommendation doesn\'t match my situation?',
    faqA3: 'Use the filters on the main page to adjust household type, situation, and budget, or type your situation freely in the search bar. The AI generates different results each time, so try the "retry" button.',
    popularTitle: 'Popular today',
  },
  ja: {
    home: 'ホーム',
    guide: 'AIメニューガイド',
    picks: 'おすすめメニュー',
    conditions: 'おすすめ条件',
    related: '関連キーワード',
    youtube: 'YouTubeレシピ',
    why: 'このメニューが合う理由',
    compare: '自炊 vs デリバリー',
    direct: 'このページは、特定の状況で選びやすいメニュー候補を素早く整理するためのガイドです。',
    cta: '直接おすすめを受ける',
    faqTitle: 'よくある質問',
    cookTitle: '🍳 自炊',
    cookBody: '食材費が安く、味や量を自分好みに調整できます。後片付けは面倒ですが、残り食材を活用できて経済的です。',
    orderTitle: '🛵 デリバリー',
    orderBody: '調理時間ゼロで多彩なメニューから選べます。配達料が加算されますが、疲れているときや食材がないときに最適です。',
    faqQ1Suffix: 'のメニュー選びで最も重要な基準は何ですか？',
    faqA1: '今の状況（時間、疲れ度、予算、人数）をまず把握してください。このページでは状況に合ったフィルター条件を事前に適用して選択肢を絞っています。',
    faqQ2: '自炊とデリバリーはどちらが満足度が高いですか？',
    faqA2Cook: '食材があり30分以上調理できるなら、自炊はコストパフォーマンスが高いです。',
    faqA2Order: '疲れていたり食材がない場合は、デリバリーが現実的な選択です。時間節約の価値が配達料を上回ります。',
    faqQ3: 'AIのおすすめが状況に合わない場合はどうすればいいですか？',
    faqA3: 'メインページで家族構成・状況・予算のフィルターを調整するか、検索欄に状況を自由に入力すると、よりカスタマイズされた結果が得られます。',
    popularTitle: '今日の人気メニュー',
  },
  zh: {
    home: '首页',
    guide: 'AI菜单指南',
    picks: '推荐菜单',
    conditions: '推荐条件',
    related: '相关关键词',
    youtube: 'YouTube食谱',
    why: '为什么适合这个场景',
    compare: '自己做 vs 外卖',
    direct: '这个页面用于在特定场景下快速缩小可选菜单范围，帮助用户更快做决定。',
    cta: '直接获取推荐',
    faqTitle: '常见问题',
    cookTitle: '🍳 自己做',
    cookBody: '食材成本低，可以按口味调整。需要准备时间，但可以利用剩余食材，经济实惠。',
    orderTitle: '🛵 点外卖',
    orderBody: '零烹饪时间，菜品选择丰富。需要配送费，但疲惫或没有食材时是最佳选择。',
    faqQ1Suffix: '的情况下，选菜单最重要的标准是什么？',
    faqA1: '首先了解当前状况：时间、疲劳程度、预算和人数。本页面已预先应用了匹配该场景的筛选条件，排名靠前的菜单综合得分最高。',
    faqQ2: '自己做和点外卖哪个更满意？',
    faqA2Cook: '如果有食材且有30分钟以上可以烹饪，自己做的性价比更高。',
    faqA2Order: '如果疲惫或缺少食材，点外卖是现实的选择。节省的时间价值往往超过配送费。',
    faqQ3: 'AI推荐与实际情况不符时怎么办？',
    faqA3: '在主页调整家庭类型、场景、预算筛选条件，或在搜索框中自由输入情况，即可获得更个性化的结果。AI每次生成不同菜单，也可以点击重新推荐按钮。',
    popularTitle: '今日热门推荐',
  },
};

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const locale of LOCALES) {
    for (const keyword of SEO_KEYWORDS) {
      params.push({ lang: locale, slug: keyword.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const keyword = SEO_KEYWORDS.find((item) => item.slug === slug);
  if (!keyword) return {};

  const locale = getLocale(lang);
  const meta = keyword[locale];
  // as-needed: ko는 /eat/menu/slug, 외국어는 /en/eat/menu/slug
  const path = localePath(locale, `/eat/menu/${keyword.slug}`);

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        LOCALES.map((item) => [item, localePath(item, `/eat/menu/${keyword.slug}`)]),
      ),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: path,
      type: 'article',
      siteName: SITE_NAME,
      images: [{ url: `${path}/opengraph-image` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [`${path}/opengraph-image`],
    },
  };
}

export default async function MenuSlugPage({ params }: Props) {
  const { lang, slug } = await params;
  const keyword = SEO_KEYWORDS.find((item) => item.slug === slug);

  if (!keyword) notFound();

  const locale = getLocale(lang);
  const meta = keyword[locale];
  const recommendation = getSeoRecommendation(keyword);
  const primaryItem = recommendation.items[0];
  const relatedKeywords = SEO_KEYWORDS.filter((item) => item.slug !== keyword.slug).slice(0, 6);
  // 오늘의 인기 추천 (localMenus에서 시간대별 랜덤 3개)
  const allMenus = [...COOK_MENUS, ...ORDER_MENUS];
  const popularMenus = allMenus.slice(0, 30).sort(() => 0.5 - Math.random()).slice(0, 3);
  const youtubeLinks = buildYoutubeRecipeLinks(recommendation.items, locale);
  const canonicalUrl = `${SITE_URL}${localePath(locale, `/eat/menu/${keyword.slug}`)}`;
  const copy = PAGE_COPY[locale];
  const tags = [
    keyword.preset.house ? HOUSE_KEYWORDS[locale][keyword.preset.house] : null,
    keyword.preset.budget && keyword.preset.budget !== 'any'
      ? BUDGET_KEYWORDS[locale][keyword.preset.budget]
      : null,
    ...(keyword.preset.vibes ?? []).map((item) => VIBE_KEYWORDS[locale][item]),
  ].filter((item): item is string => Boolean(item));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.description,
    inLanguage: locale,
    mainEntityOfPage: canonicalUrl,
    about: recommendation.items.map((item) => item.name),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };
  const recipeJsonLd = primaryItem ? {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: primaryItem.name,
    description: `${meta.description} ${primaryItem.reason}`,
    inLanguage: locale,
    keywords: tags.join(', '),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    isPartOf: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  } : null;
  const bodyParagraphs = primaryItem ? [
    `${copy.direct} ${meta.title}처럼 검색 의도가 분명한 경우에는 메뉴를 넓게 늘어놓기보다, 지금 상황에서 실패 확률이 낮은 선택지를 먼저 제시하는 편이 더 유용합니다.`,
    `${primaryItem.name}은(는) ${primaryItem.reason}라는 점에서 첫 선택지로 적합합니다. ${tags.length > 0 ? `특히 ${tags.join(', ')} 조건을 함께 고려할 때 더 자연스럽게 연결됩니다.` : '현재 페이지의 상황 설명과도 무리 없이 연결됩니다.'}`,
    `대안 메뉴는 같은 상황 안에서 취향, 비용감, 준비 방식만 조금 다르게 가져갈 수 있도록 묶었습니다. 바로 주문할지 직접 만들지 망설이는 사용자에게 비교 출발점을 제공하는 것이 목적입니다.`,
  ] : [];
  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-4xl px-4 py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {recipeJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
          />
        )}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href={localePath(locale, '/')} className="hover:text-gray-900">{copy.home}</Link>
          <span className="mx-2">/</span>
          <span>{meta.title}</span>
        </nav>

        <section className="rounded-[2rem] bg-gradient-to-br from-orange-50 via-white to-amber-100 p-8 shadow-sm ring-1 ring-orange-100">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">{copy.guide}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">{meta.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">{meta.description}</p>
          <p className="mt-3 text-sm text-gray-500">{SITE_DESCRIPTION}</p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <article className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">{copy.picks}</h2>
              <div className="mt-5 space-y-4">
                {recommendation.items.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{item.emoji ?? '🍽️'}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="mt-1 text-sm leading-6 text-gray-600">{item.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {recommendation.tip && (
                <p className="mt-4 text-sm text-gray-500">{recommendation.tip}</p>
              )}
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">{copy.why}</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-gray-600">
                {bodyParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">{copy.compare}</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-900">{copy.cookTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-amber-800">{copy.cookBody}</p>
                  <p className="mt-2 text-xs text-amber-700">{copy.faqA2Cook}</p>
                </div>
                <div className="rounded-2xl bg-sky-50 p-4">
                  <p className="text-sm font-semibold text-sky-900">{copy.orderTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-sky-800">{copy.orderBody}</p>
                  <p className="mt-2 text-xs text-sky-700">{copy.faqA2Order}</p>
                </div>
              </div>
            </section>

            {/* FAQ 섹션 — 페이지당 고유 콘텐츠 확보 (AdSense 정책: 충분한 원본 콘텐츠) */}
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">{copy.faqTitle}</h2>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: [
                      { '@type': 'Question', name: `${meta.title}${copy.faqQ1Suffix}`, acceptedAnswer: { '@type': 'Answer', text: copy.faqA1 } },
                      { '@type': 'Question', name: copy.faqQ2, acceptedAnswer: { '@type': 'Answer', text: `${copy.faqA2Cook} ${copy.faqA2Order}` } },
                      { '@type': 'Question', name: copy.faqQ3, acceptedAnswer: { '@type': 'Answer', text: copy.faqA3 } },
                    ],
                  }),
                }}
              />
              <div className="mt-4 space-y-5">
                {[
                  { q: `${meta.title}${copy.faqQ1Suffix}`, a: copy.faqA1 },
                  { q: copy.faqQ2, a: `${copy.faqA2Cook} ${copy.faqA2Order}` },
                  { q: copy.faqQ3, a: copy.faqA3 },
                ].map(({ q, a }) => (
                  <details key={q} className="group rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <summary className="cursor-pointer text-sm font-semibold text-gray-800 list-none flex items-center justify-between gap-2">
                      <span>{q}</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0">▼</span>
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-gray-600">{a}</p>
                  </details>
                ))}
              </div>
            </section>
          </article>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">{copy.youtube}</h2>
              <div className="mt-4 space-y-3">
                {youtubeLinks.map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-2xl border border-gray-100 px-4 py-3 text-sm text-gray-700 transition-colors hover:border-orange-300 hover:text-orange-600"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">{copy.conditions}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">{copy.related}</h2>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {relatedKeywords.map((item) => (
                  <Link
                    key={item.slug}
                    href={localePath(locale, `/eat/menu/${item.slug}`)}
                    className="flex flex-col gap-1 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3 text-xs text-gray-700 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <span className="font-semibold leading-snug">{item[locale].title}</span>
                    <span className="text-gray-400 line-clamp-2 leading-snug">{item[locale].description}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* 오늘의 인기 추천 */}
            <section className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-amber-700">{copy.popularTitle}</p>
              <div className="mt-3 space-y-2">
                {popularMenus.map((menu) => (
                  <Link
                    key={menu.name}
                    href={`${localePath(locale, '/')}?shared=${encodeURIComponent(menu.name)}`}
                    className="flex items-center gap-2 rounded-2xl bg-white border border-amber-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:border-orange-300 hover:text-orange-600"
                  >
                    <span>{menu.emoji ?? '🍽️'}</span>
                    <span className="font-medium">{menu.name}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* 강화된 CTA: 프리셋 필터 전달 */}
            <Link
              href={`${localePath(locale, '/')}?preset=${keyword.slug}`}
              className="block rounded-3xl bg-orange-500 px-6 py-4 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
            >
              🤖 {copy.cta}
            </Link>
          </aside>
        </section>
      </main>
      <SiteFooter
        lang={locale}
        copyright={t('footer.copyright')}
        description={t('footer.description')}
      />
    </div>
  );
}
