'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ClienteInfo } from '@/lib/api/cliente-api'
import { clienteApi } from '@/lib/api/cliente-api'
import { refreshClienteTokens } from '@/lib/api/cliente-refresh'
import { ApiError } from '@/lib/api/client'
import {
  clearClienteSession,
  getClienteAccessToken,
  readClienteSession,
  setClienteSession,
} from '@/lib/auth/cliente-tokens'

function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1]
    if (!payload) return true
    const decoded = JSON.parse(atob(payload)) as { exp?: number }
    if (!decoded.exp) return false
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

type ClienteAuthContextValue = {
  token: string | null
  cliente: ClienteInfo | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (correo: string, password: string) => Promise<void>
  /** Llama al API de logout, luego limpia storage local (access + refresh + datos). */
  logout: () => Promise<void>
  register: (payload: {
    nombre: string
    apellidos: string
    documento_personal: string
    correo: string
    telefono?: string
    password: string
    id_pais?: number
    id_rubro?: number
    acepta_terminos?: boolean
  }) => Promise<void>
  resetPassword: (correo: string, nueva_contrasena: string) => Promise<void>
  error: string | null
  clearError: () => void
}

const ClienteAuthContext = createContext<ClienteAuthContextValue | null>(null)

export function ClienteAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [cliente, setCliente] = useState<ClienteInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const logout = useCallback(async () => {
    const access = getClienteAccessToken()?.trim() || token?.trim()
    if (access) {
      try {
        await clienteApi.logout(access)
      } catch {
        /* Aun así limpiar sesión local */
      }
    }
    clearClienteSession()
    setToken(null)
    setCliente(null)
    setError(null)
  }, [token])

  const loadStored = useCallback(async () => {
    const stored = readClienteSession()
    if (!stored) {
      setToken(null)
      setCliente(null)
      setIsLoading(false)
      return
    }

    if (!isTokenExpired(stored.token)) {
      setToken(stored.token)
      setCliente(stored.cliente)
      setIsLoading(false)
      return
    }

    // Access expirado: intentar renovar con refresh_token (silencioso)
    if (stored.refreshToken) {
      const ok = await refreshClienteTokens()
      if (ok) {
        const after = readClienteSession()
        if (after) {
          setToken(after.token)
          setCliente(after.cliente)
          setIsLoading(false)
          return
        }
      }
    }

    clearClienteSession()
    setToken(null)
    setCliente(null)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadStored()
  }, [loadStored])

  useEffect(() => {
    const onTokensRefreshed = (e: Event) => {
      const t = (e as CustomEvent<{ token?: string }>).detail?.token
      if (t) setToken(t)
    }
    const onSessionEnded = () => {
      setToken(null)
      setCliente(null)
      setError(null)
      if (typeof window === 'undefined') return
      const path = window.location.pathname
      if (/\/cuenta\b/.test(path)) {
        const seg = path.split('/').filter(Boolean)[0]
        const loc = ['es', 'en', 'pt'].includes(seg) ? seg : 'es'
        window.location.assign(`/${loc}/login`)
      }
    }
    window.addEventListener('inxora-cliente-tokens-refreshed', onTokensRefreshed)
    window.addEventListener('inxora-cliente-session-ended', onSessionEnded)
    return () => {
      window.removeEventListener('inxora-cliente-tokens-refreshed', onTokensRefreshed)
      window.removeEventListener('inxora-cliente-session-ended', onSessionEnded)
    }
  }, [])

  const login = useCallback(async (correo: string, password: string) => {
    setError(null)
    try {
      const res = await clienteApi.login({ correo: correo.trim().toLowerCase(), password })
      if (!res.token || !res.cliente) throw new Error('Respuesta inválida')
      setClienteSession(res.token, res.refresh_token ?? null, res.cliente)
      setToken(res.token)
      setCliente(res.cliente)
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Error al iniciar sesión'
      setError(msg)
      throw e
    }
  }, [])

  const register = useCallback(async (payload: {
    nombre: string
    apellidos: string
    documento_personal: string
    correo: string
    telefono?: string
    password: string
    id_pais?: number
    id_rubro?: number
    acepta_terminos?: boolean
  }) => {
    setError(null)
    try {
      await clienteApi.registro({
        nombre: payload.nombre.trim(),
        apellidos: payload.apellidos.trim(),
        documento_personal: payload.documento_personal.trim(),
        correo: payload.correo.trim().toLowerCase(),
        telefono: payload.telefono?.trim(),
        password: payload.password,
        id_pais: payload.id_pais ?? 1,
        id_rubro: payload.id_rubro,
        acepta_terminos: payload.acepta_terminos,
      })
      await login(payload.correo, payload.password)
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Error al registrarse'
      setError(msg)
      throw e
    }
  }, [login])

  const resetPassword = useCallback(async (correo: string, nueva_contrasena: string) => {
    setError(null)
    try {
      await clienteApi.resetPassword({
        correo: correo.trim().toLowerCase(),
        nueva_contrasena,
      })
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Error al restablecer contraseña'
      setError(msg)
      throw e
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const value: ClienteAuthContextValue = {
    token,
    cliente,
    isLoggedIn: Boolean(token && cliente),
    isLoading,
    login,
    logout,
    register,
    resetPassword,
    error,
    clearError,
  }

  return (
    <ClienteAuthContext.Provider value={value}>
      {children}
    </ClienteAuthContext.Provider>
  )
}

export function useClienteAuth(): ClienteAuthContextValue {
  const ctx = useContext(ClienteAuthContext)
  if (!ctx) throw new Error('useClienteAuth must be used within ClienteAuthProvider')
  return ctx
}
