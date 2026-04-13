import {
  clearClienteSession,
  getClienteRefreshToken,
  setClienteAccessAndRefresh,
} from '@/lib/auth/cliente-tokens'

const getApiBaseUrl = () => {
  const configured = process.env.NEXT_PUBLIC_API_URL ?? ''
  if (configured) return configured
  return typeof window !== 'undefined' ? '' : 'https://api.inxora.com'
}

let refreshPromise: Promise<boolean> | null = null

/**
 * Renueva access + refresh con POST /api/auth/cliente/refresh.
 * Rotación: guardar siempre el nuevo refresh_token que devuelve el servidor.
 */
export async function refreshClienteTokens(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

async function doRefresh(): Promise<boolean> {
  const rt = getClienteRefreshToken()
  if (!rt) return false

  const base = getApiBaseUrl()
  const url = `${base}/api/auth/cliente/refresh`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ refresh_token: rt }),
      credentials: 'omit',
    })

    const text = await res.text()

    if (!res.ok) {
      clearClienteSession()
      window.dispatchEvent(new CustomEvent('inxora-cliente-session-ended'))
      return false
    }

    let data: { success?: boolean; token?: string; refresh_token?: string }
    try {
      data = JSON.parse(text) as { success?: boolean; token?: string; refresh_token?: string }
    } catch {
      return false
    }

    if (!data.token || !data.refresh_token) {
      return false
    }

    setClienteAccessAndRefresh(data.token, data.refresh_token)
    window.dispatchEvent(
      new CustomEvent('inxora-cliente-tokens-refreshed', {
        detail: { token: data.token, refresh_token: data.refresh_token },
      })
    )
    return true
  } catch {
    return false
  }
}
