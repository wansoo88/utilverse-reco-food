// AdSense 설정 — 슬롯 ID를 컴포넌트에 직접 하드코딩 금지
export const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID ?? '';

export const AD_SLOTS = {
  footer: '', // 에드센스 승인 후 슬롯 ID 입력
} as const;

export const isAdsenseEnabled = (): boolean => {
  return Boolean(ADSENSE_PUB_ID && ADSENSE_PUB_ID.startsWith('ca-pub-'));
};
