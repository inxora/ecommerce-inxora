import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Función para construir URL de imagen
const buildImageUrl = (skuProducto: string, imageName: string) => {
  if (!skuProducto || !imageName) return null
  return `https://keeussaqlshdsegerqob.supabase.co/storage/v1/object/public/productos-images/${skuProducto}/${imageName}`
}

// Tipos de datos basados en la estructura de la base de datos
export interface Producto {
  sku: number
  sku_producto: string
  cod_producto_marca: string
  nombre: string
  descripcion_corta: string
  descripcion_detallada: string
  id_categoria: number
  id_marca: number
  id_unidad: number
  id_disponibilidad: number
  requiere_stock: boolean
  stock_minimo: number
  punto_reorden: number
  codigo_arancelario: string
  es_importado: boolean
  tiempo_importacion_dias: number
  imagen_principal_url: string
  galeria_imagenes_urls: string[]
  seo_title: string
  seo_description: string
  seo_keywords: string
  seo_slug: string
  meta_robots: string
  canonical_url: string
  structured_data: any
  seo_score: number
  seo_optimizado: boolean
  tags: string[]
  es_destacado: boolean
  es_novedad: boolean
  es_promocion: boolean
  activo: boolean
  visible_web: boolean
  requiere_aprobacion: boolean
  fecha_creacion: string
  fecha_actualizacion: string
  creado_por: number
  actualizado_por: number
  // Precio principal para compatibilidad con carrito
  precio_venta?: number
  precio_referencia?: number
  moneda?: Moneda
  // Relaciones
  categoria?: Categoria
  marca?: Marca
  unidad?: Unidad
  disponibilidad?: Disponibilidad
  precios?: ProductoPrecio[]
  // Precios procesados por moneda
  precios_por_moneda?: {
    soles?: {
      precio_venta: number
      precio_referencia: number
      moneda: Moneda
    } | null
    dolares?: {
      precio_venta: number
      precio_referencia: number
      moneda: Moneda
    } | null
  }
}

// Nueva interfaz para precios
export interface ProductoPrecio {
  id: number
  sku: number
  id_moneda: number
  precio_venta: number
  margen_aplicado: number
  fecha_vigencia_desde: string
  fecha_vigencia_hasta: string
  activo: boolean
  fecha_creacion: string
  fecha_actualizacion: string
  creado_por: number
  actualizado_por: number
  observaciones: string
  tipo_cambio_usado: number
  precio_proveedor: number
  moneda?: Moneda
}

// Nueva interfaz para moneda
export interface Moneda {
  id: number
  codigo: string
  nombre: string
  simbolo: string
  activo: boolean
  fecha_creacion: string
}

// Nueva interfaz para unidad
export interface Unidad {
  id: number
  nombre: string
  simbolo: string
  descripcion: string
  activo: boolean
  fecha_creacion: string
}

// Nueva interfaz para disponibilidad
export interface Disponibilidad {
  id: number
  nombre: string
  descripcion: string
  activo: boolean
  fecha_creacion: string
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
      cod_producto_marca,
      nombre,
      descripcion_corta,
      imagen_principal_url,
      galeria_imagenes_urls,
      seo_slug,
      es_destacado,
      es_novedad,
      es_promocion,
      tags,
      categoria:id_categoria(id, nombre),
      marca:id_marca(id, nombre, logo_url),
      unidad:id_unidad(id, nombre, simbolo),
      disponibilidad:id_disponibilidad(id, nombre),
      precios:producto_precio_moneda(
        id,
        precio_venta,
        precio_proveedor,
        margen_aplicado,
        fecha_vigencia_desde,
        fecha_vigencia_hasta,
        activo,
        moneda:id_moneda(id, codigo, nombre, simbolo)
      )
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
    .order('es_promocion', { ascending: false })
    .order('fecha_creacion', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (error) {
    console.error('Error fetching productos:', error)
    return { data: [], count: 0, error }
  }

  // Procesar los datos para obtener los precios actuales
  const processedData = data?.map(producto => {
    // Filtrar precios activos y vigentes
    const preciosVigentes = producto.precios?.filter(precio => {
      if (!precio.activo) return false
      
      const hoy = new Date().toISOString().split('T')[0]
      const fechaDesde = precio.fecha_vigencia_desde
      const fechaHasta = precio.fecha_vigencia_hasta
      
      // Verificar que la fecha de inicio sea menor o igual a hoy
      if (fechaDesde && fechaDesde > hoy) return false
      
      // Verificar que la fecha de fin sea null o mayor o igual a hoy
      if (fechaHasta && fechaHasta < hoy) return false
      
      return true
    }) || []
    
    // Separar precios por moneda
    const precioSoles = preciosVigentes.find(p => p.moneda && typeof p.moneda === 'object' && 'codigo' in p.moneda && p.moneda.codigo === 'PEN')
    const precioDolares = preciosVigentes.find(p => p.moneda && typeof p.moneda === 'object' && 'codigo' in p.moneda && p.moneda.codigo === 'USD')
    
    // Priorizar soles, luego dólares
    const precioPrincipal = precioSoles || precioDolares || preciosVigentes[0]
    
    // Usar la URL de imagen principal que ya está en la base de datos
    // Esta URL ya contiene el nombre correcto con timestamp
    let imagenPrincipalUrl = producto.imagen_principal_url
    
    // Para la galería, usar las URLs que ya están en la base de datos
    // Si no hay galería, usar solo la imagen principal
    let galeriaImagenesUrls = producto.galeria_imagenes_urls
    if (!galeriaImagenesUrls || galeriaImagenesUrls.length === 0) {
      galeriaImagenesUrls = imagenPrincipalUrl ? [imagenPrincipalUrl] : []
    }
    
    return {
      ...producto,
      // URLs de imagen procesadas
      imagen_principal_url: imagenPrincipalUrl,
      galeria_imagenes_urls: galeriaImagenesUrls,
      // Precio principal (para compatibilidad)
      precio_venta: precioPrincipal?.precio_venta || 0,
      precio_referencia: precioPrincipal?.precio_proveedor || 0,
      moneda: precioPrincipal?.moneda,
      // Precios por moneda
      precios_por_moneda: {
        soles: precioSoles ? {
          precio_venta: precioSoles.precio_venta,
          precio_referencia: precioSoles.precio_proveedor,
          moneda: precioSoles.moneda
        } : null,
        dolares: precioDolares ? {
          precio_venta: precioDolares.precio_venta,
          precio_referencia: precioDolares.precio_proveedor,
          moneda: precioDolares.moneda
        } : null
      }
    }
  }) || []

  return { data: processedData, count, error: null }
}

export async function getProductBySlug(slug: string): Promise<Producto | null> {
  try {
    console.log('Searching for product with slug:', slug)
    const normalizeProducto = (data: any): Producto => {
      const categoria = Array.isArray(data?.categoria) ? data.categoria[0] : data?.categoria
      const marca = Array.isArray(data?.marca) ? data.marca[0] : data?.marca
      const unidad = Array.isArray(data?.unidad) ? data.unidad[0] : data?.unidad
      const disponibilidad = Array.isArray(data?.disponibilidad) ? data.disponibilidad[0] : data?.disponibilidad
      
      // Obtener el precio actual
      const precioActual = data.precios?.[0]
      
      // Procesar precios por moneda
      const preciosVigentes = data.precios?.filter(precio => {
        if (!precio.activo) return false
        
        const hoy = new Date().toISOString().split('T')[0]
        const fechaDesde = precio.fecha_vigencia_desde
        const fechaHasta = precio.fecha_vigencia_hasta
        
        if (fechaDesde && fechaDesde > hoy) return false
        if (fechaHasta && fechaHasta < hoy) return false
        
        return true
      }) || []
      
      const precioSoles = preciosVigentes.find(p => p.moneda?.codigo === 'PEN')
      const precioDolares = preciosVigentes.find(p => p.moneda?.codigo === 'USD')
      const precioPrincipal = precioSoles || precioDolares || preciosVigentes[0]
      
      return { 
        ...data, 
        categoria, 
        marca, 
        unidad, 
        disponibilidad,
        precio_venta: precioPrincipal?.precio_venta || 0,
        precio_referencia: precioPrincipal?.precio_proveedor || 0,
        moneda: precioPrincipal?.moneda,
        precios_por_moneda: {
          soles: precioSoles ? {
            precio_venta: precioSoles.precio_venta,
            precio_referencia: precioSoles.precio_proveedor,
            moneda: precioSoles.moneda
          } : null,
          dolares: precioDolares ? {
            precio_venta: precioDolares.precio_venta,
            precio_referencia: precioDolares.precio_proveedor,
            moneda: precioDolares.moneda
          } : null
        }
      } as Producto
    }
    
    // First try to find by exact slug match
  let { data, error } = await supabase
    .from('producto')
    .select(`
        sku,
        sku_producto,
        cod_producto_marca,
        nombre,
        descripcion_corta,
        descripcion_detallada,
        id_categoria,
        id_marca,
        id_unidad,
        id_disponibilidad,
        requiere_stock,
        stock_minimo,
        punto_reorden,
        codigo_arancelario,
        es_importado,
        tiempo_importacion_dias,
        imagen_principal_url,
        galeria_imagenes_urls,
        seo_title,
        seo_description,
        seo_keywords,
        seo_slug,
        meta_robots,
        canonical_url,
        structured_data,
        seo_score,
        seo_optimizado,
        tags,
        es_destacado,
        es_novedad,
        es_promocion,
        activo,
        visible_web,
        requiere_aprobacion,
        fecha_creacion,
        fecha_actualizacion,
        creado_por,
        actualizado_por,
        categoria:id_categoria(id, nombre),
        marca:id_marca(id, nombre, logo_url),
        unidad:id_unidad(id, nombre, simbolo),
        disponibilidad:id_disponibilidad(id, nombre),
        precios:producto_precio_moneda(
          id,
          precio_venta,
          margen_aplicado,
          fecha_vigencia_desde,
          fecha_vigencia_hasta,
          activo,
          precio_proveedor,
          moneda:id_moneda(id, codigo, nombre, simbolo)
        )
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
          marca:id_marca(id, nombre, logo_url),
          unidad:id_unidad(id, nombre, simbolo),
          disponibilidad:id_disponibilidad(id, nombre),
          precios:producto_precio_moneda(
            id,
            precio_venta,
            margen_aplicado,
            fecha_vigencia_desde,
            fecha_vigencia_hasta,
            activo,
            precio_proveedor,
            moneda:id_moneda(id, codigo, nombre, simbolo)
          )
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
            marca:id_marca(id, nombre, logo_url),
            unidad:id_unidad(id, nombre, simbolo),
            disponibilidad:id_disponibilidad(id, nombre),
            precios:producto_precio_moneda(
              id,
              precio_venta,
              margen_aplicado,
              fecha_vigencia_desde,
              fecha_vigencia_hasta,
              activo,
              precio_proveedor,
              moneda:id_moneda(id, codigo, nombre, simbolo)
            )
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
            marca:id_marca(id, nombre, logo_url),
            unidad:id_unidad(id, nombre, simbolo),
            disponibilidad:id_disponibilidad(id, nombre),
            precios:producto_precio_moneda(
              id,
              precio_venta,
              margen_aplicado,
              fecha_vigencia_desde,
              fecha_vigencia_hasta,
              activo,
              precio_proveedor,
              moneda:id_moneda(id, codigo, nombre, simbolo)
            )
          `)
          .or(`seo_slug.ilike.%/${last},seo_slug.ilike.%${last}%`)
          .eq('activo', true)
          .eq('visible_web', true)
        searchData = searchData3
        searchError = searchError3
      }

      console.log('Fallback query result:', { count: searchData?.length, error: searchError?.message })

      if (!searchError && searchData && searchData.length > 0) {
        data = [searchData[0] as any]
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
      .from('producto')
      .select(`
        sku,
        sku_producto,
        cod_producto_marca,
        nombre,
        descripcion_corta,
        imagen_principal_url,
        seo_slug,
        es_destacado,
        es_novedad,
        es_promocion,
        tags,
        categoria:id_categoria(id, nombre),
        marca:id_marca(id, nombre, logo_url),
        unidad:id_unidad(id, nombre, simbolo),
        disponibilidad:id_disponibilidad(id, nombre),
        precios:producto_precio_moneda(
          id,
          precio_venta,
          margen_aplicado,
          fecha_vigencia_desde,
          fecha_vigencia_hasta,
          activo,
          precio_proveedor,
          moneda:id_moneda(id, codigo, nombre, simbolo)
        )
      `, { count: 'exact' })
      .eq('activo', true)
      .eq('visible_web', true)
      .eq('precios.activo', true)
      .lte('precios.fecha_vigencia_desde', new Date().toISOString().split('T')[0])
      .or(`precios.fecha_vigencia_hasta.is.null,precios.fecha_vigencia_hasta.gte.${new Date().toISOString().split('T')[0]}`)

    if (categoria) {
      query = query.eq('id_categoria', parseInt(categoria))
    }

    if (marca) {
      query = query.eq('id_marca', parseInt(marca))
    }

    if (buscar) {
      query = query.or(`nombre.ilike.%${buscar}%,descripcion_corta.ilike.%${buscar}%`)
    }

    if (precioMin !== undefined) {
      query = query.gte('precios.precio_venta', precioMin)
    }

    if (precioMax !== undefined) {
      query = query.lte('precios.precio_venta', precioMax)
    }

    if (exclude) {
      query = query.neq('seo_slug', exclude)
    }

    // Ordenamiento
    switch (ordenar) {
      case 'precio_asc':
        query = query.order('precios.precio_venta', { ascending: true })
        break
      case 'precio_desc':
        query = query.order('precios.precio_venta', { ascending: false })
        break
      case 'nombre_desc':
        query = query.order('nombre', { ascending: false })
        break
      case 'destacado':
        query = query.order('es_destacado', { ascending: false })
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

    // Procesar los datos para obtener el precio actual
    const processedData = data?.map(producto => ({
      ...producto,
      precio_venta: producto.precios?.[0]?.precio_venta || 0,
      precio_referencia: producto.precios?.[0]?.precio_proveedor || 0,
      moneda: producto.precios?.[0]?.moneda
    })) || []

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      products: processedData as any,
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
  // Primero intentar obtener productos destacados
  let { data, error } = await supabase
    .from('producto')
    .select(`
      sku,
      sku_producto,
      cod_producto_marca,
      nombre,
      descripcion_corta,
      descripcion_detallada,
      id_categoria,
      id_marca,
      id_unidad,
      id_disponibilidad,
      requiere_stock,
      stock_minimo,
      punto_reorden,
      codigo_arancelario,
      es_importado,
      tiempo_importacion_dias,
      imagen_principal_url,
      galeria_imagenes_urls,
      seo_title,
      seo_description,
      seo_keywords,
      seo_slug,
      meta_robots,
      canonical_url,
      structured_data,
      seo_score,
      seo_optimizado,
      tags,
      es_destacado,
      es_novedad,
      es_promocion,
      activo,
      visible_web,
      requiere_aprobacion,
      fecha_creacion,
      fecha_actualizacion,
      creado_por,
      actualizado_por,
      categoria:id_categoria(id, nombre),
      marca:id_marca(id, nombre, logo_url),
      unidad:id_unidad(id, nombre, simbolo),
      disponibilidad:id_disponibilidad(id, nombre),
      precios:producto_precio_moneda(
        id,
        precio_venta,
        margen_aplicado,
        fecha_vigencia_desde,
        fecha_vigencia_hasta,
        activo,
        precio_proveedor,
        moneda:id_moneda(id, codigo, nombre, simbolo)
      )
    `)
    .eq('activo', true)
    .eq('visible_web', true)
    .eq('es_destacado', true)
    .order('fecha_creacion', { ascending: false })
    .limit(limit)

  // Si no hay productos destacados o hay un error, obtener los últimos productos activos
  if (error || !data || data.length === 0) {
    console.log('No hay productos destacados, obteniendo últimos productos activos')
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('producto')
      .select(`
        sku,
        sku_producto,
        cod_producto_marca,
        nombre,
        descripcion_corta,
        descripcion_detallada,
        id_categoria,
        id_marca,
        id_unidad,
        id_disponibilidad,
        requiere_stock,
        stock_minimo,
        punto_reorden,
        codigo_arancelario,
        es_importado,
        tiempo_importacion_dias,
        imagen_principal_url,
        galeria_imagenes_urls,
        seo_title,
        seo_description,
        seo_keywords,
        seo_slug,
        meta_robots,
        canonical_url,
        structured_data,
        seo_score,
        seo_optimizado,
        tags,
        es_destacado,
        es_novedad,
        es_promocion,
        activo,
        visible_web,
        requiere_aprobacion,
        fecha_creacion,
        fecha_actualizacion,
        creado_por,
        actualizado_por,
        categoria:id_categoria(id, nombre),
        marca:id_marca(id, nombre, logo_url),
        unidad:id_unidad(id, nombre, simbolo),
        disponibilidad:id_disponibilidad(id, nombre),
        precios:producto_precio_moneda(
          id,
          precio_venta,
          margen_aplicado,
          fecha_vigencia_desde,
          fecha_vigencia_hasta,
          activo,
          precio_proveedor,
          moneda:id_moneda(id, codigo, nombre, simbolo)
        )
      `)
      .eq('activo', true)
      .eq('visible_web', true)
      .order('fecha_creacion', { ascending: false })
      .limit(limit)
    
    if (fallbackError) {
      console.error('Error fetching productos:', fallbackError)
      return { data: [], error: fallbackError }
    }
    
    data = fallbackData
    error = null
  }

  if (error) {
    console.error('Error fetching productos destacados:', error)
    return { data: [], error }
  }

  // Procesar los datos para obtener los precios actuales
  const processedData = data?.map(producto => {
    // Filtrar precios activos y vigentes
    const preciosVigentes = producto.precios?.filter(precio => {
      if (!precio.activo) return false
      
      const hoy = new Date().toISOString().split('T')[0]
      const fechaDesde = precio.fecha_vigencia_desde
      const fechaHasta = precio.fecha_vigencia_hasta
      
      // Verificar que la fecha de inicio sea menor o igual a hoy
      if (fechaDesde && fechaDesde > hoy) return false
      
      // Verificar que la fecha de fin sea null o mayor o igual a hoy
      if (fechaHasta && fechaHasta < hoy) return false
      
      return true
    }) || []
    
    // Separar precios por moneda
    const precioSoles = preciosVigentes.find(p => p.moneda && typeof p.moneda === 'object' && 'codigo' in p.moneda && p.moneda.codigo === 'PEN')
    const precioDolares = preciosVigentes.find(p => p.moneda && typeof p.moneda === 'object' && 'codigo' in p.moneda && p.moneda.codigo === 'USD')
    
    // Priorizar soles, luego dólares
    const precioPrincipal = precioSoles || precioDolares || preciosVigentes[0]
    
    return {
      ...producto,
      // Asegurar que los campos requeridos tengan valores por defecto
      descripcion_detallada: producto.descripcion_detallada || '',
      id_categoria: producto.id_categoria || 0,
      id_marca: producto.id_marca || 0,
      id_unidad: producto.id_unidad || 0,
      id_disponibilidad: producto.id_disponibilidad || 0,
      requiere_stock: producto.requiere_stock ?? false,
      stock_minimo: producto.stock_minimo || 0,
      punto_reorden: producto.punto_reorden || 0,
      codigo_arancelario: producto.codigo_arancelario || '',
      es_importado: producto.es_importado ?? false,
      tiempo_importacion_dias: producto.tiempo_importacion_dias || 0,
      galeria_imagenes_urls: producto.galeria_imagenes_urls || [],
      seo_title: producto.seo_title || '',
      seo_description: producto.seo_description || '',
      seo_keywords: producto.seo_keywords || '',
      seo_slug: producto.seo_slug || '',
      meta_robots: producto.meta_robots || '',
      canonical_url: producto.canonical_url || '',
      structured_data: producto.structured_data || null,
      seo_score: producto.seo_score || 0,
      seo_optimizado: producto.seo_optimizado ?? false,
      tags: producto.tags || [],
      activo: producto.activo ?? true,
      visible_web: producto.visible_web ?? true,
      requiere_aprobacion: producto.requiere_aprobacion ?? false,
      fecha_creacion: producto.fecha_creacion || new Date().toISOString(),
      fecha_actualizacion: producto.fecha_actualizacion || new Date().toISOString(),
      creado_por: producto.creado_por || 0,
      actualizado_por: producto.actualizado_por || 0,
      // Precio principal (para compatibilidad)
      precio_venta: precioPrincipal?.precio_venta || 0,
      precio_referencia: precioPrincipal?.precio_proveedor || 0,
      moneda: precioPrincipal?.moneda,
      // Precios por moneda
      precios_por_moneda: {
        soles: precioSoles ? {
          precio_venta: precioSoles.precio_venta,
          precio_referencia: precioSoles.precio_proveedor,
          moneda: precioSoles.moneda
        } : null,
        dolares: precioDolares ? {
          precio_venta: precioDolares.precio_venta,
          precio_referencia: precioDolares.precio_proveedor,
          moneda: precioDolares.moneda
        } : null
      }
    } as Producto
  }) || []

  return { data: processedData, error: null }
}