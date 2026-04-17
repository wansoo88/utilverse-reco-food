import { ADSENSE_PUB_ID, isAdsenseEnabled } from '@/config/adsense';

// 동적 ads.txt — NEXT_PUBLIC_ADSENSE_PUB_ID 환경변수에서 자동 생성
// AdSense 크롤러가 매번 최신 pub ID를 확인하도록 보장 (정적 placeholder 방지)
export const dynamic = 'force-static';

export function GET() {
  // pub ID 미설정 시 빈 ads.txt 반환 (404 대신 200으로 응답해 크롤러 혼란 방지)
  const body = isAdsenseEnabled()
    ? `google.com, ${ADSENSE_PUB_ID.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`
    : '# ads.txt — set NEXT_PUBLIC_ADSENSE_PUB_ID to activate\n';

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
