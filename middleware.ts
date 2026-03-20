import createMiddleware from 'next-intl/middleware';
import { LOCALES, DEFAULT_LOCALE } from './src/config/site';

export default createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
