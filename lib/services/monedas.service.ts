import { apiClient } from '@/lib/api/client'

export interface MonedaAPI {
  id: number
  codigo: string
  nombre: string
  simbolo: string
  decimales: number
  tasa_cambio: number
  activo: boolean
  es_principal: boolean
}

interface MonedasResponse {
  success: boolean
  data: MonedaAPI[]
}

export async function getMonedas(): Promise<MonedaAPI[]> {
  const res = await apiClient<MonedasResponse>('/api/monedas', { timeout: 30000 })
  return res.data ?? []
}
