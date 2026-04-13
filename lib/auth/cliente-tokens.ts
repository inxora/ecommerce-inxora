import type { ClienteInfo } from '@/lib/api/cliente-api'

export const CLIENTE_TOKEN_KEY = 'inxora_cliente_token'
export const CLIENTE_REFRESH_KEY = 'inxora_cliente_refresh_token'
export const CLIENTE_DATA_KEY = 'inxora_cliente_data'

export function getClienteAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(CLIENTE_TOKEN_KEY)
}

export function getClienteRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(CLIENTE_REFRESH_KEY)
}

/** Guarda access + refresh + datos de cliente (login / registro con sesión). */
export function setClienteSession(access: string, refresh: string | null, cliente: ClienteInfo) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CLIENTE_TOKEN_KEY, access)
  if (refresh) localStorage.setItem(CLIENTE_REFRESH_KEY, refresh)
  else localStorage.removeItem(CLIENTE_REFRESH_KEY)
  localStorage.setItem(CLIENTE_DATA_KEY, JSON.stringify(cliente))
}

/** Solo rota tokens tras POST /api/auth/cliente/refresh (misma sesión, mismo cliente en DATA_KEY). */
export function setClienteAccessAndRefresh(access: string, refresh: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CLIENTE_TOKEN_KEY, access)
  localStorage.setItem(CLIENTE_REFRESH_KEY, refresh)
}

export function clearClienteSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CLIENTE_TOKEN_KEY)
  localStorage.removeItem(CLIENTE_REFRESH_KEY)
  localStorage.removeItem(CLIENTE_DATA_KEY)
}

/**
 * Comprueba si un JWT está expirado (o malformado → se trata como expirado).
 * Usa Base64url decoding correcto (reemplaza - y _ antes de atob).
 */
export function isClienteTokenExpired(token?: string | null): boolean {
  if (!token) return true
  try {
    const raw = token.split('.')[1]
    if (!raw) return true
    const base64 = raw.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(atob(base64)) as { exp?: number }
    if (!decoded.exp) return false
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export function readClienteSession(): {
  token: string
  refreshToken: string | null
  cliente: ClienteInfo
} | null {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem(CLIENTE_TOKEN_KEY)
  const data = localStorage.getItem(CLIENTE_DATA_KEY)
  if (!token || !data) return null
  try {
    const cliente = JSON.parse(data) as ClienteInfo
    return {
      token,
      refreshToken: localStorage.getItem(CLIENTE_REFRESH_KEY),
      cliente,
    }
  } catch {
    return null
  }
}
