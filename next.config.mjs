import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 성능: 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withNextIntl(nextConfig);
