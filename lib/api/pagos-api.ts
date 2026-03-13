import { apiClient, ApiError } from '@/lib/api/client'

const BASE = '/api/pagos'

// ─── Request types ────────────────────────────────────────────────────────────

export interface CrearTokenRequest {
  id_pedido: number
}

export interface ValidarPagoRequest {
  kr_answer: string   // JSON string del resultado del widget Izipay
  kr_hash: string     // Firma HMAC-SHA256 recibida del widget
}

// ─── Response types ───────────────────────────────────────────────────────────

export interface CrearTokenResponse {
  success: boolean
  data: {
    formToken: string   // Token para inicializar el widget de Izipay
    publicKey: string   // Clave pública para el SDK de Izipay en el frontend
  }
  message?: string
}

export interface ValidarPagoResponse {
  success: boolean
  data: {
    orderStatus: 'PAID' | 'UNPAID' | string
    orderId: string     // Tu codigo_pedido
  }
  message?: string
}

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * Solicita al backend generar el formToken de Izipay para un pedido existente.
 * El backend llama a CreatePayment de Izipay y retorna formToken + publicKey.
 *
 * @param body   - { id_pedido }
 * @param token  - Bearer token del cliente autenticado
 */
export async function crearTokenPago(
  body: CrearTokenRequest,
  token: string
): Promise<CrearTokenResponse> {
  return apiClient<CrearTokenResponse>(`${BASE}/crear-token`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 15000,
  })
}

/**
 * Crea un formToken de Izipay usando solo el monto, sin pedido creado.
 * Útil para mostrar el widget antes del submit.
 */
export async function crearTokenSinPedido(
  body: { monto: number },
  token: string
): Promise<CrearTokenResponse> {
  if (!token || (typeof token === 'string' && token.trim() === '')) {
    throw new ApiError(401, 'Unauthorized', 'Token de autenticación requerido')
  }
  return apiClient<CrearTokenResponse>(`${BASE}/crear-token-monto`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    timeout: 15000,
  })
}

export async function validarPago(
  body: ValidarPagoRequest,
  token: string
): Promise<ValidarPagoResponse> {
  return apiClient<ValidarPagoResponse>(`${BASE}/validar`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 15000,
  })
}

export { ApiError }