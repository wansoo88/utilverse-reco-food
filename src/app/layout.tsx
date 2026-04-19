import type { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/config/site';
import { ADSENSE_PUB_ID, isAdsenseEnabled } from '@/config/adsense';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { WebVitalsReporter } from '@/components/analytics/WebVitalsReporter';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
  preload: true,
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
    <html suppressHydrationWarning className={notoSansKR.variable}>
      <head>
        {/* Consent Mode v2 기본값 — GA/AdSense 로드 전에 반드시 실행 (EU 정책 준수) */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'granted',
              wait_for_update: 500,
              region: ['EU', 'EEA', 'GB', 'CH']
            });
            gtag('consent', 'default', {
              ad_storage: 'granted',
              ad_user_data: 'granted',
              ad_personalization: 'granted',
              analytics_storage: 'granted'
            });
          `}
        </Script>
      </head>
      <body className="text-gray-900 antialiased font-sans">
        {children}
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <WebVitalsReporter />
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
