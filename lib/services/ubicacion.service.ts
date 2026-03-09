/**
 * Servicio para buscar/validar ubicación por textos (departamento, provincia, distrito).
 * POST /api/clientes/buscar-ubicacion → ids y ubigeo.
 */

import { api } from '@/lib/api/client'

export interface BuscarUbicacionBody {
  departamento_texto: string
  provincia_texto: string
  distrito_texto?: string
}

export interface BuscarUbicacionResponse {
  id_ciudad?: number
  id_provincia?: number
  id_distrito?: number
  ubigeo?: string
  direccion?: string
}

export const UbicacionService = {
  /**
   * Obtiene ids y ubigeo a partir de nombres (departamento, provincia, distrito).
   * Útil para rellenar/confirmar IDs o después de reverse geocode.
   */
  async buscarUbicacion(body: BuscarUbicacionBody): Promise<BuscarUbicacionResponse> {
    const res = await api.post<{ data?: BuscarUbicacionResponse } | BuscarUbicacionResponse>(
      '/api/clientes/buscar-ubicacion',
      body
    )
    const data = (res as { data?: BuscarUbicacionResponse }).data ?? res
    return (data as BuscarUbicacionResponse) ?? {}
  },
}
