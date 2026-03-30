export type ChatSaraSection = 'chat' | 'pedidos' | 'cotizaciones'

export function getChatSaraBasePath(locale: string): string {
  return `/${locale}/cuenta/chat-sara`
}

export function getChatSaraPedidosPath(locale: string): string {
  return `/${locale}/cuenta/chat-sara/pedidos`
}

export function getChatSaraCotizacionesPath(locale: string): string {
  return `/${locale}/cuenta/chat-sara/cotizaciones`
}

export function getChatSaraHrefForSection(locale: string, section: ChatSaraSection): string {
  if (section === 'pedidos') return getChatSaraPedidosPath(locale)
  if (section === 'cotizaciones') return getChatSaraCotizacionesPath(locale)
  return getChatSaraBasePath(locale)
}

/** Deriva la sección activa desde el pathname de la app (incluye el segmento [locale]). */
export function getChatSaraSectionFromPathname(pathname: string | null | undefined): ChatSaraSection {
  if (!pathname) return 'chat'
  if (pathname.includes('/cuenta/chat-sara/pedidos')) return 'pedidos'
  if (pathname.includes('/cuenta/chat-sara/cotizaciones')) return 'cotizaciones'
  return 'chat'
}
