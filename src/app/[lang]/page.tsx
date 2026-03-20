import { useTranslations } from 'next-intl';
import { SITE_NAME } from '@/config/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: SITE_NAME,
};

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <p className="mt-4 text-gray-600">{t('subtitle')}</p>
    </main>
  );
}
