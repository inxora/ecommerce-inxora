import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { cache } from 'react'

// Variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validar variables de entorno
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

// Instancias singleton del cliente
let supabaseClientInstance: SupabaseClient | null = null
let supabaseAdminInstance: SupabaseClient | null = null

/**
 * Obtiene la instancia singleton del cliente público de Supabase
 * Reutiliza la misma instancia en toda la aplicación para evitar múltiples conexiones
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClientInstance) {
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // No persistir sesión en server-side
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-client-info': 'inxora-ecommerce',
        },
        // Timeout de 30 segundos para evitar que queries se cuelguen
        fetch: (url, options = {}) => {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos timeout
          
          return fetch(url, {
            ...options,
            signal: controller.signal,
          }).finally(() => {
            clearTimeout(timeoutId)
          })
        },
      },
    })
  }
  return supabaseClientInstance
}

/**
 * Obtiene la instancia singleton del cliente admin de Supabase
 * Solo disponible en server-side y requiere SUPABASE_SERVICE_ROLE_KEY
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseServiceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for admin operations but is not set'
    )
  }
  
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  }
  return supabaseAdminInstance
}

// Mantener compatibilidad temporal con exportación anterior (deprecated)
// TODO: Eliminar después de migrar todos los imports
/** @deprecated Use getSupabaseClient() instead */
export const supabase = getSupabaseClient()

// Función para construir URL de imagen de producto
const buildImageUrl = (skuProducto: string, imageName: string) => {
  if (!skuProducto || !imageName) return null
  // Validar que el nombre de imagen no contenga caracteres peligrosos
  if (imageName.includes('..') || imageName.includes('//')) return null
  return `https://keeussaqlshdsegerqob.supabase.co/storage/v1/object/public/productos-images/${skuProducto}/${imageName}`
}

// Función helper para construir o validar URL de imagen de producto
// Ahora incluye validación básica para evitar URLs malformadas
export const buildProductImageUrl = (imageUrl: string | null | undefined, skuProducto?: string): string | null => {
  if (!imageUrl || (typeof imageUrl === 'string' && imageUrl.trim() === '')) {
    return null
  }
  
  let urlString = typeof imageUrl === 'string' ? imageUrl.trim() : String(imageUrl).trim()
  
  // Validar que la URL no esté vacía después del trim
  if (urlString.length === 0) {
    return null
  }
  
  // Si ya es una URL completa de Supabase, aceptarla directamente (caso más común)
  if (urlString.startsWith('https://') && urlString.includes('supabase.co') && urlString.includes('/storage/v1/object/public/')) {
    // Solo validar que no tenga caracteres peligrosos en el path
    if (!urlString.includes('<script') && !urlString.includes('javascript:') && !urlString.includes('data:')) {
      return urlString
    }
  }
  
  // Limpiar solo espacios al inicio y final, no todos los espacios (pueden ser parte de la URL)
  urlString = urlString.trim()
  
  // Validar que no contenga caracteres peligrosos
  const hasProtocol = urlString.startsWith('http://') || urlString.startsWith('https://')
  
  // Solo validar path traversal si no es parte de una URL con protocolo
  const hasPathTraversal = !hasProtocol && (urlString.includes('../') || urlString.includes('..\\'))
  
  // Permitir // solo en protocolos http:// o https://
  const hasDoubleSlash = !hasProtocol && urlString.includes('//')
  
  const hasScriptTag = urlString.toLowerCase().includes('<script')
  const hasJavascript = urlString.toLowerCase().includes('javascript:')
  const hasDataUrl = urlString.toLowerCase().includes('data:')
  
  if (hasPathTraversal || hasDoubleSlash || hasScriptTag || hasJavascript || hasDataUrl) {
    console.warn('URL de imagen inválida detectada:', urlString)
    return null
  }
  
  // Si ya es una URL completa, validar que sea de Supabase
  if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
    // Solo permitir URLs de Supabase para seguridad
    if (urlString.includes('supabase.co')) {
      return urlString
    }
    // Si es otra URL, retornar null por seguridad
    console.warn('URL de imagen no es de Supabase:', urlString)
    return null
  }
  
  // Si es una ruta relativa que empieza con /, construir la URL completa desde Supabase
  if (urlString.startsWith('/')) {
    // Remover el / inicial y construir la URL
    const path = urlString.substring(1)
    // Validar que el path no esté vacío
    if (path.length === 0) return null
    return `https://keeussaqlshdsegerqob.supabase.co/storage/v1/object/public/${path}`
  }
  
  // Si es solo un nombre de archivo y tenemos sku_producto, construir la URL completa
  if (skuProducto && !urlString.includes('/') && !urlString.includes('\\')) {
    return buildImageUrl(skuProducto, urlString)
  }
  
  // Si contiene el path completo del bucket pero sin el dominio, agregarlo
  if (urlString.includes('productos-images/') && !urlString.startsWith('http')) {
    return `https://keeussaqlshdsegerqob.supabase.co/storage/v1/object/public/${urlString}`
  }
  
  // Si no podemos construir la URL, retornar null
  return null
}

// Función para construir URL de imagen de marca
export const buildBrandLogoUrl = (fileName: string | null | undefined): string | null => {
  if (!fileName) return null
  // Si ya es una URL completa, retornarla tal cual
  if (fileName.startsWith('http')) return fileName
  // Construir URL desde el bucket de marcas
  return `https://keeussaqlshdsegerqob.supabase.co/storage/v1/object/public/marcas-images/${fileName}`
}

// Tipos de datos basados en la estructura de la base de datos
export interface Producto {
  sku: number
  sku_producto: string
  cod_producto_marca: string
  nombre: string
  descripcion_corta: string
  descripcion_detallada: string
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
  categorias?: Categoria[] // Cambiado a array para múltiples categorías
  categoria?: Categoria // Mantenido para compatibilidad (primera categoría)
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
  logo_url?: string | null
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
  categoria?: number | number[],
  marca?: number | number[],
  search?: string
) => {
  // Si hay filtro de categoría, primero obtener los SKUs de productos que tienen esas categorías
  let productSkus: number[] | null = null
  if (categoria) {
    const categoriaIds = Array.isArray(categoria) ? categoria : [categoria]
    
    const supabase = getSupabaseClient()
    const { data: productoCategoriaData, error: pcError } = await supabase
      .from('producto_categoria')
      .select('sku')
      .in('id_categoria', categoriaIds)
      .eq('activo', true)
      .limit(10000) // Límite razonable para evitar queries muy grandes
    
    if (pcError) {
      console.error('Error fetching producto_categoria:', pcError)
      return { data: [], count: 0, error: pcError }
    }
    
    const skuSet = new Set((productoCategoriaData || []).map((pc: any) => pc.sku))
    productSkus = Array.from(skuSet)
    
    if (productSkus.length === 0) {
      return { data: [], count: 0, error: null }
    }
  }

  const supabase = getSupabaseClient()
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
      categorias:producto_categoria(id_categoria, categoria:categoria(id, nombre)),
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

  // Filtrar por SKUs si hay filtro de categoría
  if (productSkus && productSkus.length > 0) {
    query = query.in('sku', productSkus)
  }

  if (marca) {
    if (Array.isArray(marca)) {
      if (marca.length > 0) {
        query = query.in('id_marca', marca)
      }
    } else {
      query = query.eq('id_marca', marca)
    }
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
    // Normalizar categorías (pueden venir como array de relaciones)
    let categorias: Categoria[] = []
    if (producto.categorias) {
      if (Array.isArray(producto.categorias)) {
        categorias = producto.categorias
          .map((pc: any) => pc?.categoria)
          .filter((cat: any) => cat != null)
      } else if (producto.categorias && typeof producto.categorias === 'object' && 'categoria' in producto.categorias) {
        const cat = (producto.categorias as any).categoria
        if (cat) {
          categorias = [cat as Categoria]
        }
      }
    }
    // Mantener compatibilidad con categoria (primera categoría)
    const categoria = categorias.length > 0 ? categorias[0] : undefined
    
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
    
    // Procesar URL de imagen principal usando buildProductImageUrl
    const imagenPrincipalUrl = buildProductImageUrl(producto.imagen_principal_url, producto.sku_producto) || ''
    
    // Procesar galería de imágenes
    let galeriaImagenesUrls: string[] = []
    if (Array.isArray(producto.galeria_imagenes_urls)) {
      galeriaImagenesUrls = producto.galeria_imagenes_urls
        .map(url => buildProductImageUrl(url, producto.sku_producto))
        .filter((url): url is string => url !== null)
    }
    
    // Si no hay galería, usar solo la imagen principal
    if (galeriaImagenesUrls.length === 0 && imagenPrincipalUrl) {
      galeriaImagenesUrls = [imagenPrincipalUrl]
    }
    
    return {
      ...producto,
      categorias,
      categoria,
      // URLs de imagen procesadas (sobrescribir las del spread)
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

// Función interna cacheada para evitar queries duplicadas
const getProductBySlugInternal = cache(async (slug: string): Promise<Producto | null> => {
  try {
    // Solo loggear en desarrollo y reducir verbosidad
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Searching for product with slug:', slug)
    }
    const normalizeProducto = (data: any): Producto => {
      // Normalizar categorías (pueden venir como array de relaciones)
      let categorias: Categoria[] = []
      if (data?.categorias) {
        if (Array.isArray(data.categorias)) {
          categorias = data.categorias
            .map((pc: any) => pc?.categoria)
            .filter((cat: any) => cat != null)
        } else if (data.categorias && typeof data.categorias === 'object' && 'categoria' in data.categorias) {
          categorias = [data.categorias.categoria as Categoria]
        }
      }
      // Mantener compatibilidad con categoria (primera categoría o la antigua)
      const categoria = categorias.length > 0 
        ? categorias[0] 
        : (Array.isArray(data?.categoria) ? data.categoria[0] : data?.categoria)
      
      const marca = Array.isArray(data?.marca) ? data.marca[0] : data?.marca
      const unidad = Array.isArray(data?.unidad) ? data.unidad[0] : data?.unidad
      const disponibilidad = Array.isArray(data?.disponibilidad) ? data.disponibilidad[0] : data?.disponibilidad
      
      // Normalizar monedas en los precios (pueden venir como arrays)
      const preciosNormalizados = (data.precios || []).map(precio => ({
        ...precio,
        moneda: Array.isArray(precio.moneda) ? precio.moneda[0] : precio.moneda
      }))
      
      // Procesar precios por moneda
      const preciosVigentes = preciosNormalizados.filter(precio => {
        if (!precio.activo) return false
        
        const hoy = new Date().toISOString().split('T')[0]
        const fechaDesde = precio.fecha_vigencia_desde
        const fechaHasta = precio.fecha_vigencia_hasta
        
        if (fechaDesde && fechaDesde > hoy) return false
        if (fechaHasta && fechaHasta < hoy) return false
        
        return true
      })
      
      const precioSoles = preciosVigentes.find(p => {
        const moneda = p.moneda
        return moneda && typeof moneda === 'object' && 'codigo' in moneda && moneda.codigo === 'PEN'
      })
      const precioDolares = preciosVigentes.find(p => {
        const moneda = p.moneda
        return moneda && typeof moneda === 'object' && 'codigo' in moneda && moneda.codigo === 'USD'
      })
      const precioPrincipal = precioSoles || precioDolares || preciosVigentes[0]
      
      // Procesar URL de imagen principal
      const imagenPrincipalUrl = buildProductImageUrl(data.imagen_principal_url, data.sku_producto) || ''
      
      // Procesar galería de imágenes
      let galeriaImagenesUrls: string[] = []
      if (Array.isArray(data.galeria_imagenes_urls)) {
        galeriaImagenesUrls = data.galeria_imagenes_urls
          .map(url => buildProductImageUrl(url, data.sku_producto))
          .filter((url): url is string => url !== null)
      }
      
      return { 
        ...data, 
        categorias,
        categoria, // Mantener para compatibilidad
        marca, 
        unidad, 
        disponibilidad,
        // URLs de imagen procesadas
        imagen_principal_url: imagenPrincipalUrl,
        galeria_imagenes_urls: galeriaImagenesUrls,
        precio_venta: precioPrincipal?.precio_venta || 0,
        precio_referencia: precioPrincipal?.precio_proveedor || 0,
        moneda: precioPrincipal?.moneda || undefined,
        // Precios procesados con monedas normalizadas
        precios: preciosNormalizados,
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
    const supabase = getSupabaseClient()
  let { data, error } = await supabase
    .from('producto')
    .select(`
        sku,
        sku_producto,
        cod_producto_marca,
        nombre,
        descripcion_corta,
        descripcion_detallada,
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
        categorias:producto_categoria(id_categoria, categoria:categoria(id, nombre)),
        marca:id_marca(id, nombre, logo_url),
        unidad:id_unidad(id, nombre, simbolo),
        disponibilidad:id_disponibilidad(id, nombre, descripcion),
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

    // Reducir logging - solo en desarrollo y si hay error
    if (process.env.NODE_ENV === 'development' && error) {
      // Reducir logging - solo en desarrollo y si hay error
    if (process.env.NODE_ENV === 'development' && error) {
    console.log('First query result:', { count: Array.isArray(data) ? data.length : (data ? 1 : 0), error: error?.message })
    }
    }

    // If not found, try flexible fallback matching nested paths or segment-only slugs
    if (error || (Array.isArray(data) && data.length === 0)) {
      // Reducir logging - solo en desarrollo
      if (process.env.NODE_ENV === 'development') {
      console.log('Trying fallback search for slug:', slug)
      }
      const hasSlash = slug.includes('/')
      const pattern = hasSlash ? `%${slug}%` : `%/${slug}`
      const supabaseFallback = getSupabaseClient()
      let { data: searchData, error: searchError } = await supabaseFallback
        .from('producto')
        .select(`
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
          categorias:producto_categoria(id_categoria, categoria:categoria(id, nombre)),
          marca:id_marca(id, nombre, logo_url),
          unidad:id_unidad(id, nombre, simbolo),
          disponibilidad:id_disponibilidad(id, nombre, descripcion),
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
        const supabaseFallback2 = getSupabaseClient()
        const { data: searchData2, error: searchError2 } = await supabaseFallback2
          .from('producto')
          .select(`
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
            categorias:producto_categoria(id_categoria, categoria:categoria(id, nombre)),
            marca:id_marca(id, nombre, logo_url),
            unidad:id_unidad(id, nombre, simbolo),
            disponibilidad:id_disponibilidad(id, nombre, descripcion),
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
        const supabaseFallback3 = getSupabaseClient()
        const { data: searchData3, error: searchError3 } = await supabaseFallback3
          .from('producto')
          .select(`
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
            categorias:producto_categoria(id_categoria, categoria:categoria(id, nombre)),
            marca:id_marca(id, nombre, logo_url),
            unidad:id_unidad(id, nombre, simbolo),
            disponibilidad:id_disponibilidad(id, nombre, descripcion),
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

      // Reducir logging - solo en desarrollo
      if (process.env.NODE_ENV === 'development') {
      console.log('Fallback query result:', { count: searchData?.length, error: searchError?.message })
      }

      if (!searchError && searchData && searchData.length > 0) {
        data = [searchData[0] as any]
        error = null
        if (process.env.NODE_ENV === 'development') {
        console.log('Found product via fallback:', (data as any)?.nombre)
        }
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
})

// Exportar función pública que usa la versión cacheada
export async function getProductBySlug(slug: string): Promise<Producto | null> {
  return getProductBySlugInternal(slug)
}

export async function getProductBySku(sku: number): Promise<Producto | null> {
  try {
    // Reutilizar la función normalizeProducto de getProductBySlug
    const normalizeProducto = (data: any): Producto => {
      // Normalizar categorías (pueden venir como array de relaciones)
      let categorias: Categoria[] = []
      if (data?.categorias) {
        if (Array.isArray(data.categorias)) {
          categorias = data.categorias
            .map((pc: any) => pc?.categoria)
            .filter((cat: any) => cat != null)
        } else if (data.categorias.categoria) {
          categorias = [data.categorias.categoria]
        }
      }
      // Mantener compatibilidad con categoria (primera categoría)
      const categoria = categorias.length > 0 ? categorias[0] : undefined
      
      const marca = Array.isArray(data?.marca) ? data.marca[0] : data?.marca
      const unidad = Array.isArray(data?.unidad) ? data.unidad[0] : data?.unidad
      const disponibilidad = Array.isArray(data?.disponibilidad) ? data.disponibilidad[0] : data?.disponibilidad
      
      // Normalizar monedas en los precios (pueden venir como arrays)
      const preciosNormalizados = (data.precios || []).map(precio => ({
        ...precio,
        moneda: Array.isArray(precio.moneda) ? precio.moneda[0] : precio.moneda
      }))
      
      // Procesar precios por moneda
      const preciosVigentes = preciosNormalizados.filter(precio => {
        if (!precio.activo) return false
        
        const hoy = new Date().toISOString().split('T')[0]
        const fechaDesde = precio.fecha_vigencia_desde
        const fechaHasta = precio.fecha_vigencia_hasta
        
        if (fechaDesde && fechaDesde > hoy) return false
        if (fechaHasta && fechaHasta < hoy) return false
        
        return true
      })
      
      const precioSoles = preciosVigentes.find(p => {
        const moneda = p.moneda
        return moneda && typeof moneda === 'object' && 'codigo' in moneda && moneda.codigo === 'PEN'
      })
      const precioDolares = preciosVigentes.find(p => {
        const moneda = p.moneda
        return moneda && typeof moneda === 'object' && 'codigo' in moneda && moneda.codigo === 'USD'
      })
      const precioPrincipal = precioSoles || precioDolares || preciosVigentes[0]
      
      // Procesar URL de imagen principal
      const imagenPrincipalUrl = buildProductImageUrl(data.imagen_principal_url, data.sku_producto) || ''
      
      // Procesar galería de imágenes
      let galeriaImagenesUrls: string[] = []
      if (Array.isArray(data.galeria_imagenes_urls)) {
        galeriaImagenesUrls = data.galeria_imagenes_urls
          .map(url => buildProductImageUrl(url, data.sku_producto))
          .filter((url): url is string => url !== null)
      }
      
      return { 
        ...data, 
        categorias,
        categoria, // Mantener para compatibilidad
        marca, 
        unidad, 
        disponibilidad,
        // URLs de imagen procesadas
        imagen_principal_url: imagenPrincipalUrl,
        galeria_imagenes_urls: galeriaImagenesUrls,
        precio_venta: precioPrincipal?.precio_venta || 0,
        precio_referencia: precioPrincipal?.precio_proveedor || 0,
        moneda: precioPrincipal?.moneda || undefined,
        precios: preciosNormalizados,
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

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('producto')
      .select(`
        sku,
        sku_producto,
        cod_producto_marca,
        nombre,
        descripcion_corta,
        descripcion_detallada,
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
        categorias:producto_categoria(id_categoria, categoria:categoria(id, nombre)),
        marca:id_marca(id, nombre, logo_url),
        unidad:id_unidad(id, nombre, simbolo),
        disponibilidad:id_disponibilidad(id, nombre, descripcion),
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
      .eq('sku', sku)
      .eq('activo', true)
      .eq('visible_web', true)
      .single()

    if (error) {
      console.error('Error fetching product by SKU:', error)
      return null
    }

    if (!data) {
      return null
    }

    return normalizeProducto(data)
  } catch (error) {
    console.error('Error in getProductBySku:', error)
    return null
  }
}

export async function getProducts({
  page = 1,
  limit = 50,
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
  categoria?: string | string[]
  marca?: string | string[]
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
    // Si hay filtro de categoría, obtener los SKUs de forma optimizada
    let productSkus: number[] | null = null
    let totalCategoriaProducts = 0
    
    if (categoria) {
      const categoriaIds = Array.isArray(categoria) 
        ? categoria.map(c => parseInt(c)).filter(id => !isNaN(id))
        : [parseInt(categoria)].filter(id => !isNaN(id))
      
      if (categoriaIds.length > 0) {
        try {
          const supabase = getSupabaseClient()
          // Primero obtener el count total para calcular páginas
          const { count: categoriaCount, error: countError } = await supabase
            .from('producto_categoria')
            .select('sku', { count: 'exact', head: true })
            .in('id_categoria', categoriaIds)
            .eq('activo', true)
          
          if (countError) {
            console.error('Error counting producto_categoria:', countError)
            return { products: [], total: 0, totalPages: 0 }
          }
          
          totalCategoriaProducts = categoriaCount || 0
          
          if (totalCategoriaProducts === 0) {
            return { products: [], total: 0, totalPages: 0 }
          }
          
          // Obtener todos los SKUs únicos de productos en estas categorías
          // Usamos una consulta optimizada que solo obtiene los SKUs únicos
          const { data: productoCategoriaData, error: pcError } = await supabase
            .from('producto_categoria')
            .select('sku')
            .in('id_categoria', categoriaIds)
            .eq('activo', true)
            .limit(10000) // Límite razonable para evitar queries muy grandes
          
          if (pcError) {
            console.error('Error fetching producto_categoria:', pcError)
            return { products: [], total: 0, totalPages: 0 }
          }
          
          const skuSet = new Set((productoCategoriaData || []).map((pc: any) => pc.sku))
          productSkus = Array.from(skuSet)
          
          if (productSkus.length === 0) {
            return { products: [], total: 0, totalPages: 0 }
          }
        } catch (error) {
          console.error('Exception fetching producto_categoria:', error)
          return { products: [], total: 0, totalPages: 0 }
        }
      }
    }

    const supabase = getSupabaseClient()
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
        categorias:producto_categoria(id_categoria, categoria:categoria(id, nombre)),
        marca:id_marca(id, nombre, logo_url),
        unidad:id_unidad(id, nombre, simbolo),
        disponibilidad:id_disponibilidad(id, nombre, descripcion),
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

    // Filtrar por SKUs si hay filtro de categoría
    // Supabase permite hasta cierto límite en .in(), pero si hay muchos SKUs,
    // podemos dividirlos en chunks si es necesario
    if (productSkus && productSkus.length > 0) {
      // Supabase generalmente maneja bien arrays grandes, pero si hay problemas
      // podemos dividir en chunks de 1000
      if (productSkus.length > 1000) {
        // Dividir en chunks y usar el chunk apropiado para la página
        const chunkSize = 1000
        const chunkIndex = Math.floor((page - 1) * limit / chunkSize)
        const startIdx = chunkIndex * chunkSize
        const endIdx = Math.min(startIdx + chunkSize, productSkus.length)
        const currentChunk = productSkus.slice(startIdx, endIdx)
        query = query.in('sku', currentChunk)
      } else {
        query = query.in('sku', productSkus)
      }
    }

    if (marca) {
      // Handle both single value and array
      if (Array.isArray(marca)) {
        const marcaIds = marca.map(m => parseInt(m)).filter(id => !isNaN(id))
        if (marcaIds.length > 0) {
          query = query.in('id_marca', marcaIds)
        }
      } else {
        const marcaId = parseInt(marca)
        if (!isNaN(marcaId)) {
          query = query.eq('id_marca', marcaId)
        }
      }
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

    // Validar que el rango sea válido para evitar errores
    if (from < 0 || to < from) {
      console.error('Invalid range for products query:', { from, to, page, limit })
      return { products: [], total: 0, totalPages: 0 }
    }

    let data, error, count
    try {
      const result = await query.range(from, to)
      data = result.data
      error = result.error
      count = result.count
    } catch (queryError) {
      console.error('Exception in products query:', queryError)
      return { products: [], total: 0, totalPages: 0 }
    }

    if (error) {
      console.error('Error fetching products:', error)
      return { products: [], total: 0, totalPages: 0 }
    }

    // Procesar los datos para obtener el precio actual
    const processedData = data?.map(producto => {
      // Normalizar categorías (pueden venir como array de relaciones)
      let categorias: Categoria[] = []
      if (producto.categorias) {
        if (Array.isArray(producto.categorias)) {
          categorias = producto.categorias
            .map((pc: any) => pc?.categoria)
            .filter((cat: any) => cat != null)
        } else if (producto.categorias.categoria) {
          categorias = [producto.categorias.categoria]
        }
      }
      // Mantener compatibilidad con categoria (primera categoría)
      const categoria = categorias.length > 0 ? categorias[0] : undefined
      
      // Filtrar precios activos y vigentes
      const preciosVigentes = producto.precios?.filter(precio => {
        if (!precio.activo) return false
        
        const hoy = new Date().toISOString().split('T')[0]
        const fechaDesde = precio.fecha_vigencia_desde
        const fechaHasta = precio.fecha_vigencia_hasta
        
        if (fechaDesde && fechaDesde > hoy) return false
        if (fechaHasta && fechaHasta < hoy) return false
        
        return true
      }) || []
      
      // Separar precios por moneda
      const precioSoles = preciosVigentes.find(p => p.moneda && typeof p.moneda === 'object' && 'codigo' in p.moneda && p.moneda.codigo === 'PEN')
      const precioDolares = preciosVigentes.find(p => p.moneda && typeof p.moneda === 'object' && 'codigo' in p.moneda && p.moneda.codigo === 'USD')
      
      // Priorizar soles, luego dólares
      const precioPrincipal = precioSoles || precioDolares || preciosVigentes[0]
      
      // Procesar URL de imagen principal
      const imagenPrincipalUrl = buildProductImageUrl(producto.imagen_principal_url, producto.sku_producto) || ''
      
      // Procesar galería de imágenes
      let galeriaImagenesUrls: string[] = []
      if (Array.isArray(producto.galeria_imagenes_urls)) {
        galeriaImagenesUrls = producto.galeria_imagenes_urls
          .map(url => buildProductImageUrl(url, producto.sku_producto))
          .filter((url): url is string => url !== null)
      }
      
      return {
        ...producto,
        categorias,
        categoria, // Mantener para compatibilidad
        imagen_principal_url: imagenPrincipalUrl,
        galeria_imagenes_urls: galeriaImagenesUrls,
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
      }
    }) || []

    // Calcular el total: si solo hay filtro de categoría (sin otros filtros),
    // podemos usar el count de producto_categoria. Si hay otros filtros,
    // debemos usar el count de la consulta principal que ya aplica todos los filtros
    const hasOtherFilters = !!(marca || buscar || precioMin !== undefined || precioMax !== undefined)
    const total = (totalCategoriaProducts > 0 && !hasOtherFilters)
      ? totalCategoriaProducts 
      : (count || 0)
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
  try {
    const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('categoria')
    .select('*')
    .eq('activo', true)
    .order('nombre')
      .limit(500) // Límite razonable (normalmente no hay más de 500 categorías)

  if (error) {
    console.error('Error fetching categorias:', error)
      throw new Error(`Error al obtener categorías: ${error.message}`)
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Exception in getCategorias:', error)
    return { data: [], error: error instanceof Error ? error : new Error('Error desconocido') }
  }
}

export const getMarcas = async () => {
  try {
    const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('marca')
    .select('*')
    .eq('activo', true)
    .order('nombre')
      .limit(500) // Límite razonable (normalmente no hay más de 500 marcas)

  if (error) {
    console.error('Error fetching marcas:', error)
      throw new Error(`Error al obtener marcas: ${error.message}`)
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Exception in getMarcas:', error)
    return { data: [], error: error instanceof Error ? error : new Error('Error desconocido') }
  }
}

/**
 * Obtiene las marcas relacionadas con una categoría específica
 * de forma optimizada, consultando directamente las relaciones sin necesidad
 * de traer todos los productos
 */
export const getMarcasByCategoria = async (categoriaId: number): Promise<Marca[]> => {
  try {
    const supabase = getSupabaseClient()
    // Primero obtener los SKUs únicos de productos en esta categoría
    const { data: productoCategoriaData, error: pcError } = await supabase
      .from('producto_categoria')
      .select('sku')
      .eq('id_categoria', categoriaId)
      .eq('activo', true)
      .limit(10000) // Límite razonable para evitar queries muy grandes
    
    if (pcError) {
      console.error('Error fetching producto_categoria:', pcError)
      return []
    }
    
    if (!productoCategoriaData || productoCategoriaData.length === 0) {
      return []
    }
    
    const skuSet = new Set(productoCategoriaData.map((pc: any) => pc.sku))
    const productSkus = Array.from(skuSet)
    
    if (productSkus.length === 0) {
      return []
    }
    
    // Obtener solo los id_marca únicos de los productos en esta categoría
    // Usamos una consulta optimizada que solo trae id_marca
    const { data: productosData, error: productosError } = await supabase
      .from('producto')
      .select('id_marca')
      .in('sku', productSkus)
      .eq('activo', true)
      .eq('visible_web', true)
    
    if (productosError || !productosData) {
      console.error('Error fetching productos for marcas:', productosError)
      return []
    }
    
    // Extraer IDs únicos de marcas
    const marcaIds = new Set(
      productosData
        .map(p => p.id_marca)
        .filter((id): id is number => id !== null && id !== undefined)
    )
    
    if (marcaIds.size === 0) {
      return []
    }
    
    // Obtener las marcas completas
    const { data: marcasData, error: marcasError } = await supabase
      .from('marca')
      .select('*')
      .in('id', Array.from(marcaIds))
      .eq('activo', true)
      .order('nombre')
    
    if (marcasError) {
      console.error('Error fetching marcas:', marcasError)
      return []
    }
    
    return marcasData || []
  } catch (error) {
    console.error('Error in getMarcasByCategoria:', error)
    return []
  }
}

export const getProductosDestacados = async (limit = 8) => {
  const supabase = getSupabaseClient()
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
      categorias:producto_categoria(id_categoria, categoria:categoria(id, nombre)),
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
    const supabaseFallback = getSupabaseClient()
    const { data: fallbackData, error: fallbackError } = await supabaseFallback
      .from('producto')
      .select(`
        sku,
        sku_producto,
        cod_producto_marca,
        nombre,
        descripcion_corta,
        descripcion_detallada,
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
        categorias:producto_categoria(id_categoria, categoria:categoria(id, nombre)),
        marca:id_marca(id, nombre, logo_url),
        unidad:id_unidad(id, nombre, simbolo),
        disponibilidad:id_disponibilidad(id, nombre, descripcion),
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
    // Normalizar categorías (pueden venir como array de relaciones)
    let categorias: Categoria[] = []
    if (producto.categorias) {
      if (Array.isArray(producto.categorias)) {
        categorias = producto.categorias
          .map((pc: any) => pc?.categoria)
          .filter((cat: any) => cat != null)
      } else if (producto.categorias && typeof producto.categorias === 'object' && 'categoria' in producto.categorias) {
        const cat = (producto.categorias as any).categoria
        if (cat) {
          categorias = [cat as Categoria]
        }
      }
    }
    // Mantener compatibilidad con categoria (primera categoría)
    const categoria = categorias.length > 0 ? categorias[0] : undefined
    
    // Normalizar otras relaciones (pueden venir como arrays en Supabase)
    const marca = Array.isArray(producto.marca) ? producto.marca[0] : producto.marca
    const unidad = Array.isArray(producto.unidad) ? producto.unidad[0] : producto.unidad
    const disponibilidad = Array.isArray(producto.disponibilidad) ? producto.disponibilidad[0] : producto.disponibilidad
    
    // Filtrar precios activos y vigentes
    const preciosVigentes = (producto.precios || []).filter(precio => {
      if (!precio.activo) return false
      
      const hoy = new Date().toISOString().split('T')[0]
      const fechaDesde = precio.fecha_vigencia_desde
      const fechaHasta = precio.fecha_vigencia_hasta
      
      // Verificar que la fecha de inicio sea menor o igual a hoy
      if (fechaDesde && fechaDesde > hoy) return false
      
      // Verificar que la fecha de fin sea null o mayor o igual a hoy
      if (fechaHasta && fechaHasta < hoy) return false
      
      return true
    })
    
    // Normalizar monedas en los precios (pueden venir como arrays)
    const preciosNormalizados = preciosVigentes.map(precio => ({
      ...precio,
      moneda: Array.isArray(precio.moneda) ? precio.moneda[0] : precio.moneda
    }))
    
    // Separar precios por moneda
    const precioSoles = preciosNormalizados.find(p => {
      const moneda = p.moneda
      return moneda && typeof moneda === 'object' && 'codigo' in moneda && moneda.codigo === 'PEN'
    })
    const precioDolares = preciosNormalizados.find(p => {
      const moneda = p.moneda
      return moneda && typeof moneda === 'object' && 'codigo' in moneda && moneda.codigo === 'USD'
    })
    
    // Priorizar soles, luego dólares
    const precioPrincipal = precioSoles || precioDolares || preciosNormalizados[0]
    
    // Procesar URLs de imágenes usando buildProductImageUrl
    let imagenPrincipalUrl = ''
    if (producto.imagen_principal_url) {
      if (typeof producto.imagen_principal_url === 'string') {
        imagenPrincipalUrl = buildProductImageUrl(producto.imagen_principal_url, producto.sku_producto) || ''
      } else if (Array.isArray(producto.imagen_principal_url) && producto.imagen_principal_url.length > 0) {
        imagenPrincipalUrl = buildProductImageUrl(String(producto.imagen_principal_url[0]), producto.sku_producto) || ''
      }
    }
    
    // Procesar galería de imágenes
    let galeriaImagenesUrls: string[] = []
    if (Array.isArray(producto.galeria_imagenes_urls)) {
      galeriaImagenesUrls = producto.galeria_imagenes_urls
        .map(url => buildProductImageUrl(url, producto.sku_producto))
        .filter((url): url is string => url !== null)
    }
    
    // Si no hay galería, usar solo la imagen principal
    if (galeriaImagenesUrls.length === 0 && imagenPrincipalUrl) {
      galeriaImagenesUrls = [imagenPrincipalUrl]
    }
    
    console.log('Procesando imágenes para producto destacado:', producto.nombre, {
      imagenPrincipalUrl,
      galeriaImagenesUrls: galeriaImagenesUrls.length
    })
    
    return {
      ...producto,
      // Normalizar relaciones
      categorias,
      categoria, // Mantener para compatibilidad
      marca,
      unidad,
      disponibilidad,
      // Asegurar que los campos requeridos tengan valores por defecto
      descripcion_detallada: producto.descripcion_detallada || '',
      id_marca: producto.id_marca || 0,
      id_unidad: producto.id_unidad || 0,
      id_disponibilidad: producto.id_disponibilidad || 0,
      requiere_stock: producto.requiere_stock ?? false,
      stock_minimo: producto.stock_minimo || 0,
      punto_reorden: producto.punto_reorden || 0,
      codigo_arancelario: producto.codigo_arancelario || '',
      es_importado: producto.es_importado ?? false,
      tiempo_importacion_dias: producto.tiempo_importacion_dias || 0,
      // URLs de imagen procesadas (asegurar que estén definidas)
      imagen_principal_url: imagenPrincipalUrl,
      galeria_imagenes_urls: galeriaImagenesUrls,
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
      moneda: precioPrincipal?.moneda || undefined,
      // Precios procesados con monedas normalizadas
      precios: preciosNormalizados,
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

export async function getRelatedProducts(
  currentSku: number,
  idCategoria?: number,
  idMarca?: number,
  limit: number = 8
): Promise<Producto[]> {
  try {
    const supabase = getSupabaseClient()
    // Si hay filtro de categoría, primero obtener los SKUs de productos que tienen esa categoría
    let productSkus: number[] | null = null
    if (idCategoria) {
      const { data: productoCategoriaData, error: pcError } = await supabase
        .from('producto_categoria')
        .select('sku')
        .eq('id_categoria', idCategoria)
        .eq('activo', true)
        .limit(10000) // Límite razonable para evitar queries muy grandes
      
      if (pcError) {
        console.error('Error fetching producto_categoria:', pcError)
        return []
      }
      
      const skuSet = new Set((productoCategoriaData || []).map((pc: any) => pc.sku))
    productSkus = Array.from(skuSet)
      
      if (productSkus.length === 0) {
        return []
      }
    }

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
        categorias:producto_categoria(id_categoria, categoria:categoria(id, nombre)),
        marca:id_marca(id, nombre, logo_url),
        precios:producto_precio_moneda(
          id,
          precio_venta,
          fecha_vigencia_desde,
          fecha_vigencia_hasta,
          activo,
          moneda:id_moneda(id, codigo, nombre, simbolo)
        )
      `)
      .eq('activo', true)
      .eq('visible_web', true)
      .neq('sku', currentSku)
      .limit(limit)

    // Filtrar por SKUs si hay filtro de categoría
    if (productSkus && productSkus.length > 0) {
      query = query.in('sku', productSkus)
    }

    // Filtrar por marca si está disponible
    if (idMarca) {
      query = query.eq('id_marca', idMarca)
    }

    const { data, error } = await query.order('es_destacado', { ascending: false }).order('fecha_creacion', { ascending: false })

    if (error) {
      console.error('Error fetching related products:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Procesar precios similar a getProductosDestacados
    const processedData = data.map((producto: any) => {
      // Normalizar categorías
      let categorias: Categoria[] = []
      if (producto.categorias) {
        if (Array.isArray(producto.categorias)) {
          categorias = producto.categorias
            .map((pc: any) => pc?.categoria)
            .filter((cat: any) => cat != null)
        } else if (producto.categorias.categoria) {
          categorias = [producto.categorias.categoria]
        }
      }
      const categoria = categorias.length > 0 ? categorias[0] : undefined
      
      const hoy = new Date().toISOString().split('T')[0]
      const preciosVigentes = (producto.precios || []).filter((p: any) => {
        if (!p.activo) return false
        if (p.fecha_vigencia_desde && p.fecha_vigencia_desde > hoy) return false
        if (p.fecha_vigencia_hasta && p.fecha_vigencia_hasta < hoy) return false
        return true
      })

      const preciosNormalizados = preciosVigentes.map((precio: any) => ({
        ...precio,
        moneda: Array.isArray(precio.moneda) ? precio.moneda[0] : precio.moneda
      }))

      const precioSoles = preciosNormalizados.find((p: any) => {
        const moneda = p.moneda
        return moneda && typeof moneda === 'object' && 'codigo' in moneda && moneda.codigo === 'PEN'
      })
      const precioDolares = preciosNormalizados.find((p: any) => {
        const moneda = p.moneda
        return moneda && typeof moneda === 'object' && 'codigo' in moneda && moneda.codigo === 'USD'
      })

      return {
        ...producto,
        categorias,
        categoria, // Mantener para compatibilidad
        precios_por_moneda: {
          soles: precioSoles ? {
            precio_venta: precioSoles.precio_venta,
            precio_referencia: precioSoles.precio_proveedor || precioSoles.precio_venta,
            moneda: precioSoles.moneda
          } : null,
          dolares: precioDolares ? {
            precio_venta: precioDolares.precio_venta,
            precio_referencia: precioDolares.precio_proveedor || precioDolares.precio_venta,
            moneda: precioDolares.moneda
          } : null
        }
      }
    })

    return processedData as Producto[]
  } catch (error) {
    console.error('Error in getRelatedProducts:', error)
    return []
  }
}