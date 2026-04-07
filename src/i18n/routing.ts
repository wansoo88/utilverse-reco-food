import { defineRouting } from 'next-intl/routing';
import { LOCALES, DEFAULT_LOCALE } from '@/config/site';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  // 기본 로케일(ko)은 URL 접두사 없음: / = 한국어, /en = 영어, /ja = 일본어, /zh = 중국어
  localePrefix: 'as-needed',
  // Accept-Language 자동감지는 middleware에서 직접 처리 (unsupported → en 폴백)
  localeDetection: false,
});
