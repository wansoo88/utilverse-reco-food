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
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
