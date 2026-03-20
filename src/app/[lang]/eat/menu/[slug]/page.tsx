import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BUDGET_KEYWORDS, HOUSE_KEYWORDS, VIBE_KEYWORDS } from '@/data/filterKeywords';
import { SEO_KEYWORDS } from '@/data/seoKeywords';
import { SiteFooter } from '@/components/ui/SiteFooter';
import { getSeoRecommendation } from '@/lib/seoRecommendationCache';
import { buildYoutubeRecipeLinks } from '@/lib/youtubeRecipes';
import { LOCALES, SITE_DESCRIPTION, SITE_NAME, SITE_URL, type Locale } from '@/config/site';
import { getTranslations } from 'next-intl/server';

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
}> = {
  ko: {
    home: '홈',
    guide: 'AI 메뉴 가이드',
    picks: '추천 메뉴',
    conditions: '추천 조건',
    related: '관련 키워드',
    youtube: '유튜브 레시피',
    why: '왜 이 메뉴가 잘 맞을까',
    compare: '해먹기와 시켜먹기 관점',
    direct: '이 페이지는 특정 상황에서 바로 고를 수 있는 메뉴를 빠르게 정리한 가이드입니다.',
    cta: '직접 추천받기',
  },
  en: {
    home: 'Home',
    guide: 'AI Menu Guide',
    picks: 'Recommended Menus',
    conditions: 'Recommendation Filters',
    related: 'Related Keywords',
    youtube: 'YouTube Recipes',
    why: 'Why this works',
    compare: 'Cook vs order angle',
    direct: 'This page is designed to help people narrow down a practical food choice for a specific situation.',
    cta: 'Get a live recommendation',
  },
  ja: {
    home: 'ホーム',
    guide: 'AIメニューガイド',
    picks: 'おすすめメニュー',
    conditions: 'おすすめ条件',
    related: '関連キーワード',
    youtube: 'YouTubeレシピ',
    why: 'このメニューが合う理由',
    compare: '自炊とデリバリーの視点',
    direct: 'このページは、特定の状況で選びやすいメニュー候補を素早く整理するためのガイドです。',
    cta: '直接おすすめを受ける',
  },
  zh: {
    home: '首页',
    guide: 'AI菜单指南',
    picks: '推荐菜单',
    conditions: '推荐条件',
    related: '相关关键词',
    youtube: 'YouTube食谱',
    why: '为什么适合这个场景',
    compare: '自己做和外卖的角度',
    direct: '这个页面用于在特定场景下快速缩小可选菜单范围，帮助用户更快做决定。',
    cta: '直接获取推荐',
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
  const path = `/${locale}/eat/menu/${keyword.slug}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(LOCALES.map((item) => [item, `/${item}/eat/menu/${keyword.slug}`])),
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
  const relatedKeywords = SEO_KEYWORDS.filter((item) => item.slug !== keyword.slug).slice(0, 4);
  const youtubeLinks = buildYoutubeRecipeLinks(recommendation.items, locale);
  const canonicalUrl = `${SITE_URL}/${locale}/eat/menu/${keyword.slug}`;
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
          <Link href={`/${locale}`} className="hover:text-gray-900">{copy.home}</Link>
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
                  <p className="text-sm font-semibold text-amber-900">Cook</p>
                  <p className="mt-2 text-sm leading-6 text-amber-800">직접 만들면 비용 통제와 재료 조정이 쉽고, 취향에 맞춰 세부 구성을 바꾸기 좋습니다.</p>
                </div>
                <div className="rounded-2xl bg-sky-50 p-4">
                  <p className="text-sm font-semibold text-sky-900">Order</p>
                  <p className="mt-2 text-sm leading-6 text-sky-800">배달이나 외식은 시간 절약이 크고 실패 확률이 낮아, 피곤하거나 빠른 결정을 원할 때 유리합니다.</p>
                </div>
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
              <div className="mt-4 space-y-3">
                {relatedKeywords.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${locale}/eat/menu/${item.slug}`}
                    className="block rounded-2xl border border-gray-100 px-4 py-3 text-sm text-gray-700 transition-colors hover:border-orange-300 hover:text-orange-600"
                  >
                    {item[locale].title}
                  </Link>
                ))}
              </div>
            </section>

            <Link
              href={`/${locale}`}
              className="block rounded-3xl bg-orange-500 px-6 py-4 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
            >
              {copy.cta}
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
