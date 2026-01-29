'use client'

import Image, { ImageProps } from 'next/image'

/**
 * Imagen de producto/catálogo: carga directa desde CDN (Cloudinary/Supabase).
 * Usa unoptimized para evitar el proxy de Vercel y fallos por timeout o límites.
 * Las URLs en BD ya son correctas (ej. res.cloudinary.com/...).
 *
 * Uso: reemplazar <Image> por <ProductImage> donde se muestren imágenes de producto.
 */
export function ProductImage(props: ImageProps) {
  return <Image {...props} unoptimized />
}
