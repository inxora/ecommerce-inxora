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
