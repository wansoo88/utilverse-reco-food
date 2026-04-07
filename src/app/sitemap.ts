import type { MetadataRoute } from 'next';
import { LOCALES, SITE_URL, type Locale } from '@/config/site';
import { SEO_KEYWORDS } from '@/data/seoKeywords';
import { localePath } from '@/lib/localePath';

const STATIC_PAGES = ['/about', '/privacy', '/terms', '/contact'] as const;

/**
 * SEO 사이트맵 전략:
 * 1. 홈페이지 (4개 언어) — priority 1.0
 * 2. SEO 키워드 페이지 (30개+ × 4개 언어) — priority 0.8
 * 3. 정적 페이지 (about/privacy/terms/contact × 4개 언어) — priority 0.5
 *
 * 한국어(ko): URL 접두사 없음 (/ /eat/menu/slug /about ...)
 * 외국어: /en/... /ja/... /zh/...
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // 1. 홈페이지
  for (const locale of LOCALES) {
    const path = localePath(locale, '/');
    entries.push({
      url: `${SITE_URL}${path === '/' ? '' : path}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => {
            const lPath = localePath(l, '/');
            return [l, `${SITE_URL}${lPath === '/' ? '' : lPath}`];
          }),
        ),
      },
    });
  }

  // 2. SEO 키워드 페이지 (프로그래매틱 SEO 핵심)
  for (const keyword of SEO_KEYWORDS) {
    for (const locale of LOCALES) {
      const path = localePath(locale, `/eat/menu/${keyword.slug}`);
      entries.push({
        url: `${SITE_URL}${path}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}${localePath(l, `/eat/menu/${keyword.slug}`)}`]),
          ),
        },
      });
    }
  }

  // 3. 정적 페이지
  for (const page of STATIC_PAGES) {
    for (const locale of LOCALES) {
      const path = localePath(locale, page);
      entries.push({
        url: `${SITE_URL}${path}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
