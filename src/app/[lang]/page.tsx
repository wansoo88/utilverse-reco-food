import type { Metadata } from 'next';
import { LOCALES, SITE_NAME, SITE_DESCRIPTION, SITE_URL, type Locale } from '@/config/site';
import { HomeClient } from './HomeClient';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    alternates: {
      canonical: `/${lang}`,
    },
    openGraph: {
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: `${SITE_URL}/${lang}`,
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

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  return <HomeClient lang={lang as Locale} />;
}
