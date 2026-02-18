'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ClienteInfo } from '@/lib/api/cliente-api'
import { clienteApi } from '@/lib/api/cliente-api'
import { ApiError } from '@/lib/api/client'

const TOKEN_KEY = 'inxora_cliente_token'
const DATA_KEY = 'inxora_cliente_data'

function getStored(): { token: string; cliente: ClienteInfo } | null {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem(TOKEN_KEY)
  const data = localStorage.getItem(DATA_KEY)
  if (!token || !data) return null
  try {
    const cliente = JSON.parse(data) as ClienteInfo
    return { token, cliente }
  } catch {
    return null
  }
}

function setStored(token: string, cliente: ClienteInfo) {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(DATA_KEY, JSON.stringify(cliente))
}

function clearStored() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(DATA_KEY)
}

type ClienteAuthContextValue = {
  token: string | null
  cliente: ClienteInfo | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (correo: string, password: string) => Promise<void>
  logout: () => void
  register: (payload: {
    nombre: string
    apellidos: string
    documento_personal: string
    correo: string
    telefono?: string
    password: string
    id_pais?: number
    id_rubro?: number
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

  const loadStored = useCallback(() => {
    const stored = getStored()
    if (stored) {
      setToken(stored.token)
      setCliente(stored.cliente)
    } else {
      setToken(null)
      setCliente(null)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadStored()
  }, [loadStored])

  const login = useCallback(async (correo: string, password: string) => {
    setError(null)
    try {
      const res = await clienteApi.login({ correo: correo.trim().toLowerCase(), password })
      if (!res.token || !res.cliente) throw new Error('Respuesta inválida')
      setStored(res.token, res.cliente)
      setToken(res.token)
      setCliente(res.cliente)
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Error al iniciar sesión'
      setError(msg)
      throw e
    }
  }, [])

  const logout = useCallback(() => {
    clearStored()
    setToken(null)
    setCliente(null)
    setError(null)
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
      })
      // Auto-login tras registro
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
