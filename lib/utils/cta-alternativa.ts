/**
 * CTA alternativa desde CRM (producto.cta_alternativa_*).
 * Ver FRONT_TIENDA_CTA_ALTERNATIVA_PRODUCTO.md
 */

/** Regla mínima: URL + etiqueta de botón presentes */
export function shouldShowCtaAlternativa(
  url: string | null | undefined,
  boton: string | null | undefined
): boolean {
  return Boolean(url?.trim()) && Boolean(boton?.trim())
}

/**
 * Devuelve href seguro para el CTA o null si no es usable (evita javascript:, data:, etc.)
 */
export function getSafeCtaHref(raw: string | null | undefined): string | null {
  if (raw == null || typeof raw !== 'string') return null
  const t = raw.trim()
  if (!t) return null
  const lower = t.toLowerCase()
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return null
  }
  // Protocol-relative URLs (//evil.com)
  if (t.startsWith('//')) return null
  // Ruta relativa interna
  if (t.startsWith('/') && !t.startsWith('//')) return t
  if (t.startsWith('http://') || t.startsWith('https://')) return t
  // Dominio sin esquema (ej. www.marca.com o marca.com/path) — común desde CRM
  if (/[a-zA-Z0-9][\w.-]*\.[a-zA-Z]{2,}/.test(t)) {
    const withHttps = `https://${t}`
    try {
      const u = new URL(withHttps)
      if (u.protocol === 'https:' || u.protocol === 'http:') return u.toString()
    } catch {
      return null
    }
  }
  return null
}

/** Si el enlace debe abrir en nueva pestaña (origen distinto al de la tienda) */
export function isCtaExternalHref(
  href: string,
  siteOrigin?: string
): boolean {
  if (href.startsWith('/')) return false
  try {
    const u = new URL(href)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return true
    if (siteOrigin) {
      return u.origin !== new URL(siteOrigin).origin
    }
    if (typeof window !== 'undefined') {
      return u.origin !== window.location.origin
    }
    return true
  } catch {
    return true
  }
}
