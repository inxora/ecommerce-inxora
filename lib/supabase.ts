/**
 * Re-exports de tipos y helpers de datos/imágenes.
 * La app consume solo desde el API; no hay conexión directa a Supabase.
 * Origen: lib/types, lib/utils/image-urls, lib/api/data
 */

export type {
  Producto,
  Product,
  Categoria,
  Marca,
  Unidad,
  Moneda,
  Disponibilidad,
  ProductoPrecio,
} from './types'

export { buildProductImageUrl, buildBrandLogoUrl } from './utils/image-urls'
export { getCategorias, getMarcas, getMarcasByCategoria, getMarcaBySlug } from './api/data'
