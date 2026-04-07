import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/config/site';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const validLocale: Locale = (LOCALES as readonly string[]).includes(requested ?? '')
    ? (requested as Locale)
    : DEFAULT_LOCALE;

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});

// routing 재-export (next-intl 플러그인이 참조)
export { routing };
