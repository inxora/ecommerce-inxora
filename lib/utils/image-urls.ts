/**
 * Helpers para URLs de imágenes (productos, marcas).
 * Acepta URLs completas del API (Cloudinary o Supabase) o rutas relativas legacy.
 */

const SUPABASE_BUCKET_PRODUCTOS =
  'https://keeussaqlshdsegerqob.supabase.co/storage/v1/object/public/productos-images'
const SUPABASE_BUCKET_MARCAS =
  'https://keeussaqlshdsegerqob.supabase.co/storage/v1/object/public/marcas-images'

function buildImageUrlLegacy(skuProducto: string, imageName: string): string | null {
  if (!skuProducto || !imageName || imageName.includes('..') || imageName.includes('//')) return null
  return `${SUPABASE_BUCKET_PRODUCTOS}/${skuProducto}/${imageName}`
}

export function buildProductImageUrl(
  imageUrl: string | null | undefined,
  skuProducto?: string
): string | null {
  if (!imageUrl || (typeof imageUrl === 'string' && imageUrl.trim() === '')) return null

  let urlString = typeof imageUrl === 'string' ? imageUrl.trim() : String(imageUrl).trim()
  if (urlString.length === 0) return null

  // Normalizar protocolo relativo (//res.cloudinary.com/...) a https
  if (urlString.startsWith('//') && urlString.includes('res.cloudinary.com')) {
    urlString = 'https:' + urlString
  }

  const isSupabase =
    urlString.startsWith('https://') &&
    urlString.includes('supabase.co') &&
    urlString.includes('/storage/v1/object/public/')
  const isCloudinary =
    (urlString.startsWith('https://') || urlString.startsWith('http://')) &&
    urlString.includes('res.cloudinary.com')

  if (isSupabase || isCloudinary) {
    if (
      !urlString.includes('<script') &&
      !urlString.includes('javascript:') &&
      !urlString.includes('data:')
    ) {
      return urlString
    }
    return null
  }

  const hasProtocol = urlString.startsWith('http://') || urlString.startsWith('https://')
  if (
    !hasProtocol &&
    (urlString.includes('../') ||
      urlString.includes('..\\') ||
      urlString.includes('//') ||
      urlString.toLowerCase().includes('<script') ||
      urlString.toLowerCase().includes('javascript:') ||
      urlString.toLowerCase().includes('data:'))
  ) {
    return null
  }

  if (hasProtocol) {
    if (urlString.includes('supabase.co') || urlString.includes('res.cloudinary.com')) {
      return urlString
    }
    return null
  }

  if (urlString.startsWith('/')) {
    const path = urlString.substring(1)
    if (path.length === 0) return null
    return `https://keeussaqlshdsegerqob.supabase.co/storage/v1/object/public/${path}`
  }

  if (skuProducto && !urlString.includes('/') && !urlString.includes('\\')) {
    return buildImageUrlLegacy(skuProducto, urlString)
  }

  if (urlString.includes('productos-images/') && !urlString.startsWith('http')) {
    return `https://keeussaqlshdsegerqob.supabase.co/storage/v1/object/public/${urlString}`
  }

  return null
}

export function buildBrandLogoUrl(logoUrl: string | null | undefined): string | null {
  if (!logoUrl || logoUrl.trim() === '') return null
  const trimmed = logoUrl.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return `${SUPABASE_BUCKET_MARCAS}/${trimmed}`
}
