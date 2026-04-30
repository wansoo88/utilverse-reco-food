import { LOCALES, SITE_URL, type Locale } from '@/config/site';
import { SEO_KEYWORDS } from '@/data/seoKeywords';
import { localePath } from '@/lib/localePath';

const STATIC_PAGES = ['/about', '/privacy', '/terms', '/contact'] as const;

export const dynamic = 'force-static';
export const revalidate = 3600;

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

function homePath(locale: string): string {
  return locale === 'ko' ? '' : `/${locale}`;
}

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface UrlEntry {
  loc: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: number;
  alternates: Record<string, string>;
}

function renderEntry(e: UrlEntry): string {
  const lines = ['  <url>', `    <loc>${xmlEscape(e.loc)}</loc>`];
  for (const [hreflang, href] of Object.entries(e.alternates)) {
    lines.push(
      `    <xhtml:link rel="alternate" hreflang="${xmlEscape(hreflang)}" href="${xmlEscape(href)}" />`,
    );
  }
  lines.push(`    <lastmod>${e.lastmod}</lastmod>`);
  lines.push(`    <changefreq>${e.changefreq}</changefreq>`);
  lines.push(`    <priority>${e.priority.toFixed(1)}</priority>`);
  lines.push('  </url>');
  return lines.join('\n');
}

function buildAlternates(pathFn: (l: Locale) => string): Record<string, string> {
  const langs: Record<string, string> = {};
  for (const l of LOCALES) langs[l] = buildUrl(pathFn(l));
  langs['x-default'] = buildUrl(pathFn('ko'));
  return langs;
}

export function GET(): Response {
  const today = new Date().toISOString().split('T')[0];
  const entries: UrlEntry[] = [];

  // 1. 홈 × 4언어
  const homeAlts = buildAlternates((l) => homePath(l));
  for (const locale of LOCALES) {
    entries.push({
      loc: buildUrl(homePath(locale)),
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0,
      alternates: homeAlts,
    });
  }

  // 2. SEO 키워드 페이지 × 4언어
  for (const keyword of SEO_KEYWORDS) {
    const alts = buildAlternates((l) => localePath(l, `/eat/menu/${keyword.slug}`));
    for (const locale of LOCALES) {
      entries.push({
        loc: buildUrl(localePath(locale as Locale, `/eat/menu/${keyword.slug}`)),
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.8,
        alternates: alts,
      });
    }
  }

  // 3. 정적 페이지 × 4언어
  for (const page of STATIC_PAGES) {
    const alts = buildAlternates((l) => localePath(l, page));
    for (const locale of LOCALES) {
      entries.push({
        loc: buildUrl(localePath(locale as Locale, page)),
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.5,
        alternates: alts,
      });
    }
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    entries.map(renderEntry).join('\n') +
    '\n</urlset>\n';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
