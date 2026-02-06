/**
 * Tipos de datos del API (categorías, productos, marcas).
 * Fuente única: respuestas del API.
 */

export interface Moneda {
  id: number
  codigo: string
  nombre: string
  simbolo: string
  activo: boolean
  fecha_creacion: string
}

export interface Unidad {
  id: number
  nombre: string
  simbolo: string
  descripcion: string
  activo: boolean
  fecha_creacion: string
}

export interface Disponibilidad {
  id: number
  nombre: string
  descripcion: string
  activo: boolean
  fecha_creacion: string
}

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
  precio_venta?: number
  precio_referencia?: number
  moneda?: Moneda
  categorias?: Categoria[]
  categoria?: Categoria
  marca?: Marca
  unidad?: Unidad
  disponibilidad?: Disponibilidad
  precios?: ProductoPrecio[]
  precios_por_moneda?: {
    soles?: { precio_venta: number; precio_referencia: number; moneda: Moneda } | null
    dolares?: { precio_venta: number; precio_referencia: number; moneda: Moneda } | null
  }
  subcategoria_principal?: {
    id: number
    nombre: string
    codigo: string
    categoria_id: number
    categoria_nombre: string
  }
}

export type Product = Producto

/** Capa de diseño del banner (texto, párrafo, botón) - configuracion_diseno */
export interface BannerLayer {
  id: string
  tipo: 'h1' | 'p' | 'button'
  contenido: string
  x: number
  y: number
  x_mobile?: number
  y_mobile?: number
  estilos?: {
    color?: string
    fontSize?: number
    fontFamily?: string
    fontWeight?: 'normal' | 'bold' | number
    fontStyle?: 'normal' | 'italic'
    textDecoration?: 'none' | 'underline'
    backgroundColor?: string
    borderRadius?: number
  }
  url?: string
}

/**
 * Banner dinámico - estructura de /api/banners/public
 * Soporta configuracion_diseno (capas) y campos legacy (titulo_h1, subtitulo_p, boton_texto)
 */
export interface Banner {
  id: number
  posicion_slug: string
  titulo_h1: string | null
  subtitulo_p: string | null
  url_imagen_desktop: string
  url_imagen_mobile: string | null
  url_destino: string | null
  boton_texto: string | null
  todo_clicable: boolean
  focal_point: string | null
  focal_point_mobile?: string | null
  object_fit?: 'cover' | 'contain'
  object_fit_mobile?: 'cover' | 'contain' | null
  configuracion_diseno?: BannerLayer[]
  orden: number
  activo: boolean
  fecha_inicio: string | null
  fecha_fin: string | null
  fecha_creacion: string
  fecha_actualizacion: string
}
