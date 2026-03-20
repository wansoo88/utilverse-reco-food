import { ImageResponse } from 'next/og';
import { SEO_KEYWORDS } from '@/data/seoKeywords';
import { LOCALES, type Locale } from '@/config/site';

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
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 48%, #fde68a 100%)',
          padding: '64px',
          color: '#111827',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, fontWeight: 700 }}>
          <span style={{ color: '#f97316' }}>AI MENU PICK</span>
          <span style={{ color: '#6b7280' }}>{locale.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 58, lineHeight: 1.2, fontWeight: 800, maxWidth: '92%' }}>{meta.title}</div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: '#4b5563', maxWidth: '88%' }}>{meta.description}</div>
        </div>
        <div style={{ fontSize: 24, color: '#6b7280' }}>오늘뭐먹지 · utilverse.net</div>
      </div>
    ),
    size,
  );
}
