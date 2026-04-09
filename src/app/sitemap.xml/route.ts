/**
 * 커스텀 sitemap.xml 생성기
 *
 * Next.js 내장 sitemap.ts(MetadataRoute) 대신 raw XML을 직접 출력.
 * - priority: '1.0' 형식 (Next.js 직렬화 시 '1'로 잘못 출력되는 문제 방지)
 * - lastmod: YYYY-MM-DD 형식 (Google 권장)
 * - x-default hreflang 포함 (Google 다국어 필수)
 * - Content-Type: text/xml; charset=utf-8 고정
 */
import { LOCALES, SITE_URL, type Locale } from '@/config/site';
import { SEO_KEYWORDS } from '@/data/seoKeywords';
import { localePath } from '@/lib/localePath';

// 정적 빌드 — NEXT_PUBLIC_SITE_URL 빌드타임 주입
export const dynamic = 'force-static';

const STATIC_PAGES = ['/about', '/privacy', '/terms', '/contact'] as const;

/** URL 정규화: trailing slash 제거 (루트 / 제외) */
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

/** 한국어(기본): 접두사 없음, 외국어: /{lang} */
function homePath(locale: string): string {
  return locale === 'ko' ? '' : `/${locale}`;
}

/** hreflang 블록 생성 */
function hreflang(langs: Record<string, string>): string {
  return Object.entries(langs)
    .map(
      ([lang, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`,
    )
    .join('\n');
}

/** <url> 엔트리 생성 */
function urlBlock(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string,
  langs?: Record<string, string>,
): string {
  const altBlock = langs ? `\n${hreflang(langs)}` : '';
  return (
    `  <url>\n` +
    `    <loc>${loc}</loc>${altBlock}\n` +
    `    <lastmod>${lastmod}</lastmod>\n` +
    `    <changefreq>${changefreq}</changefreq>\n` +
    `    <priority>${priority}</priority>\n` +
    `  </url>`
  );
}

export async function GET(): Promise<Response> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const blocks: string[] = [];

  /* ── 1. 홈페이지 × 4언어 ── */
  const homeLangs: Record<string, string> = {};
  for (const l of LOCALES) {
    homeLangs[l] = buildUrl(homePath(l));
  }
  homeLangs['x-default'] = buildUrl(homePath('ko'));

  for (const locale of LOCALES) {
    blocks.push(
      urlBlock(buildUrl(homePath(locale)), today, 'daily', '1.0', homeLangs),
    );
  }

  /* ── 2. SEO 키워드 페이지 × 4언어 ── */
  for (const keyword of SEO_KEYWORDS) {
    const langs: Record<string, string> = {};
    for (const l of LOCALES) {
      langs[l] = buildUrl(localePath(l as Locale, `/eat/menu/${keyword.slug}`));
    }
    langs['x-default'] = buildUrl(
      localePath('ko', `/eat/menu/${keyword.slug}`),
    );

    for (const locale of LOCALES) {
      blocks.push(
        urlBlock(
          buildUrl(localePath(locale as Locale, `/eat/menu/${keyword.slug}`)),
          today,
          'weekly',
          '0.8',
          langs,
        ),
      );
    }
  }

  /* ── 3. 정적 페이지 × 4언어 ── */
  for (const page of STATIC_PAGES) {
    for (const locale of LOCALES) {
      blocks.push(
        urlBlock(
          buildUrl(localePath(locale as Locale, page)),
          today,
          'monthly',
          '0.5',
        ),
      );
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...blocks,
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
