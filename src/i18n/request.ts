import { getRequestConfig } from 'next-intl/server';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/config/site';

export default getRequestConfig(async ({ locale }) => {
  const validLocale: Locale = (LOCALES as readonly string[]).includes(locale ?? '')
    ? (locale as Locale)
    : DEFAULT_LOCALE;

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
