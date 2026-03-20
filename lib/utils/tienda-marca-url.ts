/**
 * Detecta URLs internas de la tienda del tipo /[locale]/marca/[slug]
 * para enlazar productos relacionados con la marca del CTA.
 */

const VALID_LOCALES = new Set(['es', 'en', 'pt'])

function getAllowedHosts(siteUrl?: string): string[] {
  const hosts = new Set<string>(['tienda.inxora.com', 'localhost', '127.0.0.1'])
  if (siteUrl) {
    try {
      hosts.add(new URL(siteUrl).hostname.toLowerCase())
    } catch {
      /* ignore */
    }
  }
  return [...hosts]
}

/**
 * Si `raw` es una URL absoluta de la tienda o una ruta relativa `/es/marca/adelsystem`,
 * devuelve el slug de marca. Solo rutas seguras (sin query maliciosa en path).
 */
export function parseMarcaPathFromStoreUrl(
  raw: string | null | undefined,
  siteUrl?: string
): { locale: string; marcaSlug: string } | null {
  if (raw == null || typeof raw !== 'string') return null
  const t = raw.trim()
  if (!t) return null

  let pathname = ''

  if (t.startsWith('/')) {
    pathname = t.split('?')[0].split('#')[0]
  } else if (t.startsWith('http://') || t.startsWith('https://')) {
    try {
      const u = new URL(t)
      const host = u.hostname.toLowerCase()
      const allowed = getAllowedHosts(siteUrl)
      if (!allowed.includes(host)) return null
      pathname = u.pathname
    } catch {
      return null
    }
  } else {
    return null
  }

  const m = pathname.match(/^\/([a-z]{2})\/marca\/([a-z0-9-]+)\/?$/i)
  if (!m) return null

  const loc = m[1].toLowerCase()
  if (!VALID_LOCALES.has(loc)) return null

  const marcaSlug = m[2].toLowerCase()
  if (!marcaSlug) return null

  return { locale: loc, marcaSlug }
}
