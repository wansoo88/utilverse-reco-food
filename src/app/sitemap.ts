import type { MetadataRoute } from 'next';
import { LOCALES, SITE_URL, type Locale } from '@/config/site';
import { SEO_KEYWORDS } from '@/data/seoKeywords';
import { localePath } from '@/lib/localePath';

const STATIC_PAGES = ['/about', '/privacy', '/terms', '/contact'] as const;

/** URL 정규화 — 퍼센트 인코딩 + trailing slash 제거 (루트 제외) */
function buildUrl(path: string): string {
  const raw = `${SITE_URL}${path}`;
  try {
    const u = new URL(raw);
    if (u.pathname !== '/' && u.pathname.endsWith('/')) {
      u.pathname = u.pathname.slice(0, -1);
    }
    return u.href;
  } catch {
    return encodeURI(raw);
  }
}

/** 홈 경로 — ko는 접두사 없음, 외국어는 /{lang} */
function homePath(locale: string): string {
  return locale === 'ko' ? '' : `/${locale}`;
}

// 사이트맵 lastmod — 빌드 시점에 한 번 평가되어 모든 요청이 동일한 값을 받음
// (런타임 new Date()를 매번 호출하면 Google이 매일 변경된 것으로 오인 → 크롤 예산 낭비)
const BUILD_LASTMOD = new Date().toISOString().split('T')[0];

export default function sitemap(): MetadataRoute.Sitemap {
  const today = BUILD_LASTMOD;
  const entries: MetadataRoute.Sitemap = [];

  // 1. 홈페이지 × 4언어
  const homeLangs: Record<string, string> = {};
  for (const l of LOCALES) {
    homeLangs[l] = buildUrl(homePath(l));
  }
  homeLangs['x-default'] = buildUrl(homePath('ko'));

  for (const locale of LOCALES) {
    entries.push({
      url: buildUrl(homePath(locale)),
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: { languages: homeLangs },
    });
  }

  // 2. SEO 키워드 페이지 × 4언어
  for (const keyword of SEO_KEYWORDS) {
    const langs: Record<string, string> = {};
    for (const l of LOCALES) {
      langs[l] = buildUrl(localePath(l as Locale, `/eat/menu/${keyword.slug}`));
    }
    langs['x-default'] = buildUrl(localePath('ko', `/eat/menu/${keyword.slug}`));

    for (const locale of LOCALES) {
      entries.push({
        url: buildUrl(localePath(locale as Locale, `/eat/menu/${keyword.slug}`)),
        lastModified: today,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: { languages: langs },
      });
    }
  }

  // 3. 정적 페이지 × 4언어
  for (const page of STATIC_PAGES) {
    for (const locale of LOCALES) {
      entries.push({
        url: buildUrl(localePath(locale as Locale, page)),
        lastModified: today,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
