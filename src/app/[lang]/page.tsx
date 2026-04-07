import type { Metadata } from 'next';
import { LOCALES, SITE_NAME, SITE_DESCRIPTION, SITE_URL, type Locale } from '@/config/site';
import { localePath } from '@/lib/localePath';
import { HomeClient } from './HomeClient';

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    alternates: {
      canonical: localePath(lang as Locale, '/'),
      languages: Object.fromEntries(LOCALES.map((l) => [l, localePath(l, '/')])),
    },
    openGraph: {
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: `${SITE_URL}${localePath(lang as Locale, '/')}`,
      images: [{ url: '/opengraph-image' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: ['/opengraph-image'],
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function HomePage({ params, searchParams }: Props) {
  const { lang } = await params;
  const sp = await searchParams;
  const preset = typeof sp.preset === 'string' ? sp.preset : undefined;
  const shared = typeof sp.shared === 'string' ? sp.shared : undefined;
  return <HomeClient lang={lang as Locale} preset={preset} shared={shared} />;
}
