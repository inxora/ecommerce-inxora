import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de datos basados en la estructura de la base de datos
export interface Producto {
  sku: number
  sku_producto: string
  nombre: string
  descripcion_corta: string
  descripcion_detallada: string
  especificaciones_tecnicas: string
  aplicaciones: string
  id_categoria: number
  id_marca: number
  precio_venta: number
  precio_referencia?: number
  stock?: number // Campo opcional con valor por defecto
  imagen_principal_url: string
  galeria_imagenes_urls: string[]
  seo_title: string
  seo_description: string
  seo_keywords: string
  seo_slug: string
  canonical_url: string
  structured_data: any
  tags: string[]
  es_destacado: boolean
  es_novedad: boolean
  activo: boolean
  visible_web: boolean
  fecha_creacion: string
  fecha_actualizacion: string
  // Relaciones
  categoria?: Categoria
  marca?: Marca
}

// Alias para compatibilidad
export type Product = Producto

export interface Categoria {
  id: number
  nombre: string
  descripcion: string
  activo: boolean
  fecha_creacion: string
}

export interface Marca {
  id: number
  codigo: string
  nombre: string
  descripcion: string
  logo_url: string
  sitio_web: string
  pais_origen: string
  activo: boolean
  fecha_creacion: string
}

// Funciones para consultas a la base de datos
export const getProductos = async (
  page = 0,
  limit = 20,
  categoria?: number,
  marca?: number,
  search?: string
) => {
  let query = supabase
    .from('producto')
    .select(`
      sku,
      sku_producto,
      nombre,
      descripcion_corta,
      precio_venta,
      precio_referencia,
      imagen_principal_url,
      seo_slug,
      es_destacado,
      es_novedad,
      categoria:id_categoria(id, nombre),
      marca:id_marca(id, nombre, logo_url)
    `, { count: 'exact' })
    .eq('activo', true)
    .eq('visible_web', true)

  if (categoria) {
    query = query.eq('id_categoria', categoria)
  }

  if (marca) {
    query = query.eq('id_marca', marca)
  }

  if (search) {
    query = query.ilike('nombre', `%${search}%`)
  }

  const { data, error, count } = await query
    .order('es_destacado', { ascending: false })
    .order('fecha_creacion', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (error) {
    console.error('Error fetching productos:', error)
    return { data: [], count: 0, error }
  }

  return { data, count, error: null }
}

export async function getProductBySlug(slug: string): Promise<Producto | null> {
  try {
    console.log('Searching for product with slug:', slug)
    const normalizeProducto = (data: any): Producto => {
      const categoria = Array.isArray(data?.categoria) ? data.categoria[0] : data?.categoria
      const marca = Array.isArray(data?.marca) ? data.marca[0] : data?.marca
      return { ...data, categoria, marca } as Producto
    }
    
    // First try to find by exact slug match
  let { data, error } = await supabase
    .from('producto')
    .select(`
        id_categoria,
        id_marca,
        sku,
        sku_producto,
        nombre,
        descripcion_corta,
        descripcion_detallada,
        especificaciones_tecnicas,
        aplicaciones,
        precio_venta,
        precio_referencia,
        imagen_principal_url,
        galeria_imagenes_urls,
        seo_title,
        seo_description,
        seo_keywords,
        seo_slug,
        canonical_url,
        structured_data,
        tags,
        es_destacado,
        es_novedad,
        activo,
        visible_web,
        fecha_creacion,
        fecha_actualizacion,
        categoria:id_categoria(id, nombre),
        marca:id_marca(id, nombre, logo_url)
      `)
      .eq('seo_slug', slug)
      .eq('activo', true)
      .eq('visible_web', true)

    console.log('First query result:', { count: Array.isArray(data) ? data.length : (data ? 1 : 0), error: error?.message })

    // If not found, try flexible fallback matching nested paths or segment-only slugs
    if (error || (Array.isArray(data) && data.length === 0)) {
      console.log('Trying fallback search for slug:', slug)
      const hasSlash = slug.includes('/')
      const pattern = hasSlash ? `%${slug}%` : `%/${slug}`
      let { data: searchData, error: searchError } = await supabase
        .from('producto')
        .select(`
          id_categoria,
          id_marca,
          sku,
          sku_producto,
          nombre,
          descripcion_corta,
          descripcion_detallada,
          especificaciones_tecnicas,
          aplicaciones,
          precio_venta,
          precio_referencia,
          imagen_principal_url,
          galeria_imagenes_urls,
          seo_title,
          seo_description,
          seo_keywords,
          seo_slug,
          canonical_url,
          structured_data,
          tags,
          es_destacado,
          es_novedad,
          activo,
          visible_web,
          fecha_creacion,
          fecha_actualizacion,
          categoria:id_categoria(id, nombre),
          marca:id_marca(id, nombre, logo_url)
        `)
        .ilike('seo_slug', pattern)
        .eq('activo', true)
        .eq('visible_web', true)

      // If search with `%/segment` returned nothing, broaden to `%segment%`
      if (!hasSlash && (!searchError && (!searchData || searchData.length === 0))) {
        const { data: searchData2, error: searchError2 } = await supabase
          .from('producto')
          .select(`
            id_categoria,
            id_marca,
            sku,
            sku_producto,
            nombre,
            descripcion_corta,
            descripcion_detallada,
            especificaciones_tecnicas,
            aplicaciones,
            precio_venta,
            precio_referencia,
            imagen_principal_url,
            galeria_imagenes_urls,
            seo_title,
            seo_description,
            seo_keywords,
            seo_slug,
            canonical_url,
            structured_data,
            tags,
            es_destacado,
            es_novedad,
            activo,
            visible_web,
            fecha_creacion,
            fecha_actualizacion,
            categoria:id_categoria(id, nombre),
            marca:id_marca(id, nombre, logo_url)
          `)
          .ilike('seo_slug', `%${slug}%`)
          .eq('activo', true)
          .eq('visible_web', true)
        searchData = searchData2
        searchError = searchError2
      }

      // Additional pass: if original slug had multiple segments, try last segment exact or like
      if (hasSlash && (!searchError && (!searchData || searchData.length === 0))) {
        const parts = slug.split('/').filter(Boolean)
        const last = parts[parts.length - 1]
        const { data: searchData3, error: searchError3 } = await supabase
          .from('producto')
          .select(`
            id_categoria,
            id_marca,
            sku,
            sku_producto,
            nombre,
            descripcion_corta,
            descripcion_detallada,
            especificaciones_tecnicas,
            aplicaciones,
            precio_venta,
            precio_referencia,
            imagen_principal_url,
            galeria_imagenes_urls,
            seo_title,
            seo_description,
            seo_keywords,
            seo_slug,
            canonical_url,
            structured_data,
            tags,
            es_destacado,
            es_novedad,
            activo,
            visible_web,
            fecha_creacion,
            fecha_actualizacion,
            categoria:id_categoria(id, nombre),
            marca:id_marca(id, nombre, logo_url)
          `)
          .or(`seo_slug.ilike.%/${last},seo_slug.ilike.%${last}%`)
          .eq('activo', true)
          .eq('visible_web', true)
        searchData = searchData3
        searchError = searchError3
      }

      console.log('Fallback query result:', { count: searchData?.length, error: searchError?.message })

      if (!searchError && searchData && searchData.length > 0) {
        data = [searchData[0]]
        error = null
        console.log('Found product via fallback:', (data as any)?.nombre)
      }
    }

    if (error) {
      console.error('Error fetching product by slug:', error)
      return null
    }

    const first = Array.isArray(data) ? data[0] : data
    return first ? normalizeProducto(first) : null
  } catch (error) {
    console.error('Error in getProductBySlug:', error)
    return null
  }
}

export async function getProducts({
  page = 1,
  limit = 12,
  categoria,
  marca,
  buscar,
  precioMin,
  precioMax,
  ordenar = 'nombre_asc',
  exclude
}: {
  page?: number
  limit?: number
  categoria?: string
  marca?: string
  buscar?: string
  precioMin?: number
  precioMax?: number
  ordenar?: string
  exclude?: string
} = {}): Promise<{
  products: Producto[]
  total: number
  totalPages: number
}> {
  try {
    let query = supabase
      .from('productos')
      .select(`
        *,
        categoria:categorias(id, nombre, slug),
        marca:marcas(id, nombre, slug)
      `, { count: 'exact' })
      .eq('activo', true)

    if (categoria) {
      query = query.eq('categoria.slug', categoria)
    }

    if (marca) {
      query = query.eq('marca.slug', marca)
    }

    if (buscar) {
      query = query.or(`nombre.ilike.%${buscar}%,descripcion.ilike.%${buscar}%`)
    }

    if (precioMin !== undefined) {
      query = query.gte('precio', precioMin)
    }

    if (precioMax !== undefined) {
      query = query.lte('precio', precioMax)
    }

    if (exclude) {
      query = query.neq('slug', exclude)
    }

    // Ordenamiento
    switch (ordenar) {
      case 'precio_asc':
        query = query.order('precio', { ascending: true })
        break
      case 'precio_desc':
        query = query.order('precio', { ascending: false })
        break
      case 'nombre_desc':
        query = query.order('nombre', { ascending: false })
        break
      default:
        query = query.order('nombre', { ascending: true })
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error('Error fetching products:', error)
      return { products: [], total: 0, totalPages: 0 }
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      products: data || [],
      total,
      totalPages
    }
  } catch (error) {
    console.error('Error in getProducts:', error)
    return { products: [], total: 0, totalPages: 0 }
  }
}

export const getCategorias = async () => {
  const { data, error } = await supabase
    .from('categoria')
    .select('*')
    .eq('activo', true)
    .order('nombre')

  if (error) {
    console.error('Error fetching categorias:', error)
    return { data: [], error }
  }

  return { data, error: null }
}

export const getMarcas = async () => {
  const { data, error } = await supabase
    .from('marca')
    .select('*')
    .eq('activo', true)
    .order('nombre')

  if (error) {
    console.error('Error fetching marcas:', error)
    return { data: [], error }
  }

  return { data, error: null }
}

export const getProductosDestacados = async (limit = 8) => {
  const { data, error } = await supabase
    .from('producto')
    .select(`
      sku,
      sku_producto,
      nombre,
      descripcion_corta,
      precio_referencia,
      imagen_principal_url,
      seo_slug,
      categoria:id_categoria(nombre),
      marca:id_marca(nombre, logo_url)
    `)
    .eq('activo', true)
    .eq('visible_web', true)
    .eq('es_destacado', true)
    .order('fecha_creacion', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching productos destacados:', error)
    return { data: [], error }
  }

  return { data, error: null }
}