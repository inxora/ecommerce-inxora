import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Probar query de productos
    const { data: products, error: productsError } = await supabase
      .from('productos')
      .select(`
        seo_slug,
        canonical_url,
        fecha_actualizacion,
        id_marca,
        marca:marcas(id, nombre)
      `)
      .eq('activo', true)
      .eq('visible_web', true)
      .limit(5) // Solo 5 para prueba

    // Probar query de categorías
    const { data: categories, error: categoriesError } = await supabase
      .from('categoria')
      .select('id, nombre, fecha_actualizacion')
      .eq('activo', true)
      .limit(5)

    return NextResponse.json({
      success: true,
      products: {
        count: products?.length || 0,
        data: products?.slice(0, 2) || [], // Solo primeros 2 para no saturar
        error: productsError,
      },
      categories: {
        count: categories?.length || 0,
        data: categories?.slice(0, 2) || [],
        error: categoriesError,
      },
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 })
  }
}

