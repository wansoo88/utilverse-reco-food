import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/config/site';
import { ADSENSE_PUB_ID, isAdsenseEnabled } from '@/config/adsense';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: '/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/opengraph-image'],
  },
  other: isAdsenseEnabled() ? {
    'google-adsense-account': ADSENSE_PUB_ID,
  } : {},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={notoSansKr.variable}>
      <body className="font-[family-name:var(--font-body)] text-gray-900 antialiased">
        {children}
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        {isAdsenseEnabled() && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
