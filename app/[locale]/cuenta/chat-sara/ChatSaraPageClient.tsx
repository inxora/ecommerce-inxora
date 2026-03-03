'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { MessageSquarePlus, ArrowLeft, Loader2 } from 'lucide-react'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import {
  getSaraConversaciones,
  getSaraConversation,
  sendSaraChatMessage,
  ApiError,
} from '@/lib/services/sara-chat.service'
import type { SaraConversacionItem } from '@/lib/services/sara-chat.service'
import { formatPhoneForWhatsApp } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type Message = { role: 'user' | 'assistant'; content: string }

const BRAND = { logo: '/LOGO-03.png', name: 'SARA XORA', typingText: 'Sara está escribiendo...' }
const STYLE = { primary: '#13A0D8', secondary: '#0d7ba8' }
const PHONE_REGEX = /(\+?51)?[\s.-]*([9]\d{2})[\s.-]*(\d{3})[\s.-]*(\d{3})\b/g

function linkifyPhones(text: string): string {
  return text.replace(PHONE_REGEX, (match) => {
    const digits = match.replace(/\D/g, '')
    const normalized = formatPhoneForWhatsApp(digits).replace('+', '')
    return `[${match.trim()}](https://wa.me/${normalized})`
  })
}

export function ChatSaraPageClient({ locale }: { locale: string }) {
  const router = useRouter()
  const { cliente, isLoggedIn, isLoading: authLoading } = useClienteAuth()
  const [conversaciones, setConversaciones] = useState<SaraConversacionItem[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingChat, setLoadingChat] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  /** Evitar que el efecto de "cargar mensajes al cambiar sesión" sobrescriba los mensajes recién enviados */
  const skipLoadMessagesRef = useRef(false)
  /** Al hacer clic en una conversación siempre cargamos; si es la misma sesión el efecto no se dispara, así que forzamos con loadKey */
  const [loadKey, setLoadKey] = useState(0)

  // Redirigir si no está logueado
  useEffect(() => {
    if (authLoading) return
    if (!isLoggedIn) {
      router.replace(`/${locale}/login?redirect=/${locale}/cuenta/chat-sara`)
    }
  }, [isLoggedIn, authLoading, router, locale])

  // Cargar lista de conversaciones
  const loadConversaciones = useCallback(async () => {
    if (!cliente?.id) return
    setLoadingList(true)
    setError(null)
    try {
      const res = await getSaraConversaciones(cliente.id)
      setConversaciones(res.data ?? [])
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Error al cargar conversaciones')
    } finally {
      setLoadingList(false)
    }
  }, [cliente?.id])

  useEffect(() => {
    if (cliente?.id) loadConversaciones()
  }, [cliente?.id, loadConversaciones])

  // Al seleccionar una conversación, cargar mensajes (salvo si acabamos de enviar y ya tenemos los mensajes en estado)
  useEffect(() => {
    if (!selectedSessionId) {
      setMessages([])
      return
    }
    if (skipLoadMessagesRef.current) {
      skipLoadMessagesRef.current = false
      setLoadingChat(false)
      return
    }
    setLoadingChat(true)
    setError(null)
    getSaraConversation(selectedSessionId)
      .then((res) => {
        let raw = res?.data?.mensajes
        if (typeof raw === 'string') {
          try {
            raw = JSON.parse(raw) as Message[]
          } catch {
            raw = []
          }
        }
        const msgs = Array.isArray(raw) ? raw : []
        setMessages(
          msgs.filter(
            (m): m is Message =>
              m?.role === 'user' || m?.role === 'assistant'
          ) as Message[]
        )
      })
      .catch(() => setMessages([]))
      .finally(() => setLoadingChat(false))
  }, [selectedSessionId, loadKey])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const startNewConversation = useCallback(() => {
    setSelectedSessionId(null)
    setMessages([])
    setInput('')
    setError(null)
  }, [])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setSending(true)
    scrollToBottom()
    try {
      const res = await sendSaraChatMessage(text, selectedSessionId ?? undefined, cliente?.id)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.response }])
      if (res.session_id) {
        skipLoadMessagesRef.current = true
        setSelectedSessionId(res.session_id)
      }
      if (!selectedSessionId) loadConversaciones()
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Error al enviar. Inténtalo de nuevo.'
      setError(msg)
      setMessages((prev) => [...prev, { role: 'assistant', content: msg }])
    } finally {
      setSending(false)
      scrollToBottom()
    }
  }, [input, sending, selectedSessionId, loadConversaciones, scrollToBottom])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatDate = (s: string | null) => {
    if (!s) return ''
    try {
      const d = new Date(s)
      return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch {
      return s
    }
  }

  if (authLoading || !isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#13A0D8]" />
      </div>
    )
  }

  // Altura = 100vh menos el header (~5rem); ancho completo sin centrado
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] w-full min-h-0">
      {/* Sidebar: lista de conversaciones */}
      <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50 flex-shrink-0 flex flex-col">
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="text-sm text-gray-600 hover:text-[#13A0D8] flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={startNewConversation}
            className="flex items-center gap-1"
          >
            <MessageSquarePlus className="h-4 w-4" /> Nueva
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {loadingList ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-[#13A0D8]" />
            </div>
          ) : conversaciones.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Aún no tienes conversaciones. Inicia una nueva abajo.
            </p>
          ) : (
            <ul className="space-y-1">
              {conversaciones.map((c) => (
                <li key={c.session_id}>
                  <button
                    type="button"
                    onClick={() => {
                      setLoadKey((k) => k + 1)
                      setSelectedSessionId(c.session_id)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedSessionId === c.session_id
                        ? 'bg-[#13A0D8] text-white'
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    <span className="block truncate font-medium">
                      {c.lead_json?.razon_social || c.lead_json?.nombre_contacto || 'Conversación'}
                    </span>
                    <span className="block truncate text-xs opacity-80">
                      {formatDate(c.updated_at)} · {c.estado}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Área de chat */}
      <main className="flex-1 flex flex-col min-h-0 bg-white">
        <div className="border-b border-gray-200 px-4 py-3 flex items-center gap-3 bg-gray-50">
          <Image src={BRAND.logo} alt={BRAND.name} width={36} height={36} unoptimized />
          <span className="font-semibold text-gray-800">{BRAND.name}</span>
        </div>
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {!selectedSessionId && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <p className="mb-2">Selecciona una conversación o inicia una nueva.</p>
              <p className="text-sm">Escribe abajo y pulsa Enviar para empezar un chat con Sara.</p>
            </div>
          ) : loadingChat ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#13A0D8]" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center text-gray-500 py-12">
              <p>No hay mensajes en esta conversación.</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-[#13A0D8] text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md border border-gray-200'
                  }`}
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <ReactMarkdown
                      components={{
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                            style={{ color: STYLE.primary }}
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {linkifyPhones(msg.content)}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))
          )}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2 text-sm italic text-gray-600">
                {BRAND.typingText}
              </div>
            </div>
          )}
        </div>
        {error && (
          <div className="px-4 py-2 bg-red-50 text-red-700 text-sm">{error}</div>
        )}
        <div className="p-4 border-t border-gray-200 flex gap-2">
          <textarea
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            className="flex-1 min-h-[44px] max-h-32 px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#13A0D8]"
            rows={1}
          />
          <Button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="bg-[#13A0D8] hover:bg-[#0d7ba8] shrink-0"
          >
            Enviar
          </Button>
        </div>
      </main>
    </div>
  )
}
