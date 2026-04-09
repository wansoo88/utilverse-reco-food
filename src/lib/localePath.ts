import { DEFAULT_LOCALE, type Locale } from '@/config/site';

/**
 * 로케일에 맞는 URL 경로 반환
 * - 기본 로케일(ko): path 그대로 (접두사 없음)
 * - 외국어: /{lang}{path}
 *
 * 예: localePath('ko', '/about') → '/about'
 *     localePath('en', '/about') → '/en/about'
 */
export function localePath(lang: Locale, path: string): string {
  if (lang === DEFAULT_LOCALE) return path;
  const combined = `/${lang}${path}`;
  // trailing slash 방지: /en/ → /en (루트 경로에서 발생)
  return combined.length > 1 && combined.endsWith('/') ? combined.slice(0, -1) : combined;
}

/**
 * 현재 pathname에서 언어 세그먼트를 교체한 새 pathname 반환
 * LanguageSelector 등에서 사용
 */
export function switchLocalePath(
  currentPathname: string,
  targetLang: Locale,
  allLocales: readonly Locale[],
): string {
  const localeSet = new Set<string>(allLocales);
  const segments = currentPathname.split('/').filter(Boolean);

  // 첫 세그먼트가 로케일이면 제거
  if (segments.length > 0 && localeSet.has(segments[0])) {
    segments.shift();
  }

  // 기본 로케일(ko)이면 접두사 없이, 아니면 앞에 추가
  if (targetLang !== DEFAULT_LOCALE) {
    segments.unshift(targetLang);
  }

  return '/' + segments.join('/');
}
