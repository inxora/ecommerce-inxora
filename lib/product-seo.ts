/**
 * Utilidades para generar SEO y JSON-LD dinámico para productos
 * Genera URLs canónicas, meta tags optimizados y datos estructurados Schema.org
 */

import { Producto } from './supabase'
import { normalizeName } from './product-url'

/**
 * Obtiene la categoría principal del producto
 * Busca la categoría con es_principal = true, o la primera del array
 * Maneja categorías del producto
 */
function getCategoriaPrincipal(product: Producto): { nombre: string } | undefined {
  if (!product.categorias || product.categorias.length === 0) {
    return product.categoria && typeof product.categoria === 'object'
      ? product.categoria
      : undefined
  }

  // Las categorías vienen directamente del producto
  // Intentar encontrar la categoría principal buscando en el array
  for (const cat of product.categorias) {
    if (typeof cat === 'object' && cat !== null) {
      // Verificar si tiene es_principal directamente
      if ('es_principal' in cat && cat.es_principal === true) {
        return cat
      }
      
      // Verificar si es una categoría anidada
      if ('categoria' in cat && typeof cat.categoria === 'object' && cat.categoria !== null) {
        const categoriaRelacion = cat.categoria as any
        if (categoriaRelacion.es_principal === true) {
          return categoriaRelacion
        }
      }
    }
  }

  // Si no hay principal, usar la primera categoría disponible
  const primeraCategoria = product.categorias[0]
  if (primeraCategoria && typeof primeraCategoria === 'object') {
    // Si es una relación, extraer la categoría
    if ('categoria' in primeraCategoria && typeof primeraCategoria.categoria === 'object') {
      return primeraCategoria.categoria as { nombre: string }
    }
    return primeraCategoria
  }

  return undefined
}

/**
 * Genera la URL canónica del producto
 * Formato: https://tienda.inxora.com/{locale}/producto/{categoria-principal}/{marca}/{seo-slug}
 * 
 * @param product - Producto con sus datos
 * @param locale - Locale (es, en, pt)
 * @returns URL canónica completa
 */
export function generateCanonicalUrl(product: Producto, locale: string = 'es'): string {
  const baseUrl = 'https://tienda.inxora.com'
  
  if (!product.seo_slug) {
    console.warn('Producto sin seo_slug:', product.sku)
    return `${baseUrl}/${locale}/producto`
  }

  // Obtener categoría principal
  const categoriaPrincipal = getCategoriaPrincipal(product)
  const categoriaNombre = categoriaPrincipal?.nombre

  // Obtener nombre de marca
  let marcaNombre: string | undefined
  if (product.marca) {
    if (typeof product.marca === 'string') {
      marcaNombre = product.marca
    } else if (typeof product.marca === 'object' && 'nombre' in product.marca) {
      marcaNombre = product.marca.nombre
    }
  }

  // Normalizar nombres para URL
  const categoriaSlug = categoriaNombre ? normalizeName(categoriaNombre) : undefined
  const marcaSlug = marcaNombre ? normalizeName(marcaNombre) : undefined

  // Construir URL: /{locale}/producto/{categoria}/{marca}/{slug}
  if (categoriaSlug && marcaSlug) {
    return `${baseUrl}/${locale}/producto/${categoriaSlug}/${marcaSlug}/${product.seo_slug}`
  }

  // Fallback: solo categoría
  if (categoriaSlug) {
    return `${baseUrl}/${locale}/producto/${categoriaSlug}/${product.seo_slug}`
  }

  // Fallback: solo marca
  if (marcaSlug) {
    return `${baseUrl}/${locale}/producto/${marcaSlug}/${product.seo_slug}`
  }

  // Fallback mínimo: solo slug
  return `${baseUrl}/${locale}/producto/${product.seo_slug}`
}

/**
 * Limpia el HTML de una descripción y extrae solo el texto plano
 * Elimina etiquetas HTML como <ul>, <li>, <p>, etc.
 */
function cleanHtmlDescription(html: string | null | undefined): string {
  if (!html || typeof html !== 'string') {
    return ''
  }

  // Remover etiquetas HTML
  let text = html
    .replace(/<[^>]*>/g, ' ') // Eliminar todas las etiquetas HTML
    .replace(/\s+/g, ' ') // Normalizar espacios múltiples
    .trim()

  // Limitar longitud (máximo 500 caracteres para descripción)
  if (text.length > 500) {
    text = text.substring(0, 497) + '...'
  }

  return text
}

/**
 * Genera el título SEO optimizado para productos
 * Formato: [Nombre del Producto] | [Marca] | Inxora Perú
 * Si supera 60 caracteres, acorta el nombre del producto y mantiene | Inxora
 * 
 * @param product - Producto con sus datos
 * @returns Título SEO optimizado
 */
export function generateSeoTitle(product: Producto): string {
  const nombreProducto = product.nombre || 'Producto'
  
  // Obtener nombre de marca
  let marcaNombre: string | undefined
  if (product.marca) {
    if (typeof product.marca === 'string') {
      marcaNombre = product.marca
    } else if (typeof product.marca === 'object' && 'nombre' in product.marca) {
      marcaNombre = product.marca.nombre
    }
  }

  // Construir título base: [Nombre] | [Marca] | Inxora Perú
  let title = nombreProducto
  if (marcaNombre) {
    title = `${nombreProducto} | ${marcaNombre} | Inxora Perú`
  } else {
    title = `${nombreProducto} | Inxora Perú`
  }

  // Si supera 60 caracteres, acortar el nombre del producto
  const maxLength = 60
  if (title.length > maxLength) {
    const suffix = marcaNombre ? ` | ${marcaNombre} | Inxora` : ' | Inxora'
    const availableLength = maxLength - suffix.length
    
    if (availableLength > 10) {
      // Acortar el nombre del producto manteniendo palabras completas
      let shortenedName = nombreProducto
      if (shortenedName.length > availableLength) {
        // Truncar en el último espacio antes del límite
        const truncated = shortenedName.substring(0, availableLength)
        const lastSpace = truncated.lastIndexOf(' ')
        if (lastSpace > 10) {
          shortenedName = truncated.substring(0, lastSpace) + '...'
        } else {
          shortenedName = truncated + '...'
        }
      }
      
      title = marcaNombre 
        ? `${shortenedName} | ${marcaNombre} | Inxora`
        : `${shortenedName} | Inxora`
    } else {
      // Si no hay espacio suficiente, usar solo nombre acortado + Inxora
      const shortenedName = nombreProducto.substring(0, maxLength - 12) + '...'
      title = `${shortenedName} | Inxora`
    }
  }

  return title.trim()
}

/**
 * Genera las meta keywords optimizadas para productos
 * Combina: marca, categoría principal, SKU/modelo y palabras transaccionales
 * 
 * @param product - Producto con sus datos
 * @returns String de keywords separadas por comas
 */
export function generateMetaKeywords(product: Producto): string {
  const keywords: string[] = []

  // 1. Nombre de la marca
  if (product.marca) {
    const marcaNombre = typeof product.marca === 'object' 
      ? product.marca.nombre 
      : product.marca
    if (marcaNombre) {
      keywords.push(marcaNombre)
    }
  }

  // 2. Nombre de la categoría principal
  const categoriaPrincipal = getCategoriaPrincipal(product)
  if (categoriaPrincipal?.nombre) {
    keywords.push(categoriaPrincipal.nombre)
  }

  // 3. SKU o modelo del producto
  if (product.sku_producto) {
    keywords.push(product.sku_producto)
  }
  
  // También agregar código de producto de marca si existe
  if (product.cod_producto_marca) {
    keywords.push(product.cod_producto_marca)
  }

  // 4. Palabras clave del nombre del producto (primeras 3-4 palabras importantes)
  const nombrePalabras = product.nombre
    .split(/\s+/)
    .filter(p => p.length > 3) // Filtrar palabras muy cortas
    .slice(0, 4) // Tomar las primeras 4 palabras
  keywords.push(...nombrePalabras)

  // 5. Palabras transaccionales según el tipo de producto
  const categoriaNombre = categoriaPrincipal?.nombre?.toLowerCase() || ''
  
  // Palabras transaccionales base
  keywords.push('precio', 'venta', 'Perú', 'Inxora')
  
  // Palabras específicas según categoría
  if (categoriaNombre.includes('herramienta')) {
    keywords.push('herramientas profesionales', 'herramientas industriales')
  }
  if (categoriaNombre.includes('equipo') || categoriaNombre.includes('maquinaria')) {
    keywords.push('equipos industriales', 'maquinaria industrial')
  }
  if (categoriaNombre.includes('seguridad')) {
    keywords.push('equipos de seguridad', 'protección personal')
  }

  // 6. Disponibilidad si está en stock
  if (product.id_disponibilidad === 1) {
    keywords.push('stock disponible', 'envío inmediato')
  }

  // Eliminar duplicados y vacíos, convertir a minúsculas y unir
  const uniqueKeywords = Array.from(new Set(
    keywords
      .map(k => k.trim())
      .filter(k => k.length > 0)
      .map(k => k.toLowerCase())
  ))

  return uniqueKeywords.join(', ')
}

/**
 * Limpia y optimiza el seo_description
 * Si empieza con "✅ En INXORA...", genera una descripción completa y optimizada
 * Formato deseado: "Compra [Producto] [Marca] [Modelo] al mejor precio en Inxora Perú. [Beneficios]"
 * 
 * @param seoDescription - Descripción SEO original
 * @param product - Producto completo para generar descripción mejorada
 * @returns Descripción SEO optimizada
 */
export function cleanSeoDescription(
  seoDescription: string | null | undefined,
  product: Producto
): string {
  const productName = product.nombre || 'Producto'
  
  // Verificar si la descripción empieza con el prefijo problemático
  const hasProblematicPrefix = seoDescription && (
    seoDescription.trim().startsWith('✅ En INXORA') ||
    seoDescription.trim().startsWith('En INXORA') ||
    /^✅\s*En\s+INXORA/i.test(seoDescription.trim())
  )

  // Si tiene el prefijo problemático o no hay descripción, generar una nueva
  if (hasProblematicPrefix || !seoDescription || seoDescription.trim().length < 20) {
    return generateOptimizedDescription(product)
  }

  // Si la descripción es válida, limpiarla
  let cleaned = seoDescription.trim()

  // Eliminar prefijos comunes que reducen el CTR
  const prefixesToRemove = [
    /^✅\s*En\s+INXORA\s+encuentras?\s+mas?\s+productos?\s+como\s*/i,
    /^✅\s*En\s+INXORA\s+/i,
    /^En\s+INXORA\s+encuentras?\s+mas?\s+productos?\s+como\s*/i,
    /^En\s+INXORA\s+/i,
    /^✅\s*/i,
  ]

  for (const prefix of prefixesToRemove) {
    cleaned = cleaned.replace(prefix, '')
  }

  // Si después de limpiar está vacío o muy corto, generar una nueva
  if (cleaned.length < 20) {
    return generateOptimizedDescription(product)
  }

  // Asegurar que empiece con el nombre del producto si no lo hace
  if (!cleaned.toLowerCase().startsWith(productName.toLowerCase().substring(0, 20))) {
    // Si no empieza con el nombre, intentar agregarlo al inicio
    const firstSentence = cleaned.split(/[.!?]/)[0]
    if (firstSentence.length < 50) {
      cleaned = `${productName}. ${cleaned}`
    }
  }

  // Limitar longitud (máximo 160 caracteres para meta description)
  if (cleaned.length > 160) {
    cleaned = cleaned.substring(0, 157) + '...'
  }

  return cleaned.trim()
}

/**
 * Genera una descripción SEO optimizada desde cero
 * Formato: "Compra [Producto] [Marca] [Modelo] al mejor precio en Inxora Perú. [Beneficios]"
 */
function generateOptimizedDescription(product: Producto): string {
  const nombreProducto = product.nombre || 'Producto'
  
  // Obtener marca
  let marcaNombre: string | undefined
  if (product.marca) {
    marcaNombre = typeof product.marca === 'object' 
      ? product.marca.nombre 
      : product.marca
  }

  // Obtener modelo/SKU
  const modelo = product.cod_producto_marca || product.sku_producto || ''

  // Construir inicio de la descripción
  let description = 'Compra '
  
  // Agregar nombre del producto (acortado si es muy largo)
  const nombreParaDescripcion = nombreProducto.length > 50 
    ? nombreProducto.substring(0, 47) + '...'
    : nombreProducto
  
  description += nombreParaDescripcion

  // Agregar marca si existe
  if (marcaNombre) {
    description += ` ${marcaNombre}`
  }

  // Agregar modelo si existe y hay espacio
  if (modelo && description.length < 80) {
    description += ` ${modelo}`
  }

  // Agregar información de precio y disponibilidad
  description += ' al mejor precio en Inxora Perú.'

  // Agregar beneficios si hay disponibilidad
  if (product.id_disponibilidad === 1) {
    description += ' Contamos con stock inmediato y envíos a todo el país.'
  } else {
    description += ' Envíos a todo el país.'
  }

  // Extraer beneficios de descripción corta si existe
  if (product.descripcion_corta) {
    const descripcionLimpia = cleanHtmlDescription(product.descripcion_corta)
    if (descripcionLimpia) {
      // Tomar las primeras 2-3 características importantes
      const caracteristicas = descripcionLimpia
        .split(/[.,;]/)
        .filter(c => c.trim().length > 20 && c.trim().length < 80)
        .slice(0, 2)
        .map(c => c.trim())
      
      if (caracteristicas.length > 0 && description.length < 120) {
        description += ' ' + caracteristicas.join('. ') + '.'
      }
    }
  }

  // Limitar a 160 caracteres
  if (description.length > 160) {
    description = description.substring(0, 157) + '...'
  }

  return description.trim()
}

/**
 * Obtiene el precio en la moneda preferida (prioriza PEN, luego USD)
 */
function getPreferredPrice(product: Producto): {
  precio: number
  moneda: string
} | null {
  // Priorizar precios_por_moneda si existe
  if (product.precios_por_moneda?.soles) {
    return {
      precio: product.precios_por_moneda.soles.precio_venta,
      moneda: 'PEN',
    }
  }

  if (product.precios_por_moneda?.dolares) {
    return {
      precio: product.precios_por_moneda.dolares.precio_venta,
      moneda: 'USD',
    }
  }

  // Fallback: buscar en array de precios
  if (product.precios && product.precios.length > 0) {
    // Buscar precio en PEN primero
    const precioPEN = product.precios.find(
      (p) => p.moneda?.codigo === 'PEN' || p.id_moneda === 1
    )
    if (precioPEN) {
      return {
        precio: precioPEN.precio_venta,
        moneda: precioPEN.moneda?.codigo || 'PEN',
      }
    }

    // Si no hay PEN, usar el primero disponible
    const primerPrecio = product.precios[0]
    if (primerPrecio) {
      return {
        precio: primerPrecio.precio_venta,
        moneda: primerPrecio.moneda?.codigo || 'USD',
      }
    }
  }

  // Último fallback: precio_venta directo
  if (product.precio_venta && product.moneda) {
    return {
      precio: product.precio_venta,
      moneda: product.moneda.codigo,
    }
  }

  return null
}

/**
 * Determina la disponibilidad según Schema.org
 */
function getAvailability(product: Producto): string {
  // id_disponibilidad = 1 significa "INMEDIATO" = InStock
  if (product.id_disponibilidad === 1) {
    return 'https://schema.org/InStock'
  }

  // Verificar también el objeto disponibilidad si existe
  if (product.disponibilidad) {
    const disponibilidadNombre =
      typeof product.disponibilidad === 'object'
        ? product.disponibilidad.nombre
        : product.disponibilidad

    if (
      disponibilidadNombre &&
      (disponibilidadNombre.toLowerCase().includes('disponible') ||
        disponibilidadNombre.toLowerCase().includes('inmediato') ||
        disponibilidadNombre.toLowerCase().includes('stock'))
    ) {
      return 'https://schema.org/InStock'
    }
  }

  return 'https://schema.org/OutOfStock'
}

/**
 * Genera el JSON-LD Schema.org para Product
 * Incluye todos los campos requeridos según las especificaciones
 */
export function generateProductJsonLd(
  product: Producto,
  locale: string = 'es'
): object {
  const canonicalUrl = generateCanonicalUrl(product, locale)

  // Obtener imagen principal (asegurar URL absoluta)
  const imageUrl = product.imagen_principal_url
    ? product.imagen_principal_url.startsWith('http')
      ? product.imagen_principal_url
      : `https://tienda.inxora.com${product.imagen_principal_url}`
    : 'https://tienda.inxora.com/inxora.png'

  // Construir array de imágenes (principal + galería)
  const images: string[] = [imageUrl]
  if (product.galeria_imagenes_urls && product.galeria_imagenes_urls.length > 0) {
    product.galeria_imagenes_urls.forEach((img) => {
      const absoluteUrl = img.startsWith('http')
        ? img
        : `https://tienda.inxora.com${img}`
      if (!images.includes(absoluteUrl)) {
        images.push(absoluteUrl)
      }
    })
  }

  // Limpiar descripción (extraer texto plano del HTML)
  const description = cleanHtmlDescription(product.descripcion_corta) || product.nombre

  // Obtener marca
  let brand: { '@type': string; name: string } | undefined
  if (product.marca) {
    const marcaNombre =
      typeof product.marca === 'object' ? product.marca.nombre : product.marca
    if (marcaNombre) {
      brand = {
        '@type': 'Brand',
        name: marcaNombre,
      }
    }
  }

  // Obtener precio preferido
  const precio = getPreferredPrice(product)

  // Construir objeto Offer
  let offers: object | undefined
  if (precio) {
    offers = {
      '@type': 'Offer',
      price: precio.precio.toString(),
      priceCurrency: precio.moneda,
      availability: getAvailability(product),
      url: canonicalUrl,
      seller: {
        '@type': 'Organization',
        name: 'INXORA',
        url: 'https://tienda.inxora.com',
      },
      priceValidUntil: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString().split('T')[0],
    }
  }

  // Construir categoría para el schema
  const categoriaPrincipal = getCategoriaPrincipal(product)
  const categoriaNombre = categoriaPrincipal?.nombre

  // Construir JSON-LD Schema.org Product
  const productSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nombre,
    image: images.length === 1 ? images[0] : images,
    description: description,
    sku: product.sku_producto || product.sku.toString(),
    url: canonicalUrl,
  }

  // Agregar brand si existe
  if (brand) {
    productSchema.brand = brand
  }

  // Agregar categoría si existe
  if (categoriaNombre) {
    productSchema.category = categoriaNombre
  }

  // Agregar oferta si existe
  if (offers) {
    productSchema.offers = offers
  }

  // Agregar datos estructurados adicionales del producto si existen
  if (product.structured_data && typeof product.structured_data === 'object') {
    Object.assign(productSchema, product.structured_data)
  }

  return productSchema
}

/**
 * Genera todos los datos SEO para un producto
 * Retorna un objeto con URL canónica, título SEO, descripción, keywords y JSON-LD
 */
export function generateProductSeo(product: Producto, locale: string = 'es') {
  return {
    canonicalUrl: generateCanonicalUrl(product, locale),
    seoTitle: generateSeoTitle(product),
    seoDescription: cleanSeoDescription(product.seo_description, product),
    seoKeywords: generateMetaKeywords(product),
    jsonLd: generateProductJsonLd(product, locale),
  }
}
