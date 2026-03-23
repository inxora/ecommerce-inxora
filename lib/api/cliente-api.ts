import { apiClient, ApiError } from '@/lib/api/client'

const BASE = '/api/clientes'

export interface ClienteInfo {
  id: number
  nombre: string | null
  apellidos: string | null
  correo: string | null
  /** 1 = Persona Natural, 2 = Empresa */
  tipo_cliente?: number | null
  razon_social?: string | null
  telefono?: string | null
}

export interface ConsultarRucResponse {
  success: boolean
  data: {
    ruc: string
    razon_social: string
    [key: string]: unknown
  }
}

export interface RegistroEmpresaPayload {
  ruc: string
  razon_social: string
  nombre_contacto: string
  correo: string
  telefono: string
  password: string
}

export interface ContactoPayload {
  nombre_completo: string
  correo: string
  telefono: string
  es_contacto_principal: boolean
  roles: number[]
}

export interface RegistroEmpresaV2Payload {
  documento_empresa: string
  razon_social: string
  nombre_contacto_principal: string
  correo_contacto_principal: string
  telefono_contacto_principal: string
  contrasena: string
  id_rubro: number
  id_pais: number
  id_forma_pago: number
  activo: boolean
  contactos: ContactoPayload[]
  acepta_terminos: boolean
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
  acepta_terminos?: boolean
}

export interface ResetPasswordPayload {
  correo: string
  nueva_contrasena: string
}

export const clienteApi = {
  async login(body: { correo: string; password: string }): Promise<LoginResponse> {
    const res = await apiClient<LoginResponse>(`${BASE}/login`, {
      method: 'POST',
      body: JSON.stringify({ correo: body.correo, contrasena: body.password }),
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
        contrasena: payload.password,
        id_pais: payload.id_pais ?? 1,
        id_rubro: payload.id_rubro ?? null,
        acepta_terminos: payload.acepta_terminos ?? false,
      }),
      timeout: 30000, // 30s: SP crea cliente y puede tardar
    })
    return res
  },

  async consultarRuc(ruc: string): Promise<ConsultarRucResponse> {
    const res = await apiClient<ConsultarRucResponse>(`${BASE}/consultar-ruc/${ruc}`, {
      timeout: 15000,
    })
    return res
  },

  async registroEmpresa(payload: RegistroEmpresaPayload): Promise<{ success: boolean; message: string; token?: string; cliente?: ClienteInfo }> {
    const res = await apiClient<{ success: boolean; message: string; token?: string; cliente?: ClienteInfo }>(`${BASE}/`, {
      method: 'POST',
      body: JSON.stringify({
        id_tipo_cliente: 2,
        documento_empresa: payload.ruc,
        razon_social: payload.razon_social,
        nombre: payload.nombre_contacto.trim(),
        apellidos: 'N/A',
        correo: payload.correo.trim().toLowerCase(),
        telefono: payload.telefono.trim(),
        id_rubro: 1,
        id_pais: 1,
        id_forma_pago: 1,
        activo: true,
        contrasena: payload.password,
        contactos: [
          {
            nombre_completo: payload.nombre_contacto.trim(),
            correo: payload.correo.trim().toLowerCase(),
            telefono: payload.telefono.trim(),
            es_contacto_principal: true,
            roles: [1],
          },
        ],
      }),
      timeout: 30000,
    })
    return res
  },

  async registroEmpresaV2(payload: RegistroEmpresaV2Payload): Promise<{ success: boolean; message: string; token?: string; cliente?: ClienteInfo }> {
    const res = await apiClient<{ success: boolean; message: string; token?: string; cliente?: ClienteInfo }>(`${BASE}/crear-empresa`, {
      method: 'POST',
      body: JSON.stringify(payload),
      timeout: 30000,
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
