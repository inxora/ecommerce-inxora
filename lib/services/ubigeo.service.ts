/**
 * Servicio para Ubigeo (Ciudad/Departamento, Provincia, Distrito)
 * Consume /api/ciudad, /api/provincia, /api/distrito
 */

import { api, apiClient } from '@/lib/api/client'

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
    try {
      const res = await apiClient<{ success: boolean; data: Ciudad[] }>(
        '/api/ciudad/',
        { method: 'GET', params: { id_pais: idPais, activo: true, limit: 100 }, timeout: 5000 }
      )
      return Array.isArray((res as { data?: Ciudad[] }).data) ? (res as { data: Ciudad[] }).data : []
    } catch {
      return []
    }
  },

  /** Obtener provincias por ciudad/departamento */
  async getProvinciasByCiudad(ciudadId: number): Promise<Provincia[]> {
    try {
      const res = await apiClient<{ success: boolean; data: Provincia[] } | Provincia[]>(
        `/api/provincia/ciudad/${ciudadId}`,
        { method: 'GET', timeout: 5000 }
      )
      if (Array.isArray(res)) return res
      return Array.isArray((res as { data?: Provincia[] }).data) ? (res as { data: Provincia[] }).data : []
    } catch {
      return []
    }
  },

  /** Obtener distritos por provincia */
  async getDistritosByProvincia(provinciaId: number): Promise<Distrito[]> {
    try {
      const res = await apiClient<Distrito[] | { data: Distrito[] }>(
        '/api/distrito/',
        { method: 'GET', params: { id_provincia: provinciaId, activo: true, limit: 500 }, timeout: 5000 }
      )
      if (Array.isArray(res)) return res
      return Array.isArray((res as { data?: Distrito[] }).data) ? (res as { data: Distrito[] }).data : []
    } catch {
      return []
    }
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
