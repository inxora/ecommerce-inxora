/**
 * Servicio para Ubigeo (Ciudad/Departamento, Provincia, Distrito)
 * Consume /api/ciudad, /api/provincia, /api/distrito
 */

import { api } from '@/lib/api/client'

export interface Ciudad {
  id: number
  nombre: string
  codigo?: string
  id_pais?: number
}

export interface Provincia {
  id: number
  nombre: string
  id_ciudad?: number
}

export interface Distrito {
  id: number
  nombre: string
  id_provincia?: number
  ubigeo?: string
}

export const UbigeoService = {
  /** Obtener ciudades (departamentos) - default Perú id_pais=1 */
  async getCiudades(idPais = 1): Promise<Ciudad[]> {
    const res = await api.get<{ success: boolean; data: Ciudad[] }>(
      '/api/ciudad/',
      { id_pais: idPais, activo: true, limit: 100 }
    )
    return Array.isArray((res as { data?: Ciudad[] }).data) ? (res as { data: Ciudad[] }).data : []
  },

  /** Obtener provincias por ciudad/departamento */
  async getProvinciasByCiudad(ciudadId: number): Promise<Provincia[]> {
    const res = await api.get<{ success: boolean; data: Provincia[] } | Provincia[]>(
      `/api/provincia/ciudad/${ciudadId}`
    )
    if (Array.isArray(res)) return res
    return Array.isArray((res as { data?: Provincia[] }).data) ? (res as { data: Provincia[] }).data : []
  },

  /** Obtener distritos por provincia */
  async getDistritosByProvincia(provinciaId: number): Promise<Distrito[]> {
    const res = await api.get<Distrito[] | { data: Distrito[] }>(
      '/api/distrito/',
      { id_provincia: provinciaId, activo: true, limit: 500 }
    )
    if (Array.isArray(res)) return res
    return Array.isArray((res as { data?: Distrito[] }).data) ? (res as { data: Distrito[] }).data : []
  },

  /** Tarifa plana de envío: provincias con S/ fijo (Lima 1, Callao 11, PROV. CONST. DEL CALLAO 187) */
  async getTarifaPlanaEnvio(): Promise<{ provincia_ids: number[]; costo_envio: number }> {
    const defaultTarifa = { provincia_ids: [1, 11, 187], costo_envio: 20 }
    try {
      const res = await api.get<{ data?: { provincia_ids?: number[]; costo_envio?: number } }>(
        '/api/provincia/tarifa-plana-envio'
      )
      const data = (res as { data?: { provincia_ids?: number[]; costo_envio?: number } }).data
      if (data && Array.isArray(data.provincia_ids) && typeof data.costo_envio === 'number') {
        return { provincia_ids: data.provincia_ids, costo_envio: data.costo_envio }
      }
      return defaultTarifa
    } catch {
      return defaultTarifa
    }
  },
}
