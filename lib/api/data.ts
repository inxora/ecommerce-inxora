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

/** Normaliza nombre a slug para URL (igual que product-url) */
function normalizeName(name: string | undefined | null): string | undefined {
  if (!name || typeof name !== 'string') return undefined
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Resuelve un slug de marca (ej. "lenovo", "ridgid") al objeto Marca.
 * 1) Coincidencia exacta del slug normalizado con el nombre normalizado.
 * 2) Si no hay exacta: coincidencia donde el slug normalizado está contenido en el nombre normalizado (ej. "3m" en "3m").
 * 3) Coincidencia sin guiones internos (ej. "ridgid" con "RIDGID").
 */
export async function getMarcaBySlug(slug: string): Promise<Marca | null> {
  if (!slug || !slug.trim()) return null
  const slugNorm = normalizeName(slug) || ''
  if (!slugNorm) return null
  const { data: marcas } = await getMarcas()
  if (!marcas?.length) return null

  const slugNormCompact = slugNorm.replace(/-/g, '')

  const exact = marcas.find((m) => normalizeName(m.nombre) === slugNorm)
  if (exact) return exact

  const byCompact = marcas.find((m) => {
    const nameNorm = normalizeName(m.nombre) || ''
    const nameCompact = nameNorm.replace(/-/g, '')
    return nameCompact === slugNormCompact || slugNormCompact === nameCompact
  })
  if (byCompact) return byCompact

  const byContains = marcas.find((m) => {
    const nameNorm = normalizeName(m.nombre) || ''
    return nameNorm === slugNorm || nameNorm.includes(slugNorm) || slugNorm.includes(nameNorm)
  })
  return byContains ?? null
}
