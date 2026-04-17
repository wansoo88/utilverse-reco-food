// AdSense 설정 — 슬롯 ID는 환경변수로 주입 (코드 변경 없이 승인 후 활성화)
export const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID ?? '';

// 환경변수로 슬롯 ID 주입 — 미설정 시 빈 문자열로 자동 비활성화
export const AD_SLOTS = {
  footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER ?? '',
  inArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE ?? '',
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? '',
} as const;

export type AdSlotName = keyof typeof AD_SLOTS;

export const isAdsenseEnabled = (): boolean => {
  return Boolean(ADSENSE_PUB_ID && ADSENSE_PUB_ID.startsWith('ca-pub-'));
};

/** 광고 슬롯이 설정됐는지 확인 — 빈 슬롯 ID로 ads.push() 방지 */
export const isSlotEnabled = (slot: string): boolean => {
  return isAdsenseEnabled() && slot.length > 0;
};
