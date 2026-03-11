import { apiClient } from '@/lib/api/client'

export interface TipoLugarEntrega {
  id: number
  nombre: string
  codigo?: string | null
  descripcion?: string | null
  activo?: boolean
}

const ENDPOINTS = [
  '/api/tipo-lugar-entrega/',
  '/api/tipos-lugar-entrega/',
] as const

function normalizeItems(payload: unknown): TipoLugarEntrega[] {
  if (Array.isArray(payload)) return payload as TipoLugarEntrega[]

  if (payload && typeof payload === 'object') {
    const data = (payload as { data?: unknown }).data
    if (Array.isArray(data)) return data as TipoLugarEntrega[]
  }

  return []
}

export const TipoLugarEntregaService = {
  async getTiposLugarEntrega(): Promise<TipoLugarEntrega[]> {
    for (const endpoint of ENDPOINTS) {
      try {
        const res = await apiClient<{ data?: TipoLugarEntrega[] } | TipoLugarEntrega[]>(
          endpoint,
          { method: 'GET', params: { activo: true, limit: 100 }, timeout: 4000 }
        )
        const items = normalizeItems(res)
          .filter((item) => item && typeof item.id === 'number' && typeof item.nombre === 'string')
          .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

        if (items.length > 0) return items
      } catch {
        // Intentar siguiente endpoint compatible
      }
    }

    return []
  },
}

