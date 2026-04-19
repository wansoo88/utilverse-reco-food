import { ImageResponse } from 'next/og';
import { SEO_KEYWORDS } from '@/data/seoKeywords';
import { LOCALES, SITE_NAME, SITE_URL, type Locale } from '@/config/site';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

const getLocale = (lang: string): Locale => (
  (LOCALES as readonly string[]).includes(lang) ? (lang as Locale) : 'ko'
);

export default async function OgImage({ params }: Props) {
  const { lang, slug } = await params;
  const locale = getLocale(lang);
  const keyword = SEO_KEYWORDS.find((item) => item.slug === slug) ?? SEO_KEYWORDS[0];
  const meta = keyword[locale];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #fef6f1 0%, #ffffff 48%, #faedcb 100%)',
          padding: '64px',
          color: '#1a1a19',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, fontWeight: 700, letterSpacing: '0.04em' }}>
          <span style={{ color: '#dc5f2f' }}>AI MENU PICK</span>
          <span style={{ color: '#75736a' }}>{locale.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 58, lineHeight: 1.2, fontWeight: 800, maxWidth: '92%', letterSpacing: '-0.02em' }}>{meta.title}</div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: '#3f3e3b', maxWidth: '88%' }}>{meta.description}</div>
        </div>
        <div style={{ fontSize: 24, color: '#75736a' }}>{SITE_NAME} · {new URL(SITE_URL).host}</div>
      </div>
    ),
    size,
  );
}
