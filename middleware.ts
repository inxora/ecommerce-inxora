import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: ['es', 'en', 'pt'],
  defaultLocale: 'es',
  localePrefix: 'always',
})

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignorar rutas especiales que no deben ser procesadas por next-intl
  // Esto incluye .well-known, archivos estáticos, y rutas del sistema
  if (pathname.startsWith('/.well-known') || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api') ||
      pathname.startsWith('/_vercel') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/robots') ||
      pathname.startsWith('/sitemap') ||
      pathname.startsWith('/manifest') ||
      pathname.includes('.') && !pathname.match(/^\/(es|en|pt)\//)) {
    // Retornar 404 directamente para rutas especiales que no existen
    if (pathname.startsWith('/.well-known') && !pathname.includes('apple-app-site-association')) {
      return new NextResponse(null, { status: 404 })
    }
    return NextResponse.next()
  }

  // Validar que si la ruta empieza con locale, el locale sea válido
  const validLocales = ['es', 'en', 'pt']
  const pathParts = pathname.split('/').filter(Boolean)
  if (pathParts.length > 0) {
    const firstPart = pathParts[0]
    // Si el primer segmento parece ser un locale pero no es válido, retornar 404
    if (firstPart.startsWith('.') || firstPart.startsWith('_')) {
      return new NextResponse(null, { status: 404 })
    }
  }

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
    '/((?!_next|_vercel|api|\\.well-known|.*\\..*).*)',
  ],
}
