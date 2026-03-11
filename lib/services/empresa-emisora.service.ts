import { apiClient } from '@/lib/api/client'

export interface EmpresaEmisora {
  id: number
  razon_social?: string | null
  nombre_comercial?: string | null
  direccion: string
  distrito?: string | null
  provincia?: string | null
  ciudad?: string | null
  latitud?: number | null
  longitud?: number | null
  telefono?: string | null
  email?: string | null
  activo?: boolean
}

export const FALLBACK_PICKUP_ADDRESS = 'Av. Óscar R. Benavides 3046, Lima 15081, Perú'
export const FALLBACK_PICKUP_COORDS = {
  lat: -12.0497841,
  lng: -77.0803658,
} as const
export const FALLBACK_PICKUP_MAPS_URL = 'https://www.google.com/maps/place/INXORA/@-12.0496524,-77.0805363,19z/data=!4m12!1m5!3m4!2zMTLCsDAzJzAwLjAiUyA3N8KwMDQnNDguMyJX!8m2!3d-12.05!4d-77.080083!3m5!1s0x9105c9f1ce2026b9:0x90c554afcdbdc128!8m2!3d-12.0497841!4d-77.0803658!16s%2Fg%2F11xvgt6wfx?entry=ttu&g_ep=EgoyMDI2MDMwOC4wIKXMDSoASAFQAw%3D%3D'
const ENDPOINT = '/api/empresas-emisoras'

function normalizeEmpresa(payload: unknown): EmpresaEmisora | null {
  if (!payload) return null

  if (Array.isArray(payload)) {
    const first = payload.find((item) => item && typeof item === 'object' && typeof (item as { direccion?: unknown }).direccion === 'string')
    return first ? (first as EmpresaEmisora) : null
  }

  if (typeof payload === 'object') {
    const data = (payload as { data?: unknown }).data
    if (Array.isArray(data)) {
      const first = data.find((item) => item && typeof item === 'object' && typeof (item as { direccion?: unknown }).direccion === 'string')
      return first ? (first as EmpresaEmisora) : null
    }

    if (data && typeof data === 'object' && typeof (data as { direccion?: unknown }).direccion === 'string') {
      return data as EmpresaEmisora
    }

    if (typeof (payload as { direccion?: unknown }).direccion === 'string') {
      return payload as EmpresaEmisora
    }
  }

  return null
}

export function formatEmpresaEmisoraAddress(empresa: EmpresaEmisora | null | undefined): string {
  if (!empresa) return FALLBACK_PICKUP_ADDRESS

  const direccion = typeof empresa.direccion === 'string' ? empresa.direccion.trim() : ''
  const distrito = typeof empresa.distrito === 'string' ? empresa.distrito.trim() : ''
  const provincia = typeof empresa.provincia === 'string' ? empresa.provincia.trim() : ''
  const ciudad = typeof empresa.ciudad === 'string' ? empresa.ciudad.trim() : ''
  const location = [distrito, provincia, ciudad].filter(Boolean).join(', ')

  if (direccion && location) return `${direccion}, ${location}`
  if (direccion) return direccion

  return FALLBACK_PICKUP_ADDRESS
}

export function getEmpresaEmisoraCoords(empresa: EmpresaEmisora | null | undefined): { lat: number; lng: number } {
  const lat = Number(empresa?.latitud)
  const lng = Number(empresa?.longitud)

  if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) > 0 && Math.abs(lng) > 0) {
    return { lat, lng }
  }

  return FALLBACK_PICKUP_COORDS
}

export const EmpresaEmisoraService = {
  async getEmpresaActiva(): Promise<EmpresaEmisora | null> {
    try {
      const res = await apiClient<unknown>(ENDPOINT, {
        method: 'GET',
        params: { activo: true, limit: 1 },
        timeout: 4000,
      })
      const empresa = normalizeEmpresa(res)
      return empresa?.direccion?.trim() ? empresa : null
    } catch {
      return null
    }
  },
}

