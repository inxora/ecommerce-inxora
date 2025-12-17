import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Obtener todos los productos
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
  
  // Obtener todas las categorías
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at')

  const baseUrl = 'https://tienda.inxora.com'

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  // Páginas de productos
  const productPages: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${baseUrl}/producto/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Páginas de categorías
  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((category) => ({
    url: `${baseUrl}/categoria/${category.slug}`,
    lastModified: new Date(category.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...productPages]
}
