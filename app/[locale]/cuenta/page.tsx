'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Mail, Building2, User2, Package, FileText } from 'lucide-react'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import { getIndustrialQuotationWhatsAppUrl } from '@/lib/whatsapp-industrial-cta'
import { getChatSaraCotizacionesPath, getChatSaraPedidosPath } from '@/lib/i18n/chat-sara-routes'
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

  const cleanName = (value?: string | null): string =>
    value && value.trim().toUpperCase() !== 'N/A' ? value.trim() : ''

  const rawTipoCliente = cliente.tipo_cliente ?? cliente.id_tipo_cliente ?? null
  const tipoCliente = typeof rawTipoCliente === 'string' ? Number(rawTipoCliente) : rawTipoCliente
  const documentoEmpresa = cliente.documento_empresa
  const esEmpresa =
    tipoCliente === 2 ||
    !!cliente.razon_social?.trim() ||
    !!documentoEmpresa?.trim() ||
    (cliente.apellidos?.trim().toUpperCase() === 'N/A')
  const nombreCompleto = [cleanName(cliente.nombre), cleanName(cliente.apellidos)].filter(Boolean).join(' ').trim()
  const contactoPrincipal = cleanName(cliente.contacto_principal_nombre) || nombreCompleto
  const displayName = cleanName(cliente.display_name)
  const nombreMostrado = esEmpresa
    ? (displayName || cleanName(cliente.razon_social) || contactoPrincipal || 'Empresa')
    : (displayName || nombreCompleto || cleanName(cliente.nombre) || 'Usuario')
  const subtitulo = esEmpresa ? contactoPrincipal : ''
  const inicial = (nombreMostrado || 'U').slice(0, 1).toUpperCase()
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

            <a
              href={getIndustrialQuotationWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Cotización industrial</p>
                <p className="text-xs text-gray-400 truncate">Solicita cotización por WhatsApp</p>
              </div>
            </a>

            <Link
              href={getChatSaraPedidosPath(locale)}
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
              href={getChatSaraCotizacionesPath(locale)}
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
