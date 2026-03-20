export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://utilverse.net';
export const SITE_NAME = '오늘뭐먹지';
export const SITE_DESCRIPTION = 'AI가 추천하는 오늘의 메뉴 — 가구 유형, 상황, 예산에 맞춰 딱 맞는 음식을 추천해드려요';
export const LOCALES = ['ko', 'en', 'ja', 'zh'] as const;
export const DEFAULT_LOCALE = 'ko' as const;
export type Locale = (typeof LOCALES)[number];
