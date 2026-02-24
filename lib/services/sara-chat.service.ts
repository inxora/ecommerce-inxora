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
}

/** Response del endpoint de chat */
export interface SaraChatResponse {
  response: string
  session_id: string
}

/**
 * Envía un mensaje al asistente Sara Xora y recibe la respuesta.
 * Si se envía session_id se mantiene el historial (DNI/RUC, productos elegidos).
 */
export async function sendSaraChatMessage(
  userMessage: string,
  sessionId?: string
): Promise<SaraChatResponse> {
  const body: SaraChatRequest = {
    user_message: userMessage,
    ...(sessionId && { session_id: sessionId }),
  }
  return apiClient<SaraChatResponse>(CHAT_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(body),
    timeout: CHAT_TIMEOUT_MS,
  })
}

export { ApiError }
