import { api, apiClient } from '@/lib/api/client'
import { Producto } from '@/lib/supabase'
import { buildProductImageUrl } from '@/lib/supabase'
import { generateProductSlug, normalizeName } from '@/lib/product-url'

// Tipos para la respuesta del endpoint de productos
export interface UnidadProducto {
  id: number
  codigo: string
  nombre: string
  simbolo: string
}

export interface MarcaProducto {
  id: number
  nombre: string
}

export interface ProveedorProducto {
  id: number
  nombre: string
  margen_aplicado: number
  costo_sin_igv: number
  costo_con_igv: number
  costo_venta_sin_igv: number
  costo_venta_con_igv: number
  id_moneda_costo: number
  tiempo_entrega_dias: number
  es_proveedor_principal: boolean
  producto_proveedor_id: number
  tipo_cambio_usado: number | null
}

export interface SubcategoriaPrincipal {
  id: number
  nombre: string
  codigo: string
  categoria_id: number
  categoria_nombre: string
}

export interface CategoriaProducto {
  id: number
  nombre: string
}

export interface ProductoAPI {
  sku: number
  nombre: string
  cod_producto_marca: string | null
  descripcion_corta: string | null
  descripcion_detallada: string | null
  categoria_id: number | null
  id_marca: number
  id_disponibilidad: number
  id_unidad: number
  activo: boolean
  visible_web: boolean
  imagen_principal_url: string | null
  galeria_imagenes_urls: string[] | null
  unidad_codigo: string
  seo_title: string | null
  seo_keywords: string | null
  seo_slug: string | null
  meta_robots: string | null
  canonical_url: string | null
  structured_data: any | null
  unidad: UnidadProducto
  categoria: CategoriaProducto | null
  subcategoria_principal: SubcategoriaPrincipal | null
  marca: MarcaProducto
  proveedores: ProveedorProducto[]
}

export interface ProductosResponse {
  success: boolean
  data: {
    productos: ProductoAPI[]
    total: number
  }
  message: string
  metadata: {
    limit: number
    offset: number
    count: number
    total: number
    pages: number
    current_page: number
    has_more: boolean
  }
  timestamp: string
  status_code: number | null
}

export interface GetProductosParams {
  page?: number
  limit?: number
  categoria_id?: number | number[]
  id_subcategoria?: number | number[]  // ✅ NUEVO: Filtro por subcategoría
  id_marca?: number | number[]
  buscar?: string
  activo?: boolean
  visible_web?: boolean
  precioMin?: number
  precioMax?: number
  ordenar?: string
}

/**
 * Mapea un ProductoAPI del endpoint externo al formato Producto usado en la aplicación
 */
function mapProductoAPIToProducto(productoAPI: ProductoAPI): Producto {
  // Obtener el proveedor principal (el que tiene es_proveedor_principal: true)
  const proveedorPrincipal = productoAPI.proveedores?.find(p => p.es_proveedor_principal) || productoAPI.proveedores?.[0]
  
  // Determinar la moneda basada en id_moneda_costo (1 = PEN, 2 = USD)
  const moneda = proveedorPrincipal?.id_moneda_costo === 2 
    ? { id: 2, codigo: 'USD', nombre: 'Dólar Americano', simbolo: '$', activo: true, fecha_creacion: new Date().toISOString() }
    : { id: 1, codigo: 'PEN', nombre: 'Sol Peruano', simbolo: 'S/', activo: true, fecha_creacion: new Date().toISOString() }
  
  // Procesar URLs de imágenes
  // Usar sku_producto (cod_producto_marca) para construir las URLs de imágenes
  // Si no hay cod_producto_marca, usar el SKU como fallback
  const skuProducto = productoAPI.cod_producto_marca || String(productoAPI.sku)
  
  // Procesar imagen principal
  let imagenPrincipalUrl = ''
  if (productoAPI.imagen_principal_url && typeof productoAPI.imagen_principal_url === 'string' && productoAPI.imagen_principal_url.trim() !== '') {
    const processedUrl = buildProductImageUrl(productoAPI.imagen_principal_url.trim(), skuProducto)
    if (processedUrl) {
      imagenPrincipalUrl = processedUrl
    }
  }
  
  // Procesar galería de imágenes
  let galeriaImagenesUrls: string[] = []
  if (productoAPI.galeria_imagenes_urls) {
    if (Array.isArray(productoAPI.galeria_imagenes_urls) && productoAPI.galeria_imagenes_urls.length > 0) {
      galeriaImagenesUrls = productoAPI.galeria_imagenes_urls
        .map(url => {
          // Validar que sea un string válido
          if (!url || typeof url !== 'string' || url.trim() === '') {
            return null
          }
          // Procesar la URL
          return buildProductImageUrl(url.trim(), skuProducto)
        })
        .filter((url): url is string => url !== null && url !== '')
    }
  }
  
  // Si no hay galería pero hay imagen principal, usar la imagen principal como galería
  if (galeriaImagenesUrls.length === 0 && imagenPrincipalUrl) {
    galeriaImagenesUrls = [imagenPrincipalUrl]
  }
  
  // Si no hay imagen principal pero hay galería, usar la primera de la galería como principal
  if (!imagenPrincipalUrl && galeriaImagenesUrls.length > 0) {
    imagenPrincipalUrl = galeriaImagenesUrls[0]
  }
  
  // Log para debugging (solo si está habilitado explícitamente)
  const shouldLog = process.env.NEXT_PUBLIC_DEBUG_API === 'true'
  if (shouldLog && !imagenPrincipalUrl && productoAPI.visible_web) {
    console.log(`[ProductsService] Producto ${productoAPI.sku} (${productoAPI.nombre}) sin imagen principal`, {
      imagen_principal_url: productoAPI.imagen_principal_url,
      galeria_imagenes_urls: productoAPI.galeria_imagenes_urls,
      skuProducto
    })
  }
  
  // Mapear unidad
  const unidad = {
    id: productoAPI.unidad.id,
    nombre: productoAPI.unidad.nombre,
    simbolo: productoAPI.unidad.simbolo,
    descripcion: '',
    activo: true,
    fecha_creacion: new Date().toISOString()
  }
  
  // Mapear marca
  const marca = {
    id: productoAPI.marca.id,
    nombre: productoAPI.marca.nombre,
    codigo: '',
    descripcion: '',
    logo_url: '',
    sitio_web: '',
    pais_origen: '',
    activo: true,
    fecha_creacion: new Date().toISOString()
  }
  
  // Mapear disponibilidad (usar valores por defecto)
  const disponibilidad = {
    id: productoAPI.id_disponibilidad,
    nombre: 'Disponible',
    descripcion: '',
    activo: true,
    fecha_creacion: new Date().toISOString()
  }
  
  // Calcular precios por moneda
  const preciosPorMoneda: { soles?: any; dolares?: any } = {}
  
  productoAPI.proveedores?.forEach(proveedor => {
    const precioVenta = proveedor.costo_venta_con_igv
    const precioReferencia = proveedor.costo_con_igv
    
    if (proveedor.id_moneda_costo === 1) {
      // Soles
      preciosPorMoneda.soles = {
        precio_venta: precioVenta,
        precio_referencia: precioReferencia,
        moneda: { id: 1, codigo: 'PEN', nombre: 'Sol Peruano', simbolo: 'S/', activo: true, fecha_creacion: new Date().toISOString() }
      }
    } else if (proveedor.id_moneda_costo === 2) {
      // Dólares
      preciosPorMoneda.dolares = {
        precio_venta: precioVenta,
        precio_referencia: precioReferencia,
        moneda: { id: 2, codigo: 'USD', nombre: 'Dólar Americano', simbolo: '$', activo: true, fecha_creacion: new Date().toISOString() }
      }
    }
  })
  
  // Producto mapeado
  return {
    sku: productoAPI.sku,
    sku_producto: productoAPI.cod_producto_marca || String(productoAPI.sku),
    cod_producto_marca: productoAPI.cod_producto_marca || '',
    nombre: productoAPI.nombre,
    descripcion_corta: productoAPI.descripcion_corta || '',
    descripcion_detallada: (productoAPI.descripcion_detallada && typeof productoAPI.descripcion_detallada === 'string' && productoAPI.descripcion_detallada.trim() !== '') 
      ? productoAPI.descripcion_detallada.trim() 
      : '',
    id_marca: productoAPI.id_marca,
    id_unidad: productoAPI.id_unidad,
    id_disponibilidad: productoAPI.id_disponibilidad,
    requiere_stock: false,
    stock_minimo: 0,
    punto_reorden: 0,
    codigo_arancelario: '',
    es_importado: false,
    tiempo_importacion_dias: 0,
    imagen_principal_url: imagenPrincipalUrl,
    galeria_imagenes_urls: galeriaImagenesUrls,
    seo_title: productoAPI.seo_title || '',
    seo_description: '',
    seo_keywords: productoAPI.seo_keywords || '',
    seo_slug: productoAPI.seo_slug || generateProductSlug(productoAPI.nombre, marca.nombre),
    meta_robots: productoAPI.meta_robots || '',
    canonical_url: productoAPI.canonical_url || '',
    structured_data: productoAPI.structured_data || null,
    seo_score: 0,
    seo_optimizado: false,
    tags: [],
    es_destacado: false,
    es_novedad: false,
    es_promocion: false,
    activo: productoAPI.activo,
    visible_web: productoAPI.visible_web,
    requiere_aprobacion: false,
    fecha_creacion: new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString(),
    creado_por: 0,
    actualizado_por: 0,
    // Precio principal (del proveedor principal)
    precio_venta: proveedorPrincipal?.costo_venta_con_igv || 0,
    precio_referencia: proveedorPrincipal?.costo_con_igv || 0,
    moneda: moneda,
    // Relaciones
    marca: marca,
    unidad: unidad,
    disponibilidad: disponibilidad,
    categorias: [],
    categoria: productoAPI.categoria ? {
      id: productoAPI.categoria.id,
      nombre: productoAPI.categoria.nombre,
      descripcion: '',
      logo_url: null,
      activo: true,
      fecha_creacion: new Date().toISOString()
    } : undefined,
    // Agregar subcategoria_principal para poder construir URLs correctas
    subcategoria_principal: productoAPI.subcategoria_principal || undefined,
    precios: [],
    precios_por_moneda: preciosPorMoneda
  }
}

export const ProductsService = {
  /**
   * Obtiene los productos desde el endpoint externo
   * @param params - Parámetros de búsqueda y paginación
   * @returns Productos mapeados al formato Producto usado en la aplicación
   */
  getProductos: async (params?: GetProductosParams): Promise<{
    products: Producto[]
    total: number
    totalPages: number
  }> => {
    try {
      const queryParams: Record<string, string | number | boolean> = {}
      
      if (params?.page !== undefined) {
        queryParams.page = params.page
      }
      if (params?.limit !== undefined) {
        queryParams.limit = params.limit
      }
      if (params?.categoria_id !== undefined) {
        // Si es array, convertir a string separado por comas; si es número, enviar como número
        if (Array.isArray(params.categoria_id)) {
          queryParams.categoria_id = params.categoria_id.join(',')
        } else {
          queryParams.categoria_id = params.categoria_id
        }
      }
      // ✅ NUEVO: Filtro por subcategoría (cuando el backend lo soporte)
      if (params?.id_subcategoria !== undefined) {
        if (Array.isArray(params.id_subcategoria)) {
          queryParams.id_subcategoria = params.id_subcategoria.join(',')
        } else {
          queryParams.id_subcategoria = params.id_subcategoria
        }
      }
      if (params?.id_marca !== undefined) {
        // Si es array, convertir a string separado por comas; si es número, enviar como número
        if (Array.isArray(params.id_marca)) {
          queryParams.id_marca = params.id_marca.join(',')
        } else {
          queryParams.id_marca = params.id_marca
        }
      }
      if (params?.buscar) {
        queryParams.buscar = params.buscar
      }
      if (params?.activo !== undefined) {
        queryParams.activo = params.activo
      }
      // ✅ Filtros de precio (P3)
      if (params?.precioMin !== undefined) {
        queryParams.precio_min = params.precioMin
      }
      if (params?.precioMax !== undefined) {
        queryParams.precio_max = params.precioMax
      }
      // ✅ Ordenamiento (P2)
      if (params?.ordenar) {
        queryParams.ordenar = params.ordenar
      }
      // NOTA: El endpoint ahora filtra visible_web=true automáticamente para ecommerce
      
      const response = await api.get<ProductosResponse>('/api/test/productos/ecommerce', queryParams)
      
      // Validar estructura de respuesta
      if (!response || !response.success || !response.data || !Array.isArray(response.data.productos)) {
        console.error('[ProductsService] Invalid response structure from productos endpoint:', response)
        throw new Error('Invalid response structure from API')
      }
      
      // Los logs están deshabilitados por defecto - solo mostrar si NEXT_PUBLIC_DEBUG_API='true'
      const shouldLog = process.env.NEXT_PUBLIC_DEBUG_API === 'true'
      
      if (shouldLog) {
        console.log('[ProductsService] getProductos: Productos recibidos del API:', response.data.productos.length)
        
        if (response.data.productos.length > 0) {
          console.log('[ProductsService] getProductos: Primeros productos (muestra):', response.data.productos.slice(0, 3).map(p => ({
            sku: p.sku,
            nombre: p.nombre,
            visible_web: p.visible_web,
            activo: p.activo
          })))
          
          // Contar productos por visible_web
          const visibleCount = response.data.productos.filter(p => p.visible_web === true).length
          const noVisibleCount = response.data.productos.filter(p => p.visible_web === false).length
          console.log('[ProductsService] getProductos: Productos con visible_web=true:', visibleCount)
          console.log('[ProductsService] getProductos: Productos con visible_web=false:', noVisibleCount)
        }
      }
      
      // Filtrar productos para asegurar que solo se muestren los visibles en web
      // Esto es una capa adicional de seguridad en caso de que el endpoint no respete el filtro
      const productosFiltrados = response.data.productos.filter(
        producto => producto.visible_web === true
      )
      
      if (shouldLog) {
        console.log('[ProductsService] getProductos: Productos después de filtrar visible_web:', productosFiltrados.length)
      }
      
      // Mapear productos del API al formato Producto
      const products = productosFiltrados.map(mapProductoAPIToProducto)
      
      // Recalcular el total basado en los productos filtrados
      // Si el endpoint respetó el filtro, el total debería ser el mismo
      // Si no, ajustamos el total al número de productos filtrados
      const totalFiltrado = productosFiltrados.length
      
      // Calcular totalPages
      // Usar el total del response si el endpoint respetó el filtro
      // Si el número de productos filtrados es menor al total, significa que el endpoint no filtró correctamente
      const total = productosFiltrados.length < response.data.productos.length 
        ? totalFiltrado 
        : response.data.total
      const limit = params?.limit || 10
      const totalPages = Math.ceil(total / limit)
      
      return {
        products,
        total,
        totalPages
      }
    } catch (error) {
      console.error('Error fetching productos:', error)
      throw error
    }
  },

  /**
   * Obtiene los productos más recientes (para mostrar como "Productos Destacados")
   * Ordena por fecha de creación descendente (más recientes primero)
   * @param limit - Número de productos a obtener (default: 4)
   * @returns Productos más recientes mapeados al formato Producto
   */
  getProductosRecientes: async (limit: number = 4): Promise<{
    products: Producto[]
    total: number
  }> => {
    try {
      const shouldLog = process.env.NEXT_PUBLIC_DEBUG_API === 'true'
      
      if (shouldLog) {
        console.log('[ProductsService] getProductosRecientes: Iniciando, limit:', limit);
      }
      
      // Optimización: Obtener solo un poco más de productos de los necesarios
      // Reducir de limit * 5 a limit * 2 para menor consumo de datos
      const fetchLimit = Math.max(limit * 2, 10) // Mínimo 10 productos, máximo limit * 2
      
      const response = await ProductsService.getProductos({
        page: 1,
        limit: fetchLimit, // Reducido de limit * 5 a limit * 2
        activo: true,
        visible_web: true, // Filtrar visible_web desde el inicio
      })
      
      if (shouldLog) {
        console.log('[ProductsService] getProductosRecientes: Productos obtenidos:', response.products.length);
      }
      
      if (!response.products || response.products.length === 0) {
        if (shouldLog) {
          console.warn('[ProductsService] getProductosRecientes: No se obtuvieron productos');
        }
        return {
          products: [],
          total: 0
        }
      }
      
      // Ordenar productos por fecha_creacion descendente (más recientes primero)
      // Si hay fecha_creacion válida, usar esa; si no, usar SKU descendente como fallback
      const productosOrdenados = [...response.products].sort((a, b) => {
        // Intentar ordenar por fecha_creacion si está disponible y es válida
        if (a.fecha_creacion && b.fecha_creacion) {
          const fechaA = new Date(a.fecha_creacion).getTime()
          const fechaB = new Date(b.fecha_creacion).getTime()
          // Si las fechas son válidas (no son NaN), usarlas
          if (!isNaN(fechaA) && !isNaN(fechaB)) {
            return fechaB - fechaA // Descendente (más reciente primero)
          }
        }
        // Fallback: ordenar por SKU descendente (SKUs más altos suelen ser más recientes)
        return b.sku - a.sku
      })
      
      // Limitar al número solicitado
      const productosLimitados = productosOrdenados.slice(0, limit)
      
      if (shouldLog) {
        console.log('[ProductsService] getProductosRecientes: Productos limitados:', productosLimitados.length);
      }
      
      return {
        products: productosLimitados,
        total: productosLimitados.length
      }
    } catch (error) {
      console.error('[ProductsService] getProductosRecientes: Error:', error);
      return {
        products: [],
        total: 0
      }
    }
  },

  /**
   * Incrementa el contador de visualizaciones de un producto
   * @param sku - SKU del producto
   */
  incrementarVisualizacion: (sku: number | string) =>
    api.post(`/api/productos/${sku}/incrementar-visualizacion`),

  /**
   * Busca un producto por su seo_slug en el API externo
   * @param slug - Slug del producto (seo_slug ya normalizado)
   * @returns Producto encontrado o null si no existe
   */
  getProductoBySlug: async (slug: string): Promise<Producto | null> => {
    try {
      const cacheOptions = process.env.NODE_ENV === 'development'
        ? { next: { revalidate: 60 } }
        : { cache: 'no-store' as RequestCache }
      
      // ✅ Búsqueda directa O(1) por seo_slug exacto
      const response = await apiClient<ProductosResponse>('/api/test/productos/ecommerce', {
        method: 'GET',
        params: {
          seo_slug: slug,  // Búsqueda directa por slug
          limit: 1,        // Solo necesitamos 1 resultado
        },
        ...cacheOptions,
      })

      if (!response?.success || !response.data?.productos?.length) {
        return null
      }

      // El endpoint ya filtra por seo_slug exacto, tomar el primero
      const producto = response.data.productos[0]
      
      if (!producto || producto.visible_web !== true) {
        return null
      }

      return mapProductoAPIToProducto(producto)
    } catch (error) {
      console.error('Error buscando producto por slug:', slug, error)
      return null
    }
  },

  /**
   * Obtiene productos relacionados basados en marca y subcategoría
   * @param currentSku - SKU del producto actual (para excluirlo)
   * @param idMarca - ID de la marca (requerido)
   * @param idSubcategoria - ID de la subcategoría (opcional, puede ser array para múltiples subcategorías)
   * @param limit - Número máximo de productos a retornar (default: 8)
   * @returns Array de productos relacionados
   */
  getProductosRelacionados: async (
    currentSku: number,
    idMarca: number,
    idSubcategoria?: number | number[],
    limit: number = 8
  ): Promise<Producto[]> => {
    try {
      // Reducir el límite para evitar respuestas muy grandes
      // Si hay subcategoría, necesitamos más productos para filtrar, pero no exagerar
      const fetchLimit = idSubcategoria ? limit * 2 : limit * 1.5 // Reducir de limit * 3
      const queryParams: Record<string, string | number | boolean> = {
        limit: Math.ceil(fetchLimit), // Reducir cantidad de productos obtenidos
      }

      // Filtrar por marca (requerido)
      queryParams.id_marca = idMarca

      const response = await api.get<ProductosResponse>('/api/test/productos/ecommerce', queryParams)

      if (!response || !response.success || !response.data || !Array.isArray(response.data.productos)) {
        return []
      }

      // Convertir idSubcategoria a array para facilitar el filtrado
      const subcategoriasIds = idSubcategoria 
        ? (Array.isArray(idSubcategoria) ? idSubcategoria : [idSubcategoria])
        : []

      // Filtrar productos: visible_web, misma marca, misma subcategoría, excluir el producto actual
      const productosFiltrados = response.data.productos
        .filter(producto => {
          // Debe estar visible en web
          if (producto.visible_web !== true) return false
          
          // Debe ser diferente al producto actual
          if (producto.sku === currentSku) return false
          
          // Debe tener la misma marca
          if (producto.id_marca !== idMarca) return false
          
          // Si se especificó subcategoría, debe coincidir
          if (subcategoriasIds.length > 0) {
            const productoSubcategoriaId = producto.subcategoria_principal?.id
            if (!productoSubcategoriaId || !subcategoriasIds.includes(productoSubcategoriaId)) {
              return false
            }
          }
          
          return true
        })
        .slice(0, limit)

      // Mapear productos
      return productosFiltrados.map(mapProductoAPIToProducto)
    } catch (error) {
      console.error('Error obteniendo productos relacionados:', error)
      return []
    }
  },

  /**
   * Busca un producto por su SKU en el API externo
   * @param sku - SKU del producto
   * @returns Producto encontrado o null si no existe
   */
  getProductoBySku: async (sku: number): Promise<Producto | null> => {
    try {
      // ✅ FIX 3: Estrategia de caché según entorno
      const cacheOptions = process.env.NODE_ENV === 'development'
        ? { next: { revalidate: 60 } } // 1 minuto en desarrollo
        : { cache: 'no-store' as RequestCache } // Sin caché en producción
      
      // Intentar buscar usando el parámetro 'buscar' con el SKU
      // Si el endpoint soporta búsqueda por SKU, esto debería funcionar
      let response = await apiClient<ProductosResponse>('/api/test/productos/ecommerce', {
        method: 'GET',
        params: {
          buscar: String(sku), // Buscar por SKU como string
          limit: 100, // Limitar a 100 productos para respuesta más rápida
        },
        ...cacheOptions,
      })

      // Verificar si la respuesta es válida
      if (!response || !response.success || !response.data || !Array.isArray(response.data.productos)) {
        // Fallback: buscar sin parámetro buscar en la primera página
        response = await apiClient<ProductosResponse>('/api/test/productos/ecommerce', {
          method: 'GET',
          params: {
            page: 1,
            limit: 100,
          },
          ...cacheOptions,
        })
      }

      if (!response || !response.success || !response.data || !Array.isArray(response.data.productos)) {
        return null
      }

      // Filtrar productos por visible_web y buscar el que coincida exactamente con el SKU
      const productoEncontrado = response.data.productos.find(
        producto => producto.visible_web === true && producto.sku === sku
      )

      if (!productoEncontrado) {
        return null
      }

      // Mapear el producto encontrado
      return mapProductoAPIToProducto(productoEncontrado)
    } catch (error) {
      // Si es un timeout, loggear específicamente
      if (error instanceof Error && error.message.includes('timeout')) {
        console.error('Error: Timeout buscando producto por SKU:', sku)
      } else {
        console.error('Error buscando producto por SKU:', error)
      }
      return null
    }
  },
}
