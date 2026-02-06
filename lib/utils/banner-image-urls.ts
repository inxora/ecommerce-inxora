/**
 * Transforma URLs de Cloudinary para banners al vuelo.
 * Inserta transformaciones entre /upload/ y el path (v1234567890/...).
 *
 * Mobile: w_800,c_fill,g_auto,f_auto,q_auto
 * Desktop: w_1920,c_fill,g_auto,f_auto,q_auto
 */

/**
 * Aplica transformaciones de Cloudinary a una URL.
 * Si la URL no es de Cloudinary, la devuelve sin modificar.
 *
 * @param url - URL original (Cloudinary o cualquier otra)
 * @param variant - 'mobile' | 'desktop'
 * @param focalPoint - Opcional: center, north, south, east, west. Se convierte a g_X para Cloudinary
 */
export function buildBannerImageUrl(
  url: string | null | undefined,
  variant: 'mobile' | 'desktop',
  focalPoint?: string | null
): string | null {
  if (!url || typeof url !== 'string' || url.trim() === '') return null
  const trimmed = url.trim()

  if (!trimmed.includes('res.cloudinary.com')) {
    return trimmed
  }

  const width = variant === 'mobile' ? 'w_800' : 'w_1920'
  const gravity = focalPoint ? `g_${focalPoint}` : 'g_auto'
  const transforms = `${width},c_fill,${gravity},f_auto,q_auto`

  // Cloudinary: https://res.cloudinary.com/cloud/image/upload/v1234567890/path/image.jpg
  // Resultado: .../upload/w_1920,c_fill,g_auto,f_auto,q_auto/v1234567890/path/image.jpg
  const uploadIndex = trimmed.indexOf('/upload/')
  if (uploadIndex === -1) return trimmed

  const beforeUpload = trimmed.slice(0, uploadIndex + 8)
  const afterUpload = trimmed.slice(uploadIndex + 8)

  return `${beforeUpload}${transforms}/${afterUpload}`
}
