/**
 * Servicio para el chatbot Sara Xora (IA alterna).
 * Consume POST https://app.inxora.com/api/chat (o proxy /api/chat).
 * No mezclar con el widget de chat.js existente.
 */
import { apiClient, ApiError } from '@/lib/api/client'

const CHAT_ENDPOINT = '/api/chat'
const CHAT_TIMEOUT_MS = 90000

/** Request del endpoint de chat (backend chat.py) */
export interface SaraChatRequest {
  user_message: string
  session_id?: string
  id_cliente?: number
}

/** Response del endpoint de chat */
export interface SaraChatResponse {
  response: string
  session_id: string
}

/** Mensaje del historial (GET sesión); "asesor" = mensaje de un asesor humano. */
export interface SaraMensaje {
  role: 'user' | 'assistant' | 'asesor'
  content: string
}

/** Response de GET /api/chat/sesion/{session_id} */
export interface SaraConversacionResponse {
  success: boolean
  data: {
    id: number
    session_id: string
    id_cliente: number | null
    idioma: string | null
    estado: string
    id_cotizacion: number | null
    mensajes: SaraMensaje[]
    created_at: string | null
    updated_at: string | null
    [key: string]: unknown
  }
}

/**
 * Obtiene una conversación por session_id (incluye mensajes para rehidratar el chat).
 */
export async function getSaraConversation(
  sessionId: string
): Promise<SaraConversacionResponse> {
  return apiClient<SaraConversacionResponse>(
    `${CHAT_ENDPOINT}/sesion/${encodeURIComponent(sessionId)}`,
    { method: 'GET', timeout: 15000 }
  )
}

/** Item de lista de conversaciones (GET /api/chat/conversaciones) */
export interface SaraConversacionItem {
  id: number
  session_id: string
  id_cliente: number | null
  estado: string
  id_cotizacion: number | null
  lead_json: { razon_social?: string; nombre_contacto?: string } | null
  created_at: string | null
  updated_at: string | null
}

/** Response de GET /api/chat/conversaciones?id_cliente=... */
export interface SaraConversacionesListResponse {
  success: boolean
  data: SaraConversacionItem[]
  total: number
}

/**
 * Lista conversaciones de Sara para un cliente (usuarios registrados).
 */
export async function getSaraConversaciones(
  idCliente: number,
  params?: { limit?: number; offset?: number }
): Promise<SaraConversacionesListResponse> {
  const search = new URLSearchParams({ id_cliente: String(idCliente) })
  if (params?.limit != null) search.set('limit', String(params.limit))
  if (params?.offset != null) search.set('offset', String(params.offset))
  return apiClient<SaraConversacionesListResponse>(
    `${CHAT_ENDPOINT}/conversaciones?${search.toString()}`,
    { method: 'GET', timeout: 15000 }
  )
}

/**
 * Envía un mensaje al asistente Sara Xora y recibe la respuesta.
 * Si se envía session_id se mantiene el historial (DNI/RUC, productos elegidos).
 * Si idCliente está definido (usuario logueado), la conversación queda vinculada al cliente desde el primer mensaje.
 */
export async function sendSaraChatMessage(
  userMessage: string,
  sessionId?: string,
  idCliente?: number
): Promise<SaraChatResponse> {
  const body: SaraChatRequest = {
    user_message: userMessage,
    ...(sessionId && { session_id: sessionId }),
    ...(idCliente != null && { id_cliente: idCliente }),
  }
  return apiClient<SaraChatResponse>(CHAT_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(body),
    timeout: CHAT_TIMEOUT_MS,
  })
}

export { ApiError }
