import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: ['es', 'en', 'pt'],
  defaultLocale: 'es',
  localePrefix: 'always',
})

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 🚨 REDIRECT SEO: raíz → /es (301)
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/es'
    return NextResponse.redirect(url, 301)
  }

  // Dejar que next-intl maneje el resto
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/',
    '/(es|en|pt)/:path*',
    '/((?!_next|_vercel|api|.*\\..*).*)',
  ],
}
