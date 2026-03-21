'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FooterAd } from '@/components/ads/FooterAd';
import type { Locale } from '@/config/site';

interface SiteFooterProps {
  lang: Locale;
  copyright: string;
  description: string;
}

export const SiteFooter = ({ lang, copyright, description }: SiteFooterProps) => {
  // FOOTER_COPY 하드코딩 제거 → i18n footer.* 키 사용
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-gray-100 bg-white">
      <FooterAd />
      <div className="max-w-5xl mx-auto px-4 py-6 text-center text-xs text-gray-400">
        <nav className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-500">
          <Link href={`/${lang}/about`} className="transition-colors hover:text-gray-900">{t('about')}</Link>
          <Link href={`/${lang}/privacy`} className="transition-colors hover:text-gray-900">{t('privacy')}</Link>
          <Link href={`/${lang}/terms`} className="transition-colors hover:text-gray-900">{t('terms')}</Link>
          <Link href={`/${lang}/contact`} className="transition-colors hover:text-gray-900">{t('contact')}</Link>
        </nav>
        <p>{copyright}</p>
        <p className="mt-0.5">{description}</p>
      </div>
    </footer>
  );
};
