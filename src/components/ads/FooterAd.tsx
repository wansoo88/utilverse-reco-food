'use client';
import { useEffect, useRef } from 'react';
import { ADSENSE_PUB_ID, AD_SLOTS, isSlotEnabled } from '@/config/adsense';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export const FooterAd = () => {
  const ref = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!isSlotEnabled(AD_SLOTS.footer) || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense 로드 실패 무시
    }
  }, []);

  if (!isSlotEnabled(AD_SLOTS.footer)) return null;

  return (
    <div ref={ref} className="w-full py-4 bg-gray-50">
      <p className="text-center text-[10px] text-gray-400 mb-1 tracking-wide">광고</p>
      {/* CLS 방지: 광고가 로드되기 전에도 90px 높이 미리 확보 */}
      <div className="flex justify-center" style={{ minHeight: '90px' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', maxWidth: '728px', height: '90px' }}
          data-ad-client={ADSENSE_PUB_ID}
          data-ad-slot={AD_SLOTS.footer}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
