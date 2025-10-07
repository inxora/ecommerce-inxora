import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['es', 'en', 'pt'],

  // Used when no locale matches
  defaultLocale: 'es',

  // Always use locale prefix
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(es|en|pt)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};