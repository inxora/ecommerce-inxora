import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { getPublicLegalSlug, resolveLegalRouteMiddleware } from '@/lib/i18n/legal-routes'

const VALID_LOCALES = ['es', 'en', 'pt'] as const
const DEFAULT_LOCALE = 'es'
const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'

/** 307 = redirect temporal; mejor para geo/prefs que 301 (no “fija” la URL en cachés). */
const REDIRECT_STATUS = 307

const intlMiddleware = createMiddleware({
  locales: VALID_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
})

/** Crawlers habituales: sin georedirección en `/` para indexación estable (canónico /es). */
function isLikelySeoBot(userAgent: string | null): boolean {
  if (!userAgent) return false
  const ua = userAgent.toLowerCase()
  const patterns = [
    'googlebot',
    'google-inspectiontool',
    'googleother',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'embedly',
    'ahrefsbot',
    'semrushbot',
    'gptbot',
    'perplexitybot',
    'bytespider',
  ]
  return patterns.some((p) => ua.includes(p))
}

function getLocaleFromCountry(country: string | null): typeof VALID_LOCALES[number] {
  if (!country) return DEFAULT_LOCALE
  if (country.toUpperCase() === 'BR') return 'pt'
  return DEFAULT_LOCALE
}

function getLocaleFromAcceptLanguage(headerValue: string | null): typeof VALID_LOCALES[number] {
  if (!headerValue) return DEFAULT_LOCALE
  const lower = headerValue.toLowerCase()
  if (lower.includes('pt-br') || lower.includes('pt')) return 'pt'
  if (lower.includes('en')) return 'en'
  if (lower.includes('es')) return 'es'
  return DEFAULT_LOCALE
}

function resolvePreferredLocale(request: NextRequest): typeof VALID_LOCALES[number] {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value
  if (cookieLocale && VALID_LOCALES.includes(cookieLocale as (typeof VALID_LOCALES)[number])) {
    return cookieLocale as (typeof VALID_LOCALES)[number]
  }

  const country =
    request.headers.get('x-vercel-ip-country') ??
    request.headers.get('cf-ipcountry') ??
    request.geo?.country ??
    null

  const localeByCountry = getLocaleFromCountry(country)
  if (localeByCountry !== DEFAULT_LOCALE) return localeByCountry

  return getLocaleFromAcceptLanguage(request.headers.get('accept-language'))
}

/**
 * Solo para la raíz `/`: Brasil → /pt (salvo bots → /es).
 * Cookie y preferencia del usuario siguen primero.
 */
function resolveLocaleForRoot(request: NextRequest): typeof VALID_LOCALES[number] {
  if (isLikelySeoBot(request.headers.get('user-agent'))) {
    return DEFAULT_LOCALE
  }
  return resolvePreferredLocale(request)
}

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
  const pathParts = pathname.split('/').filter(Boolean)
  if (pathParts.length > 0) {
    const firstPart = pathParts[0]
    // Si el primer segmento parece ser un locale pero no es válido, retornar 404
    if (firstPart.startsWith('.') || firstPart.startsWith('_')) {
      return new NextResponse(null, { status: 404 })
    }
  }

  const firstSegment = pathParts[0]
  const hasLocalePrefix = !!firstSegment && VALID_LOCALES.includes(firstSegment as (typeof VALID_LOCALES)[number])

  // ── Legal: slugs localizados (rewrite interno) + canonical por idioma (308)
  if (hasLocalePrefix && pathParts.length === 2 && firstSegment) {
    const legalResponse = resolveLegalRouteMiddleware(request, firstSegment, pathParts[1])
    if (legalResponse) return legalResponse
  }

  // ── URLs antiguas muy cortas → slug público del locale (ej. /en/terminos → /en/terms-and-conditions)
  if (hasLocalePrefix && pathParts.length === 2 && pathParts[1] === 'terminos') {
    const url = request.nextUrl.clone()
    url.pathname = `/${firstSegment}/${getPublicLegalSlug(firstSegment!, 'terms')}`
    return NextResponse.redirect(url, 308)
  }
  if (hasLocalePrefix && pathParts.length === 2 && pathParts[1] === 'privacidad') {
    const url = request.nextUrl.clone()
    url.pathname = `/${firstSegment}/${getPublicLegalSlug(firstSegment!, 'privacy')}`
    return NextResponse.redirect(url, 308)
  }

  // ── Raíz: georedirección BR→/pt (307), bots→/es; cookie > país > Accept-Language
  if (pathname === '/') {
    const locale = resolveLocaleForRoot(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}`
    const response = NextResponse.redirect(url, REDIRECT_STATUS)
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    })
    return response
  }

  // ── Ruta sin prefijo de locale (ej. /catalogo): siempre locale canónico por defecto, sin geo (SEO estable)
  if (!hasLocalePrefix) {
    const url = request.nextUrl.clone()
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`
    return NextResponse.redirect(url, REDIRECT_STATUS)
  }

  // Dejar que next-intl maneje rutas localizadas y persistir elección manual.
  const response = intlMiddleware(request)
  response.cookies.set(LOCALE_COOKIE_NAME, firstSegment!, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })
  return response
}

export const config = {
  matcher: [
    '/',
    '/(es|en|pt)/:path*',
    '/((?!_next|_vercel|api|\\.well-known|.*\\..*).*)',
  ],
}
