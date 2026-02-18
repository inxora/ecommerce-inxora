import { apiClient, ApiError } from '@/lib/api/client'

const BASE = '/api/clientes'

export interface ClienteInfo {
  id: number
  nombre: string | null
  apellidos: string | null
  correo: string | null
}

export interface LoginResponse {
  success: boolean
  token: string
  cliente: ClienteInfo
  message: string
}

export interface RegistroPayload {
  nombre: string
  apellidos: string
  documento_personal: string
  correo: string
  telefono?: string
  password: string
  id_pais?: number
  id_rubro?: number
}

export interface ResetPasswordPayload {
  correo: string
  nueva_contrasena: string
}

export const clienteApi = {
  async login(body: { correo: string; password: string }): Promise<LoginResponse> {
    const res = await apiClient<LoginResponse>(`${BASE}/login`, {
      method: 'POST',
      body: JSON.stringify(body),
      timeout: 30000, // 30s: backend puede tardar (SP, BD)
    })
    return res
  },

  async registro(payload: RegistroPayload): Promise<{ success: boolean; message: string; data?: { id: number } }> {
    const res = await apiClient<{ success: boolean; message: string; data?: { id: number } }>(`${BASE}/registro`, {
      method: 'POST',
      body: JSON.stringify({
        nombre: payload.nombre,
        apellidos: payload.apellidos,
        documento_personal: payload.documento_personal,
        correo: payload.correo,
        telefono: payload.telefono ?? null,
        password: payload.password,
        id_pais: payload.id_pais ?? 1,
        id_rubro: payload.id_rubro ?? null,
      }),
      timeout: 30000, // 30s: SP crea cliente y puede tardar
    })
    return res
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }> {
    const res = await apiClient<{ success: boolean; message: string }>(`${BASE}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({
        correo: payload.correo,
        nueva_contrasena: payload.nueva_contrasena,
      }),
      timeout: 30000,
    })
    return res
  },
}
