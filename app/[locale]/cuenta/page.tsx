'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Mail, Building2, User2, MessageSquare, Package, FileText } from 'lucide-react'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import { Skeleton } from '@/components/ui/skeleton'

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-[#171D4C] p-8 flex flex-col items-center gap-3">
          <Skeleton className="w-20 h-20 rounded-full bg-white/20" />
          <Skeleton className="h-5 w-40 bg-white/20" />
          <Skeleton className="h-4 w-32 bg-white/20" />
        </div>
        <div className="p-6 space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function MiCuentaPerfilPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) ?? 'es'
  const { cliente, isLoggedIn, isLoading, logout } = useClienteAuth()

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace(`/${locale}/login?redirect=/${locale}/cuenta`)
    }
  }, [isLoading, isLoggedIn, router, locale])

  const handleLogout = () => {
    logout()
    router.push(`/${locale}/login`)
  }

  if (isLoading) return <PageSkeleton />
  if (!isLoggedIn || !cliente) return null

  const esEmpresa = cliente.tipo_cliente === 2
  const inicial = (cliente.nombre ?? 'U').slice(0, 1).toUpperCase()
  const nombreCompleto = [cliente.nombre, cliente.apellidos].filter(Boolean).join(' ')
  const nombreMostrado = esEmpresa ? (cliente.nombre ?? '') : nombreCompleto
  const subtitulo = esEmpresa ? (cliente.razon_social ?? '') : ''
  const tipoBadge = esEmpresa ? 'Empresa' : 'Persona Natural'

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-12 pb-16 px-4">
      <div className="w-full max-w-md">

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Header con avatar */}
          <div className="bg-[#171D4C] px-8 pt-8 pb-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#13A0D8] flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white/10 mb-4">
              {inicial}
            </div>
            <h1 className="text-white font-bold text-xl leading-tight">{nombreMostrado}</h1>
            {subtitulo && (
              <p className="text-white/70 text-sm mt-1">{subtitulo}</p>
            )}
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 text-white/80 px-3 py-1 rounded-full">
              {esEmpresa ? <Building2 className="w-3 h-3" aria-hidden /> : <User2 className="w-3 h-3" aria-hidden />}
              {tipoBadge}
            </span>
          </div>

          {/* Datos */}
          <div className="px-6 py-5 space-y-3 border-b border-gray-100">
            {cliente.correo && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" aria-hidden />
                <span className="truncate">{cliente.correo}</span>
              </div>
            )}
            {esEmpresa && cliente.razon_social && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Building2 className="w-4 h-4 text-gray-400 shrink-0" aria-hidden />
                <span>{cliente.razon_social}</span>
              </div>
            )}
          </div>

          {/* Accesos rápidos */}
          <div className="px-6 py-5 space-y-2">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
              Accesos rápidos
            </p>

            <Link
              href={`/${locale}/cuenta/chat-sara`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#13A0D8]/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-[#13A0D8]" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Chat con Sara</p>
                <p className="text-xs text-gray-400 truncate">Pedidos y cotizaciones desde el chat</p>
              </div>
            </Link>

            <Link
              href={`/${locale}/cuenta/chat-sara`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#13A0D8]/10 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-[#13A0D8]" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Mis Pedidos</p>
                <p className="text-xs text-gray-400 truncate">Revisa tus pedidos en el chat</p>
              </div>
            </Link>

            <Link
              href={`/${locale}/cuenta/chat-sara`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#13A0D8]/10 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-[#13A0D8]" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Mis Cotizaciones</p>
                <p className="text-xs text-gray-400 truncate">Consulta y descarga desde el chat</p>
              </div>
            </Link>
          </div>

          {/* Logout */}
          <div className="px-6 pb-6 pt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors py-2.5 px-4 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100"
            >
              <LogOut className="w-4 h-4" aria-hidden />
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Footer ID */}
        <p className="text-center text-xs text-gray-400 mt-4">
          ID de cliente: #{cliente.id}
        </p>
      </div>
    </div>
  )
}
