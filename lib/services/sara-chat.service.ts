/**
 * Servicio para el chatbot Sara Xora (IA alterna).
 * Consume POST https://api.inxora.com/api/chat (o proxy /api/chat).
 * No mezclar con el widget de chat.js existente.
 */
import { apiClient, ApiError } from '@/lib/api/client'

const CHAT_BASE = '/api/chat'
const CHAT_TIMEOUT_MS = 90000

/** Adjunto de imagen para el chat (máx. 5 por mensaje, 5 MB cada una). */
export type SaraChatAttachmentContentType = 'image/jpeg' | 'image/png' | 'image/webp'

export interface SaraChatAttachment {
  content_type: SaraChatAttachmentContentType
  data: string // base64 (con o sin prefijo data:...; el backend normaliza)
}

/** Documento para el chat (máx. 3 por mensaje, 10 MB cada uno). */
export type SaraChatDocumentContentType =
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export interface SaraChatDocument {
  content_type: SaraChatDocumentContentType
  data: string // base64
}

/** Request del endpoint de chat (backend chat.py) */
export interface SaraChatRequest {
  user_message: string
  session_id?: string
  id_cliente?: number
  /** Moneda seleccionada por el usuario (ej: "PEN", "USD"). */
  moneda_usuario?: string
  /** Opcional: imágenes para que Sara analice (visión). Máx. 5, 5 MB c/u. */
  attachments?: SaraChatAttachment[]
  /** Opcional: documentos (PDF, Word, Excel). Máx. 3, 10 MB c/u. */
  documents?: SaraChatDocument[]
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
    `${CHAT_BASE}/sesion/${encodeURIComponent(sessionId)}`,
    { method: 'GET', timeout: 15000 }
  )
}

/** Response de DELETE /api/chat/sesion/{session_id}/historial */
export interface SaraDeleteHistorialResponse {
  success: boolean
  message?: string
  session_id?: string
}

/**
 * Borra el historial de mensajes de una sesión en el backend.
 * El mismo session_id sigue válido; el siguiente mensaje será como conversación nueva.
 */
export async function deleteSaraChatHistory(
  sessionId: string
): Promise<SaraDeleteHistorialResponse> {
  return apiClient<SaraDeleteHistorialResponse>(
    `${CHAT_BASE}/sesion/${encodeURIComponent(sessionId)}/historial`,
    { method: 'DELETE', timeout: 10000 }
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
  /** Título personalizado de la conversación (editable por el usuario) */
  titulo?: string | null
  /** Texto del primer mensaje del usuario (para usar como título de fallback) */
  primer_mensaje?: string | null
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
    `${CHAT_BASE}/conversaciones?${search.toString()}`,
    { method: 'GET', timeout: 15000 }
  )
}

/**
 * Envía un mensaje al asistente Sara Xora y recibe la respuesta.
 * Si se envía session_id se mantiene el historial (DNI/RUC, productos elegidos).
 * Si idCliente está definido (usuario logueado), la conversación queda vinculada al cliente desde el primer mensaje.
 * attachments: opcional, imágenes (JPEG/PNG/WebP, máx. 5 y 5 MB c/u).
 * documents: opcional, documentos (PDF, Word, Excel, máx. 3 y 10 MB c/u).
 */
export async function sendSaraChatMessage(
  userMessage: string,
  sessionId?: string,
  idCliente?: number,
  attachments?: SaraChatAttachment[],
  documents?: SaraChatDocument[],
  monedaUsuario?: string
): Promise<SaraChatResponse> {
  const body: SaraChatRequest = {
    user_message: userMessage,
    ...(sessionId && { session_id: sessionId }),
    ...(idCliente != null && { id_cliente: idCliente }),
    ...(monedaUsuario && { moneda_usuario: monedaUsuario }),
    ...(attachments && attachments.length > 0 && { attachments }),
    ...(documents && documents.length > 0 && { documents }),
  }
  return apiClient<SaraChatResponse>(`${CHAT_BASE}/`, {
    method: 'POST',
    body: JSON.stringify(body),
    timeout: CHAT_TIMEOUT_MS,
  })
}

/** Mensaje mostrado al usuario cuando el backend devuelve 502/503/504 (no se usa el body HTML). */
export const CHAT_GATEWAY_ERROR_MESSAGE =
  'La solicitud tardó demasiado. Por favor, intente de nuevo. Si envió una imagen, puede probar con una más pequeña o sin imagen.'

/** Comprueba si un texto parece una página de error (HTML de nginx, etc.) para no mostrarlo en el chat. */
export function isGatewayErrorBody(text: string): boolean {
  if (!text || typeof text !== 'string') return false
  const t = text.trim().toLowerCase()
  return (
    t.includes('<html') ||
    t.includes('<head') ||
    t.includes('504') ||
    t.includes('502') ||
    t.includes('503') ||
    t.includes('gateway time-out') ||
    t.includes('bad gateway') ||
    t.includes('service unavailable')
  )
}

/**
 * Renombra una conversación de Sara.
 * PATCH /api/chat/sesion/{session_id}/titulo
 */
export async function renameSaraConversacion(
  sessionId: string,
  titulo: string
): Promise<{ success: boolean; message?: string }> {
  return apiClient<{ success: boolean; message?: string }>(
    `${CHAT_BASE}/sesion/${encodeURIComponent(sessionId)}/titulo`,
    {
      method: 'PATCH',
      body: JSON.stringify({ titulo }),
      timeout: 10000,
    }
  )
}

export { ApiError }
