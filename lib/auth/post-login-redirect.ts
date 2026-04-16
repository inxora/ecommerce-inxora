/**
 * Destino tras login/registro cuando no hay `redirect` explícito en la URL.
 * Flujos con `?redirect=...` (checkout, cuenta, etc.) se respetan.
 */
export function resolvePostLoginRedirect(locale: string, redirectParam: string | null): string {
  const defaultChatSara = `/${locale}/cuenta/chat-sara`
  const raw = (redirectParam ?? '').trim()
  if (raw === '' || raw === '/' || raw === `/${locale}`) return defaultChatSara
  if (raw === 'checkout') return `/${locale}/checkout`
  if (raw.startsWith('/')) return raw
  return defaultChatSara
}
