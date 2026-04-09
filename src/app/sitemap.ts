import type { MetadataRoute } from 'next';
import { LOCALES, SITE_URL, type Locale } from '@/config/site';
import { SEO_KEYWORDS } from '@/data/seoKeywords';
import { localePath } from '@/lib/localePath';

const STATIC_PAGES = ['/about', '/privacy', '/terms', '/contact'] as const;

/**
 * SEO 사이트맵 전략:
 * 1. 홈페이지 (4개 언어) — priority 1.0
 * 2. SEO 키워드 페이지 (40개+ × 4개 언어) — priority 0.8
 * 3. 정적 페이지 (about/privacy/terms/contact × 4개 언어) — priority 0.5
 *
 * 한국어(ko): URL 접두사 없음 (/ /eat/menu/slug /about ...)
 * 외국어: /en/... /ja/... /zh/...
 */

/** URL 정규화: non-ASCII 퍼센트 인코딩 + trailing slash 제거 (루트 제외) */
function buildUrl(base: string, path: string): string {
  const raw = `${base}${path}`;
  try {
    const u = new URL(raw);
    // 루트(/) 제외하고 trailing slash 제거
    if (u.pathname !== '/' && u.pathname.endsWith('/')) {
      u.pathname = u.pathname.slice(0, -1);
    }
    return u.href;
  } catch {
    return encodeURI(raw);
  }
}

/** 홈페이지 경로 반환 — trailing slash 방지 */
function homePath(locale: string): string {
  return locale === 'ko' ? '' : `/${locale}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // 1. 홈페이지 (4개 언어)
  for (const locale of LOCALES) {
    entries.push({
      url: buildUrl(SITE_URL, homePath(locale)),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, buildUrl(SITE_URL, homePath(l))]),
        ),
      },
    });
  }

  // 2. SEO 키워드 페이지 (프로그래매틱 SEO 핵심)
  for (const keyword of SEO_KEYWORDS) {
    for (const locale of LOCALES) {
      const path = localePath(locale as Locale, `/eat/menu/${keyword.slug}`);
      entries.push({
        url: buildUrl(SITE_URL, path),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [
              l,
              buildUrl(SITE_URL, localePath(l as Locale, `/eat/menu/${keyword.slug}`)),
            ]),
          ),
        },
      });
    }
  }

  // 3. 정적 페이지
  for (const page of STATIC_PAGES) {
    for (const locale of LOCALES) {
      entries.push({
        url: buildUrl(SITE_URL, localePath(locale as Locale, page)),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
