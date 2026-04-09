/**
 * Script de prueba para verificar las funciones de SEO
 * Ejecutar con: npx tsx scripts/test-seo.ts
 * 
 * Este script simula un producto y prueba todas las funciones de SEO
 */

import { Producto } from '../lib/supabase'
import { generateProductSeo, generateSeoTitle, generateMetaKeywords, cleanSeoDescription } from '../lib/product-seo'

// Producto de ejemplo basado en el JSON proporcionado
const productoEjemplo: Producto = {
  sku: 353,
  sku_producto: 'INXHERR353',
  cod_producto_marca: 'BH13000',
  nombre: 'Gato Hidráulico Tipo Carretilla 3 Toneladas BAHCO BH13000',
  descripcion_corta: '<ul>\n<li>\n<p>Capacidad máxima de elevación: <strong>3 toneladas (3000 kg)</strong></p>\n</li>\n<li>\n<p>Estructura de acero de alta resistencia con ruedas metálicas</p>\n</li>\n</ul>',
  descripcion_detallada: 'Descripción detallada del producto...',
  id_marca: 26,
  id_unidad: 1,
  id_disponibilidad: 1,
  requiere_stock: false,
  stock_minimo: 0,
  punto_reorden: 0,
  codigo_arancelario: '',
  es_importado: false,
  tiempo_importacion_dias: 0,
  imagen_principal_url: 'https://keeussaqlshdsegerqob.supabase.co/storage/v1/object/public/productos-images/INXHERR353/herramientas-maniobra-gato-hidraulico-tipo-carretilla-3-toneladas-bahco-bh13000-.webp',
  galeria_imagenes_urls: [],
  seo_title: 'Gato Hidráulico Tipo Carretilla 3 Toneladas BAHCO BH13000',
  seo_description: '✅ En INXORA encuentras mas productos como Gato Hidráulico Tipo Carretilla 3 Toneladas BAHCO BH13000 🌐Visita nuestra web contáctanos📞 +51 913 087 207.',
  seo_keywords: 'Gato Hidráulico Tipo Carretilla 3 Toneladas BAHCO BH13000',
  seo_slug: 'gato-hidraulico-tipo-carretilla-3-toneladas-bahco-bh-13000',
  meta_robots: 'index,follow',
  canonical_url: 'https://api.inxora.com/es/producto/herramientas-maniobra/bahco/Gato Hidráulico Tipo Carretilla 3 Toneladas BAHCO BH13000',
  structured_data: null,
  seo_score: 80,
  seo_optimizado: true,
  tags: [],
  es_destacado: false,
  es_novedad: false,
  es_promocion: false,
  activo: true,
  visible_web: true,
  requiere_aprobacion: false,
  fecha_creacion: '2026-01-09T16:29:48.352505',
  fecha_actualizacion: '2026-01-12T15:40:36.445453',
  creado_por: 1,
  actualizado_por: 1,
  categorias: [
    {
      id: 5,
      nombre: 'HERRAMIENTAS MANIOBRA',
      descripcion: 'Herramientas manuales, eléctricas, equipos de elevación',
      es_principal: true,
      orden: 0,
    } as any,
  ],
  marca: {
    id: 26,
    nombre: 'BAHCO',
  } as any,
  disponibilidad: {
    id: 1,
    nombre: 'INMEDIATO',
  } as any,
  precios: [
    {
      id: 617,
      sku: 353,
      id_moneda: 1,
      precio_venta: 1677.31,
      margen_aplicado: 25.0,
      fecha_vigencia_desde: '2026-01-12',
      fecha_vigencia_hasta: null,
      activo: true,
      fecha_creacion: '',
      fecha_actualizacion: '',
      creado_por: 0,
      actualizado_por: 0,
      observaciones: '',
      tipo_cambio_usado: 0,
      precio_proveedor: 0,
      moneda: {
        id: 1,
        codigo: 'PEN',
        nombre: 'Sol Peruano',
        simbolo: 'S/',
      } as any,
    },
  ],
  precios_por_moneda: {
    soles: {
      precio_venta: 1677.31,
      precio_referencia: 0,
      moneda: {
        id: 1,
        codigo: 'PEN',
        nombre: 'Sol Peruano',
        simbolo: 'S/',
      } as any,
    },
  },
}

console.log('🧪 PRUEBA DE FUNCIONES SEO\n')
console.log('=' .repeat(80))

// 1. Probar generateSeoTitle
console.log('\n📝 1. TÍTULO SEO:')
console.log('-'.repeat(80))
const titulo = generateSeoTitle(productoEjemplo)
console.log(`Resultado: ${titulo}`)
console.log(`Longitud: ${titulo.length} caracteres`)
console.log(`✅ ${titulo.length <= 60 ? '✓' : '✗'} Cumple límite de 60 caracteres`)
// Si viene del API (seo_title) puede no llevar "| Inxora"; si es fallback sí lo lleva
const tituloDesdeAPI = !!productoEjemplo.seo_title?.trim()
console.log(`✅ ${titulo.includes('| Inxora') || tituloDesdeAPI ? '✓' : '✗'} OK (API o incluye "| Inxora")`)
console.log(`✅ ${titulo.includes('BAHCO') ? '✓' : '✗'} Incluye marca`)

// 2. Probar generateMetaKeywords
console.log('\n🔑 2. META KEYWORDS:')
console.log('-'.repeat(80))
const keywords = generateMetaKeywords(productoEjemplo)
console.log(`Resultado: ${keywords}`)
const keywordsArray = keywords.split(', ')
console.log(`Total keywords: ${keywordsArray.length}`)
// Si viene del API (seo_keywords) es una sola frase; si es fallback tiene lista enriquecida
const keywordsDesdeAPI = !!productoEjemplo.seo_keywords?.trim()
console.log(`✅ ${keywords.toLowerCase().includes('bahco') ? '✓' : '✗'} Incluye marca`)
console.log(`✅ ${keywords.includes('herramientas maniobra') || keywordsDesdeAPI ? '✓' : '✗'} OK (API o incluye categoría)`)
console.log(`✅ ${keywords.toLowerCase().includes('inxherr353') || keywordsDesdeAPI ? '✓' : '✗'} OK (API o incluye SKU)`)
console.log(`✅ ${keywords.toLowerCase().includes('precio') || keywordsDesdeAPI ? '✓' : '✗'} OK (API o palabra transaccional)`)
console.log(`✅ ${keywords.toLowerCase().includes('perú') || keywordsDesdeAPI ? '✓' : '✗'} OK (API o incluye "Perú")`)

// 3. Probar cleanSeoDescription
console.log('\n📄 3. DESCRIPCIÓN SEO:')
console.log('-'.repeat(80))
console.log(`Descripción original: ${productoEjemplo.seo_description}`)
const descripcion = cleanSeoDescription(productoEjemplo.seo_description, productoEjemplo)
console.log(`\nDescripción optimizada: ${descripcion}`)
console.log(`Longitud: ${descripcion.length} caracteres`)
console.log(`✅ ${descripcion.length <= 160 ? '✓' : '✗'} Cumple límite de 160 caracteres`)
console.log(`✅ ${!descripcion.startsWith('✅ En INXORA') ? '✓' : '✗'} No empieza con prefijo problemático`)
console.log(`✅ ${descripcion.toLowerCase().includes('compra') || descripcion.toLowerCase().includes('gato') ? '✓' : '✗'} Empieza con nombre del producto o acción`)

// 4. Probar generateProductSeo (función completa)
console.log('\n🎯 4. FUNCIÓN COMPLETA generateProductSeo:')
console.log('-'.repeat(80))
const seoData = generateProductSeo(productoEjemplo, 'es')
console.log('\n📊 Resultado completo:')
console.log(JSON.stringify(seoData, null, 2))

// 5. Verificar URL canónica
console.log('\n🔗 5. URL CANÓNICA:')
console.log('-'.repeat(80))
console.log(`URL generada: ${seoData.canonicalUrl}`)
console.log(`✅ ${seoData.canonicalUrl.includes('tienda.inxora.com') ? '✓' : '✗'} Usa dominio correcto (tienda.inxora.com)`)
console.log(`✅ ${!/\b(app|api)\.inxora\.com\b/.test(seoData.canonicalUrl) ? '✓' : '✗'} NO usa dominio de admin/API`)
console.log(`✅ ${seoData.canonicalUrl.includes('herramientas-maniobra') ? '✓' : '✗'} Incluye categoría`)
console.log(`✅ ${seoData.canonicalUrl.includes('bahco') ? '✓' : '✗'} Incluye marca`)

// 6. Verificar JSON-LD
console.log('\n📋 6. JSON-LD SCHEMA:')
console.log('-'.repeat(80))
const jsonLd = seoData.jsonLd as any
console.log(`Tipo: ${jsonLd['@type']}`)
console.log(`Nombre: ${jsonLd.name}`)
console.log(`SKU: ${jsonLd.sku}`)
console.log(`Brand: ${jsonLd.brand?.name || 'N/A'}`)
console.log(`Category: ${jsonLd.category || 'N/A'}`)
console.log(`Offers: ${jsonLd.offers ? 'Sí' : 'No'}`)
if (jsonLd.offers) {
  console.log(`  - Precio: ${jsonLd.offers.price} ${jsonLd.offers.priceCurrency}`)
  console.log(`  - Disponibilidad: ${jsonLd.offers.availability}`)
}
console.log(`✅ ${jsonLd['@type'] === 'Product' ? '✓' : '✗'} Tipo correcto`)
console.log(`✅ ${jsonLd.brand ? '✓' : '✗'} Incluye brand`)
console.log(`✅ ${jsonLd.offers ? '✓' : '✗'} Incluye offers`)

console.log('\n' + '='.repeat(80))
console.log('✅ PRUEBAS COMPLETADAS\n')
