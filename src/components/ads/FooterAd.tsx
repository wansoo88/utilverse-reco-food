'use client';
import { useEffect, useRef } from 'react';
import { ADSENSE_PUB_ID, AD_SLOTS, isAdsenseEnabled } from '@/config/adsense';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export const FooterAd = () => {
  const ref = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!isAdsenseEnabled() || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense 로드 실패 무시
    }
  }, []);

  if (!isAdsenseEnabled()) return null;

  return (
    <div ref={ref} className="w-full flex justify-center py-4 min-h-[90px] bg-gray-50">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', maxWidth: '728px', height: '90px' }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={AD_SLOTS.footer}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
};
