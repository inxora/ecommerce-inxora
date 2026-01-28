/**
 * Datos de categorías y marcas desde el API (arbol-navegacion).
 */

import type { Categoria, Marca } from '@/lib/types'
import { CategoriesService } from '@/lib/services/categories.service'

export async function getCategorias(): Promise<{ data: Categoria[]; error: Error | null }> {
  try {
    const categoriasNavegacion = await CategoriesService.getCategorias()
    const categorias: Categoria[] = categoriasNavegacion.map((cat) => ({
      id: cat.id,
      nombre: cat.nombre,
      descripcion: cat.descripcion || '',
      logo_url: cat.logo_url ?? null,
      activo: cat.activo,
      fecha_creacion: new Date().toISOString(),
    }))
    return { data: categorias, error: null }
  } catch (error) {
    console.error('Exception in getCategorias:', error)
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Error al obtener categorías desde el API'),
    }
  }
}

export async function getMarcas(): Promise<{ data: Marca[]; error: Error | null }> {
  try {
    const categorias = await CategoriesService.getCategorias()
    const marcasMap = new Map<number, Marca>()
    for (const cat of categorias) {
      for (const sub of cat.subcategorias || []) {
        for (const m of sub.marcas || []) {
          if (m?.id && !marcasMap.has(m.id)) {
            marcasMap.set(m.id, {
              id: m.id,
              codigo: m.codigo ?? '',
              nombre: m.nombre,
              descripcion: '',
              logo_url: m.logo_url ?? '',
              sitio_web: '',
              pais_origen: '',
              activo: m.activo,
              fecha_creacion: m.fecha_asociacion ?? new Date().toISOString(),
            })
          }
        }
      }
    }
    return { data: Array.from(marcasMap.values()), error: null }
  } catch (error) {
    console.error('Exception in getMarcas:', error)
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Error al obtener marcas desde el API'),
    }
  }
}

export async function getMarcasByCategoria(categoriaId: number): Promise<Marca[]> {
  try {
    const marcasNavegacion = await CategoriesService.getMarcasByCategoria(categoriaId)
    return marcasNavegacion.map((marca) => ({
      id: marca.id,
      codigo: marca.codigo ?? '',
      nombre: marca.nombre,
      descripcion: '',
      logo_url: marca.logo_url ?? '',
      sitio_web: '',
      pais_origen: '',
      activo: marca.activo,
      fecha_creacion: marca.fecha_asociacion ?? new Date().toISOString(),
    }))
  } catch (error) {
    console.error('Error in getMarcasByCategoria:', error)
    return []
  }
}
