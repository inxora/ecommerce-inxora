import { NextRequest, NextResponse } from 'next/server'

export type LegalPageKey = 'terms' | 'privacy'

const TERMS_FS = 'terminos-y-condiciones'
const PRIVACY_FS = 'politica-de-privacidad'

/** Slug público por locale (lo que ve el usuario en la URL). El filesystem de Next sigue en *_FS. */
const LEGAL: Record<
  LegalPageKey,
  { fsSegment: string; slugs: Record<'es' | 'en' | 'pt', string> }
> = {
  terms: {
    fsSegment: TERMS_FS,
    slugs: {
      es: 'terminos-y-condiciones',
      en: 'terms-and-conditions',
      pt: 'termos-e-condicoes',
    },
  },
  privacy: {
    fsSegment: PRIVACY_FS,
    slugs: {
      es: 'politica-de-privacidad',
      en: 'privacy-policy',
      pt: 'politica-de-privacidade',
    },
  },
}

function normLocale(locale: string): 'es' | 'en' | 'pt' {
  return locale === 'en' || locale === 'pt' ? locale : 'es'
}

/** Slug en la barra de direcciones para el locale actual */
export function getPublicLegalSlug(locale: string, page: LegalPageKey): string {
  return LEGAL[page].slugs[normLocale(locale)]
}

/** Ruta relativa: `/${locale}/${slug}` */
export function legalPageHref(locale: string, page: LegalPageKey): string {
  return `/${locale}/${getPublicLegalSlug(locale, page)}`
}

export function legalPageAbsoluteTienda(locale: string, page: LegalPageKey): string {
  return `https://tienda.inxora.com${legalPageHref(locale, page)}`
}

/**
 * - URL pública en inglés/portugués → rewrite interno al segmento del App Router (es).
 * - Segmento interno con locale en → redirección al slug público (canonical por idioma).
 * - Slug de otro idioma → redirección al slug canónico del locale de la URL.
 */
export function resolveLegalRouteMiddleware(
  request: NextRequest,
  locale: string,
  segment: string
): NextResponse | null {
  const loc = normLocale(locale)

  for (const def of Object.values(LEGAL)) {
    const publicSlug = def.slugs[loc]
    const allSlugs = [def.slugs.es, def.slugs.en, def.slugs.pt]

    // /en/terminos-y-condiciones → /en/terms-and-conditions
    if (segment === def.fsSegment && publicSlug !== def.fsSegment) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/${publicSlug}`
      return NextResponse.redirect(url, 308)
    }

    // /en/terms-and-conditions → serve app/[locale]/terminos-y-condiciones
    if (segment === publicSlug && publicSlug !== def.fsSegment) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/${def.fsSegment}`
      return NextResponse.rewrite(url)
    }

    // /es/privacy-policy o /pt/terms-and-conditions → slug canónico de ese locale
    if (allSlugs.includes(segment) && segment !== publicSlug) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/${publicSlug}`
      return NextResponse.redirect(url, 308)
    }
  }

  return null
}

/** Todos los slugs públicos de páginas legales (para matching en cliente, ej. WhatsApp). */
export const ALL_PUBLIC_LEGAL_SLUGS: string[] = [
  ...Object.values(LEGAL.terms.slugs),
  ...Object.values(LEGAL.privacy.slugs),
]

const LEGACY_SLUGS = ['terminos', 'privacidad'] as const

/** Segmento de URL de términos/privacidad (cualquier idioma, legado o carpeta interna). */
export function isLegalInfoWhatsAppSegment(segment: string): boolean {
  const x = segment.toLowerCase()
  return (
    ALL_PUBLIC_LEGAL_SLUGS.includes(x) ||
    (LEGACY_SLUGS as readonly string[]).includes(x) ||
    x === TERMS_FS ||
    x === PRIVACY_FS
  )
}
