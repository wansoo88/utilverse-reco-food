'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FooterAd } from '@/components/ads/FooterAd';
import type { Locale } from '@/config/site';
import { localePath } from '@/lib/localePath';

interface SiteFooterProps {
  lang: Locale;
  copyright: string;
  description: string;
}

export const SiteFooter = ({ lang, copyright, description }: SiteFooterProps) => {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-gray-100 bg-white">
      <FooterAd />
      <div className="max-w-5xl mx-auto px-4 py-6 text-center text-xs text-gray-400">
        <nav className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-500">
          <Link href={localePath(lang, '/about')} className="transition-colors hover:text-gray-900">{t('about')}</Link>
          <Link href={localePath(lang, '/privacy')} className="transition-colors hover:text-gray-900">{t('privacy')}</Link>
          <Link href={localePath(lang, '/terms')} className="transition-colors hover:text-gray-900">{t('terms')}</Link>
          <Link href={localePath(lang, '/contact')} className="transition-colors hover:text-gray-900">{t('contact')}</Link>
        </nav>
        <p>{copyright}</p>
        <p className="mt-0.5">{description}</p>
      </div>
    </footer>
  );
};
