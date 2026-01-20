/**
 * Función helper para construir URLs de productos de forma consistente
 * Asegura que todas las URLs sigan el mismo patrón: /{locale}/{categoria}/producto/{marca}/{slug}
 */

import { Product, Producto } from './supabase'

/**
 * Normaliza un nombre para usarlo en la URL (marca, categoría, etc.)
 * Convierte a minúsculas, reemplaza espacios por guiones y limpia caracteres especiales
 */
export function normalizeName(name: string | undefined | null): string | undefined {
  if (!name || typeof name !== 'string') {
    return undefined
  }
  
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Reemplaza espacios por guiones
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9-]/g, '') // Elimina caracteres especiales
    .replace(/-+/g, '-') // Reemplaza múltiples guiones por uno solo
    .replace(/^-|-$/g, '') // Elimina guiones al inicio y final
}

/**
 * Normaliza el nombre de la marca para usarlo en la URL
 * @deprecated Usar normalizeName en su lugar
 */
export function normalizeBrandName(brandName: string | undefined | null): string | undefined {
  return normalizeName(brandName)
}

/**
 * Construye la URL del producto siguiendo la estructura estándar
 * Formato: /{locale}/producto/{categoria-slug}/{marca-slug}/{product-slug}
 * Si no hay categoría: /{locale}/producto/{marca-slug}/{product-slug}
 * Si no hay marca: /{locale}/producto/{categoria-slug}/{product-slug}
 * Si no hay ni categoría ni marca: /{locale}/producto/{product-slug}
 */
export function buildProductUrl(
  product: Product | Producto,
  locale: string = 'es'
): string {
  const seoSlug = product.seo_slug
  
  if (!seoSlug) {
    console.warn('Producto sin seo_slug:', product)
    return `/${locale}/producto`
  }

  // Obtener nombre de categoría
  let categoryName: string | undefined
  if (product.categoria) {
    if (typeof product.categoria === 'string') {
      categoryName = product.categoria
    } else if (typeof product.categoria === 'object' && 'nombre' in product.categoria) {
      categoryName = product.categoria.nombre
    }
  }

  // Obtener nombre de marca
  let brandName: string | undefined
  if (product.marca) {
    if (typeof product.marca === 'string') {
      brandName = product.marca
    } else if (typeof product.marca === 'object' && 'nombre' in product.marca) {
      brandName = product.marca.nombre
    }
  }

  // Normalizar nombres
  const categorySegment = normalizeName(categoryName)
  const brandSegment = normalizeName(brandName)

  // Construir URL con categoría y marca: /{locale}/producto/{categoria}/{marca}/{slug}
  if (categorySegment && brandSegment) {
    return `/${locale}/producto/${categorySegment}/${brandSegment}/${seoSlug}`
  }

  // Construir URL solo con categoría: /{locale}/producto/{categoria}/{slug}
  if (categorySegment) {
    return `/${locale}/producto/${categorySegment}/${seoSlug}`
  }

  // Construir URL solo con marca: /{locale}/producto/{marca}/{slug}
  if (brandSegment) {
    return `/${locale}/producto/${brandSegment}/${seoSlug}`
  }

  // URL sin categoría ni marca: /{locale}/producto/{slug}
  return `/${locale}/producto/${seoSlug}`
}

/**
 * Genera un slug SEO-friendly a partir del nombre del producto
 * Esta función debe usarse al crear nuevos productos
 * 
 * @param productName - Nombre del producto
 * @param brandName - Nombre de la marca (opcional, para evitar duplicados)
 * @returns Slug único y SEO-friendly
 */
export function generateProductSlug(
  productName: string,
  brandName?: string | null
): string {
  if (!productName || typeof productName !== 'string') {
    throw new Error('El nombre del producto es requerido')
  }

  // Normalizar el nombre
  let slug = productName
    .toLowerCase()
    .trim()
    // Reemplazar acentos
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    // Reemplazar caracteres especiales comunes
    .replace(/[×x]/g, 'x') // × o x por x
    .replace(/[mm]/g, 'mm') // Mantener mm
    // Reemplazar espacios y caracteres especiales por guiones
    .replace(/[\s_\.]+/g, '-')
    // Eliminar caracteres no alfanuméricos excepto guiones
    .replace(/[^a-z0-9-]/g, '')
    // Reemplazar múltiples guiones por uno solo
    .replace(/-+/g, '-')
    // Eliminar guiones al inicio y final
    .replace(/^-|-$/g, '')

  // Si el nombre de la marca está incluido al inicio del slug, removerlo para evitar duplicación
  if (brandName) {
    const normalizedBrand = normalizeBrandName(brandName)
    if (normalizedBrand && slug.startsWith(normalizedBrand + '-')) {
      slug = slug.substring(normalizedBrand.length + 1)
    }
  }

  // Asegurar que el slug no esté vacío
  if (!slug || slug.length === 0) {
    slug = 'producto'
  }

  // Limitar longitud (máximo 100 caracteres para la BD)
  if (slug.length > 100) {
    slug = slug.substring(0, 100)
    // Asegurar que no termine en guión
    slug = slug.replace(/-+$/, '')
  }

  return slug
}

/**
 * Construye la URL de una categoría usando su nombre normalizado
 * Formato: /{locale}/{category-slug}
 * 
 * @param categoryName - Nombre de la categoría
 * @param locale - Locale (es, en, pt)
 * @returns URL de la categoría
 */
export function buildCategoryUrl(
  categoryName: string,
  locale: string = 'es'
): string {
  const categorySlug = normalizeName(categoryName)
  if (!categorySlug) {
    return `/${locale}`
  }
  return `/${locale}/${categorySlug}`
}

/**
 * Construye la URL de una categoría usando el objeto Categoria
 * Formato: /{locale}/{category-slug}
 * 
 * @param category - Objeto Categoria con nombre
 * @param locale - Locale (es, en, pt)
 * @returns URL de la categoría
 */
export function buildCategoryUrlFromObject(
  category: { nombre: string; id?: number },
  locale: string = 'es'
): string {
  return buildCategoryUrl(category.nombre, locale)
}

/**
 * Construye la URL de una categoría con marca
 * Formato: /{locale}/{category-slug}/{brand-slug}
 * 
 * @param category - Objeto Categoria con nombre
 * @param brand - Objeto Marca con nombre o nombre de marca como string
 * @param locale - Locale (es, en, pt)
 * @returns URL de la categoría con marca
 */
export function buildCategoryBrandUrl(
  category: { nombre: string; id?: number },
  brand: { nombre: string; id?: number } | string,
  locale: string = 'es'
): string {
  const categorySlug = normalizeName(category.nombre)
  if (!categorySlug) {
    return `/${locale}`
  }

  // Obtener nombre de marca
  let brandName: string | undefined
  if (typeof brand === 'string') {
    brandName = brand
  } else if (typeof brand === 'object' && 'nombre' in brand) {
    brandName = brand.nombre
  }

  if (!brandName) {
    return `/${locale}/${categorySlug}`
  }

  const brandSlug = normalizeName(brandName)
  if (!brandSlug) {
    return `/${locale}/${categorySlug}`
  }

  return `/${locale}/${categorySlug}/${brandSlug}`
}

/**
 * Valida que un slug sea válido
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false
  }

  // Debe tener al menos 3 caracteres
  if (slug.length < 3) {
    return false
  }

  // Debe tener máximo 100 caracteres
  if (slug.length > 100) {
    return false
  }

  // Solo debe contener letras minúsculas, números y guiones
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return false
  }

  // No debe empezar o terminar con guión
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return false
  }

  // No debe tener guiones consecutivos
  if (slug.includes('--')) {
    return false
  }

  return true
}

