import type { Metadata } from 'next';
import { LOCALES, SITE_NAME, SITE_DESCRIPTION, type Locale } from '@/config/site';
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
  };
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  return <HomeClient lang={lang as Locale} />;
}
