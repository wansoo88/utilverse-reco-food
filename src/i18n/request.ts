import { getRequestConfig } from 'next-intl/server';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/config/site';

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl v4: requestLocale is a Promise resolved from URL segment
  const requested = await requestLocale;
  const validLocale: Locale = (LOCALES as readonly string[]).includes(requested ?? '')
    ? (requested as Locale)
    : DEFAULT_LOCALE;

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
