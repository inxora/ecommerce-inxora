/**
 * Script para subir imágenes de marcas a Supabase Storage
 * y actualizar los registros en la base de datos
 * 
 * Uso:
 * 1. Coloca las imágenes de marcas en la carpeta public/marcas/
 * 2. Nombra las imágenes con el nombre de la marca o su ID (ej: "mitutoyo.png", "1.png")
 * 3. Ejecuta: node scripts/upload-brand-images.js
 * 
 * Requisitos:
 * - Tener las variables de entorno configuradas (.env.local)
 * - Tener permisos de escritura en Supabase Storage
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno')
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Configuración
const BUCKET_NAME = 'marcas-images'
const IMAGES_DIR = path.join(__dirname, '../public/marcas')
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.webp']

/**
 * Normaliza el nombre del archivo para usarlo como nombre en storage
 */
function normalizeFileName(fileName) {
  return fileName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-.]/g, '')
}

/**
 * Obtiene todas las marcas de la base de datos
 */
async function getBrands() {
  const { data, error } = await supabase
    .from('marca')
    .select('id, nombre')
    .eq('activo', true)
    .order('nombre')

  if (error) {
    console.error('❌ Error al obtener marcas:', error)
    return []
  }

  return data || []
}

/**
 * Sube una imagen al storage de Supabase
 */
async function uploadImage(filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath)
  const normalizedName = normalizeFileName(fileName)

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(normalizedName, fileBuffer, {
      contentType: `image/${path.extname(fileName).slice(1)}`,
      upsert: true // Sobrescribe si ya existe
    })

  if (error) {
    console.error(`❌ Error al subir ${fileName}:`, error)
    return null
  }

  // Obtener la URL pública
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(normalizedName)

  return urlData?.publicUrl || null
}

/**
 * Actualiza el logo_url de una marca en la base de datos
 */
async function updateBrandLogo(brandId, logoUrl) {
  const { error } = await supabase
    .from('marca')
    .update({ logo_url: logoUrl })
    .eq('id', brandId)

  if (error) {
    console.error(`❌ Error al actualizar marca ${brandId}:`, error)
    return false
  }

  return true
}

/**
 * Busca la marca correspondiente a un archivo
 */
function findBrandForFile(fileName, brands) {
  const nameWithoutExt = path.basename(fileName, path.extname(fileName))
  
  // Intentar por ID numérico
  const idMatch = nameWithoutExt.match(/^(\d+)$/)
  if (idMatch) {
    const brandId = parseInt(idMatch[1])
    return brands.find(b => b.id === brandId)
  }

  // Intentar por nombre (case insensitive, sin espacios)
  const normalizedName = nameWithoutExt.toLowerCase().replace(/\s+/g, '-')
  return brands.find(b => {
    const brandName = b.nombre.toLowerCase().replace(/\s+/g, '-')
    return brandName.includes(normalizedName) || normalizedName.includes(brandName)
  })
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando subida de imágenes de marcas...\n')

  // Verificar que existe la carpeta
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Error: La carpeta ${IMAGES_DIR} no existe`)
    console.log('💡 Crea la carpeta public/marcas/ y coloca las imágenes allí')
    process.exit(1)
  }

  // Obtener marcas de la BD
  console.log('📋 Obteniendo marcas de la base de datos...')
  const brands = await getBrands()
  console.log(`✅ Se encontraron ${brands.length} marcas activas\n`)

  if (brands.length === 0) {
    console.log('⚠️  No hay marcas activas en la base de datos')
    return
  }

  // Listar archivos de imágenes
  const files = fs.readdirSync(IMAGES_DIR)
    .filter(file => ALLOWED_EXTENSIONS.includes(path.extname(file).toLowerCase()))

  if (files.length === 0) {
    console.log(`⚠️  No se encontraron imágenes en ${IMAGES_DIR}`)
    console.log(`💡 Formatos permitidos: ${ALLOWED_EXTENSIONS.join(', ')}`)
    return
  }

  console.log(`📸 Se encontraron ${files.length} imágenes\n`)

  let successCount = 0
  let errorCount = 0
  let skippedCount = 0

  // Procesar cada imagen
  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file)
    const brand = findBrandForFile(file, brands)

    if (!brand) {
      console.log(`⚠️  No se encontró marca para: ${file} (saltando)`)
      skippedCount++
      continue
    }

    console.log(`📤 Subiendo ${file} para marca: ${brand.nombre} (ID: ${brand.id})...`)

    // Subir imagen
    const logoUrl = await uploadImage(filePath, file)

    if (!logoUrl) {
      console.log(`❌ Error al subir ${file}`)
      errorCount++
      continue
    }

    // Actualizar registro en BD
    const updated = await updateBrandLogo(brand.id, logoUrl)

    if (updated) {
      console.log(`✅ ${brand.nombre}: ${logoUrl}\n`)
      successCount++
    } else {
      console.log(`❌ Error al actualizar ${brand.nombre}`)
      errorCount++
    }
  }

  // Resumen
  console.log('\n' + '='.repeat(50))
  console.log('📊 Resumen:')
  console.log(`✅ Exitosas: ${successCount}`)
  console.log(`❌ Errores: ${errorCount}`)
  console.log(`⚠️  Omitidas: ${skippedCount}`)
  console.log('='.repeat(50))
}

// Ejecutar
main().catch(console.error)

