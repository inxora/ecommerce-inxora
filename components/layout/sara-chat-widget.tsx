'use client'

/**
 * Widget de Chat Sara Xora (INXORA).
 * Diseño del widget legacy chat.js + funcionalidad vía sara-chat.service (POST /api/chat).
 * Solo 2 widgets flotantes: WhatsApp y Sara (logo LOGO-03.png).
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import { MessageSquarePlus } from 'lucide-react'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import { sendSaraChatMessage, getSaraConversation, ApiError } from '@/lib/services/sara-chat.service'
import { formatPhoneForWhatsApp } from '@/lib/utils'

type Message = { role: 'user' | 'assistant'; content: string }

const BRAND = {
  logo: '/LOGO-03.png',
  name: 'INXORA',
  welcomeText: '¡Hola! Soy **SARA XORA**, tu asistente virtual. ¿En qué puedo ayudarte?',
  typingText: 'SARA XORA está escribiendo...',
}
const STYLE = {
  primaryColor: '#13A0D8',
  secondaryColor: '#0d7ba8',
  backgroundColor: '#ffffff',
  fontColor: '#333333',
}
const PLACEHOLDER = 'Escribe tu mensaje...'
const CHAT_SESSION_STORAGE_KEY = 'inxora_chat_session_id'
const CHAT_MESSAGES_STORAGE_KEY = 'inxora_chat_messages'

const PHONE_REGEX = /(\+?51)?[\s.-]*([9]\d{2})[\s.-]*(\d{3})[\s.-]*(\d{3})\b/g

function linkifyPhonesToWhatsApp(text: string): string {
  return text.replace(PHONE_REGEX, (match) => {
    const digits = match.replace(/\D/g, '')
    const normalized = formatPhoneForWhatsApp(digits).replace('+', '')
    const url = `https://wa.me/${normalized}`
    return `[${match.trim()}](${url})`
  })
}

const markdownComponents = {
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="sara-chat-link"
      style={{ color: STYLE.primaryColor, textDecoration: 'underline' }}
      title={href?.startsWith('https://wa.me/') ? 'Abrir en WhatsApp' : undefined}
    >
      {children}
    </a>
  ),
}

export function SaraChatWidget({ onOpenChange }: { onOpenChange?: (open: boolean) => void } = {}) {
  const { cliente } = useClienteAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    onOpenChange?.(open)
  }, [open, onOpenChange])

  // Rehidratar mensajes al montar: primero desde backend (si hay session_id), sino desde sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const sessionId = sessionStorage.getItem(CHAT_SESSION_STORAGE_KEY)
    if (sessionId) {
      getSaraConversation(sessionId)
        .then((res) => {
          const msgs = res?.data?.mensajes
          if (Array.isArray(msgs) && msgs.length > 0) {
            const valid = msgs.filter(
              (m): m is Message =>
                m && typeof m === 'object' && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
            )
            if (valid.length > 0) {
              setMessages(valid)
              sessionStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(valid))
            }
          }
        })
        .catch(() => {
          // Fallback: cargar desde sessionStorage
          const raw = sessionStorage.getItem(CHAT_MESSAGES_STORAGE_KEY)
          if (!raw) return
          try {
            const parsed = JSON.parse(raw) as unknown
            if (Array.isArray(parsed) && parsed.every(m => m && typeof m === 'object' && 'role' in m && 'content' in m)) {
              setMessages(parsed as Message[])
            }
          } catch {
            // ignorar datos corruptos
          }
        })
    } else {
      const raw = sessionStorage.getItem(CHAT_MESSAGES_STORAGE_KEY)
      if (!raw) return
      try {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed) && parsed.every(m => m && typeof m === 'object' && 'role' in m && 'content' in m)) {
          setMessages(parsed as Message[])
        }
      } catch {
        // ignorar datos corruptos
      }
    }
  }, [])

  // Persistir mensajes en sessionStorage cuando cambien (solo escribir; no borrar aquí para no pisar la carga inicial)
  useEffect(() => {
    if (typeof window === 'undefined' || messages.length === 0) return
    sessionStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  /** Obtiene session_id desde sessionStorage (cada pestaña tiene el suyo; al recargar se mantiene). */
  const getStoredSessionId = useCallback((): string | null => {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem(CHAT_SESSION_STORAGE_KEY)
  }, [])

  const startNewConversation = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(CHAT_SESSION_STORAGE_KEY)
      sessionStorage.removeItem(CHAT_MESSAGES_STORAGE_KEY)
    }
    setMessages([])
    setError(null)
    inputRef.current?.focus()
  }, [])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    })
  }, [])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)
    scrollToBottom()

    const sid = getStoredSessionId()
    try {
      const res = await sendSaraChatMessage(text, sid ?? undefined, cliente?.id)
      if (res.session_id && typeof window !== 'undefined') {
        sessionStorage.setItem(CHAT_SESSION_STORAGE_KEY, res.session_id)
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: res.response }])
      scrollToBottom()
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.message || 'Error de conexión. Inténtalo de nuevo.'
          : 'No se pudo enviar el mensaje. Inténtalo de nuevo.'
      setError(msg)
      setMessages((prev) => [...prev, { role: 'assistant', content: msg }])
      scrollToBottom()
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [input, loading, getStoredSessionId, scrollToBottom, cliente?.id])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const hasMessages = messages.length > 0

  return (
    <>
      <style jsx>{`
        .sara-bubble {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: ${STYLE.backgroundColor};
          border: 3px solid ${STYLE.primaryColor};
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          cursor: pointer;
          z-index: 999000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: saraBubbleBounce 2.5s infinite ease-in-out;
        }
        .sara-bubble:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        .sara-bubble.hidden {
          display: none !important;
        }
        .sara-bubble :global(img) {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }
        @keyframes saraBubbleBounce {
          0%, 100% { transform: translateY(0); }
          10% { transform: translateY(-7px); }
          20% { transform: translateY(0); }
          25% { transform: scale(1.1); }
          35% { transform: scale(1); }
          70% { box-shadow: 0 0 0 0 rgba(19, 160, 216, 0.4); }
          80% { box-shadow: 0 0 0 8px rgba(19, 160, 216, 0); }
        }
        @media (min-width: 1024px) {
          .sara-bubble {
            width: 80px;
            height: 80px;
          }
          .sara-bubble :global(img) {
            width: 56px;
            height: 56px;
          }
        }
        @media (max-width: 767px) {
          .sara-bubble {
            bottom: 15px;
            right: 15px;
            width: 50px;
            height: 50px;
          }
          .sara-bubble :global(img) {
            width: 32px;
            height: 32px;
          }
        }

        .sara-panel {
          position: fixed;
          bottom: 15px;
          right: 15px;
          width: 360px;
          height: 500px;
          max-height: 90vh;
          background: ${STYLE.backgroundColor};
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          border: 1px solid rgba(0,0,0,0.1);
          z-index: 998999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          animation: saraChatFadeIn 0.3s forwards;
        }
        @keyframes saraChatFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 768px) {
          .sara-panel {
            width: 400px;
            height: 600px;
            max-height: 85vh;
          }
        }
        @media (min-width: 1024px) {
          .sara-panel {
            width: 420px;
            height: 650px;
            max-height: 85vh;
          }
        }
        @media (max-width: 767px) {
          .sara-panel {
            width: 95%;
            right: 2.5%;
            height: 70vh;
            bottom: 10px;
            border-radius: 12px;
          }
        }

        .sara-brand-header {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          background: linear-gradient(135deg, ${STYLE.primaryColor}10, ${STYLE.backgroundColor});
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .sara-brand-header :global(img) {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: contain;
        }
        .sara-brand-header span {
          font-size: 18px;
          color: ${STYLE.fontColor};
          font-weight: 600;
        }
        .sara-close-btn {
          margin-left: auto;
          background: rgba(0,0,0,0.05);
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #333;
          opacity: 0.7;
          transition: all 0.2s;
        }
        .sara-close-btn:hover {
          background: rgba(0,0,0,0.1);
          opacity: 1;
        }
        .sara-new-chat-btn {
          margin-left: auto;
          background: rgba(0,0,0,0.05);
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #333;
          opacity: 0.7;
          transition: all 0.2s;
          margin-right: 8px;
        }
        .sara-new-chat-btn:hover {
          background: rgba(0,0,0,0.1);
          opacity: 1;
        }
        @media (max-width: 767px) {
          .sara-brand-header span { font-size: 16px; }
        }

        .sara-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          overscroll-behavior: contain;
          background: ${STYLE.backgroundColor};
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 767px) {
          .sara-messages { padding: 15px; }
        }

        .sara-msg {
          padding: 12px 16px;
          margin: 4px 0 12px;
          border-radius: 12px;
          max-width: 80%;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
          animation: saraMessageAppear 0.3s ease-out forwards;
        }
        @keyframes saraMessageAppear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sara-msg.user {
          margin-left: auto;
          background: linear-gradient(135deg, ${STYLE.primaryColor}, ${STYLE.secondaryColor});
          color: white;
          border-radius: 18px 4px 18px 18px;
          box-shadow: 0 2px 8px rgba(19, 160, 216, 0.15);
        }
        .sara-msg.bot {
          background: #f8f8f8;
          color: ${STYLE.fontColor};
          border-radius: 4px 18px 18px 18px;
          border: 1px solid rgba(0,0,0,0.08);
          max-width: 85%;
        }
        .sara-msg.error {
          background: #fef2f2;
          border-color: #fecaca;
          color: #991b1b;
        }
        .sara-msg :global(.sara-chat-link) {
          color: ${STYLE.primaryColor};
          text-decoration: underline;
        }
        .sara-msg :global(.sara-chat-link:hover) {
          text-decoration: none;
        }

        .sara-typing {
          color: #666;
          font-style: italic;
          font-size: 14px;
          padding: 10px 16px;
          background: #f0f0f0;
          border-radius: 4px 18px 18px 18px;
          margin-bottom: 12px;
          max-width: 85%;
          animation: saraPulse 1.5s infinite ease-in-out;
        }
        @keyframes saraPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .sara-input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-top: 1px solid rgba(0,0,0,0.05);
          background: ${STYLE.backgroundColor};
        }
        .sara-input-wrap :global(textarea) {
          flex: 1;
          min-height: 42px;
          max-height: 120px;
          padding: 10px 14px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 14px;
          resize: none;
          font-family: inherit;
          line-height: 1.4;
          transition: border 0.3s ease;
        }
        .sara-input-wrap :global(textarea:focus) {
          outline: none;
          border-color: ${STYLE.primaryColor};
          box-shadow: 0 0 0 2px ${STYLE.primaryColor}20;
        }
        @media (max-width: 767px) {
          .sara-input-wrap :global(textarea) { font-size: 16px; }
        }
        .sara-send-btn {
          height: 42px;
          min-width: 80px;
          padding: 0 16px;
          background: ${STYLE.primaryColor};
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          letter-spacing: 0.3px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s;
        }
        .sara-send-btn:hover:not(:disabled) {
          background: ${STYLE.secondaryColor};
        }
        .sara-send-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <button
        type="button"
        className={`sara-bubble ${open ? 'hidden' : ''}`}
        aria-label="Abrir chat con Sara Xora"
        onClick={() => {
          setOpen(true)
          setError(null)
          setTimeout(() => inputRef.current?.focus(), 300)
        }}
      >
        <Image src={BRAND.logo} alt="SARA XORA - Asistente virtual de INXORA" width={48} height={48} unoptimized />
      </button>

      {open && (
        <div className="sara-panel" role="dialog" aria-label="Chat Sara Xora">
          <div className="sara-brand-header">
            <Image src={BRAND.logo} alt={BRAND.name} width={40} height={40} unoptimized />
            <span>{BRAND.name}</span>
            <button
              type="button"
              className="sara-new-chat-btn"
              aria-label="Nueva conversación"
              title="Nueva conversación"
              onClick={startNewConversation}
            >
              <MessageSquarePlus className="w-4 h-4" />
            </button>
            <button type="button" className="sara-close-btn" aria-label="Cerrar chat" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          <div className="sara-messages" ref={listRef}>
            {!hasMessages && (
              <div className="sara-msg bot">
                <ReactMarkdown components={markdownComponents}>{BRAND.welcomeText}</ReactMarkdown>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`sara-msg ${msg.role} ${error && msg.role === 'assistant' && i === messages.length - 1 ? 'error' : ''}`}
              >
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <ReactMarkdown components={markdownComponents}>
                    {linkifyPhonesToWhatsApp(msg.content)}
                  </ReactMarkdown>
                )}
              </div>
            ))}
            {loading && <div className="sara-typing">{BRAND.typingText}</div>}
          </div>

          <div className="sara-input-wrap">
            <textarea
              ref={inputRef}
              placeholder={PLACEHOLDER}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              rows={1}
              aria-label="Mensaje"
            />
            <button
              type="button"
              className="sara-send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
