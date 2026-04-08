import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // utilverse.info 도메인 루트 배포 — basePath 없음
  // 성능: 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // sitemap/robots에서 Next.js 내부 Vary 헤더 제거 — Google 크롤러 호환성
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Vary', value: 'Accept-Encoding' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          { key: 'Vary', value: 'Accept-Encoding' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
