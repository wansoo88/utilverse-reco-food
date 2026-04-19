'use client';
import { useEffect, useRef } from 'react';
import { ADSENSE_PUB_ID, AD_SLOTS, isSlotEnabled } from '@/config/adsense';

/**
 * 본문 중간 광고 — SEO 페이지 본문 사이에 삽입.
 * 슬롯 ID 미설정 시 렌더링 자체를 스킵해 CLS 0 보장.
 * AdSense 승인 후 NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE 설정 시 자동 활성화.
 */
export const InArticleAd = () => {
  const pushed = useRef(false);

  useEffect(() => {
    if (!isSlotEnabled(AD_SLOTS.inArticle) || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense 로드 실패 무시
    }
  }, []);

  if (!isSlotEnabled(AD_SLOTS.inArticle)) return null;

  return (
    <div className="my-6 w-full">
      <p className="text-center text-[10px] text-gray-400 mb-1 tracking-wide">광고</p>
      {/* CLS 방지: in-feed 광고 최소 높이 확보 */}
      <div className="flex justify-center" style={{ minHeight: '250px' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', textAlign: 'center' }}
          data-ad-client={ADSENSE_PUB_ID}
          data-ad-slot={AD_SLOTS.inArticle}
          data-ad-layout="in-article"
          data-ad-format="fluid"
        />
      </div>
    </div>
  );
};
