'use client';

import Link from 'next/link';
import { FooterAd } from '@/components/ads/FooterAd';
import { FOOTER_COPY } from '@/lib/legalContent';
import type { Locale } from '@/config/site';

interface SiteFooterProps {
  lang: Locale;
  copyright: string;
  description: string;
}

export const SiteFooter = ({ lang, copyright, description }: SiteFooterProps) => {
  const links = FOOTER_COPY[lang];

  return (
    <footer className="border-t border-gray-100 bg-white">
      <FooterAd />
      <div className="max-w-5xl mx-auto px-4 py-6 text-center text-xs text-gray-400">
        <nav className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-500">
          <Link href={`/${lang}/about`} className="transition-colors hover:text-gray-900">{links.about}</Link>
          <Link href={`/${lang}/privacy`} className="transition-colors hover:text-gray-900">{links.privacy}</Link>
          <Link href={`/${lang}/terms`} className="transition-colors hover:text-gray-900">{links.terms}</Link>
          <Link href={`/${lang}/contact`} className="transition-colors hover:text-gray-900">{links.contact}</Link>
        </nav>
        <p>{copyright}</p>
        <p className="mt-0.5">{description}</p>
      </div>
    </footer>
  );
};
