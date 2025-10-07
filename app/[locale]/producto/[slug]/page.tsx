'use client'

import { useState, useEffect } from 'react'

import { Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getProductBySlug, Producto } from '@/lib/supabase'

interface Review {
  id: string
  rating: number
  title: string
  content: string
  author: string
  date: string
}

export default function ProductPage({ params }: { params: { locale: string, slug: string } }) {
  const [product, setProduct] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      if (params.slug) {
        setLoading(true)
        try {
          const productData = await getProductBySlug(params.slug as string)
          setProduct(productData)
        } catch (error) {
          console.error('Error fetching product:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchProduct()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-w-1 aspect-h-1 w-full bg-gray-300 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Producto no encontrado
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              El producto que buscas no existe o no está disponible.
            </p>
            <Link 
              href={`/${params.locale}/catalogo`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
            >
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Get images array - use galeria_imagenes_urls if available, otherwise use imagen_principal_url
  const images = product.galeria_imagenes_urls && product.galeria_imagenes_urls.length > 0 
    ? product.galeria_imagenes_urls 
    : [product.imagen_principal_url]

  const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    )
  }

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log(`Added ${selectedQuantity} of ${product.nombre} to cart`)
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link href={`/${params.locale}`} className="hover:text-primary">
            Inicio
          </Link>
          <span>/</span>
          <Link href={`/${params.locale}/catalogo`} className="hover:text-primary">
            Catálogo
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{product.nombre}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <div 
                className="w-full h-full bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url("${images[currentImageIndex]}")` }}
              />
            </div>
            
            {/* Image thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex space-x-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex 
                        ? 'border-primary' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div 
                      className="w-full h-full bg-center bg-no-repeat bg-cover"
                      style={{ backgroundImage: `url("${image}")` }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {product.nombre}
            </h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900 dark:text-white">
                ${product.precio_venta?.toFixed(2) || 'Consultar precio'}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <p className="text-base text-gray-600 dark:text-gray-300">
                {product.descripcion_corta}
              </p>
            </div>

            {/* Detailed Description */}
            {product.descripcion_detallada && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Descripción Detallada
                </h3>
                <div 
                  className="text-base text-gray-600 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: product.descripcion_detallada }}
                />
              </div>
            )}

            {/* Technical Specifications */}
            {product.especificaciones_tecnicas && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Especificaciones Técnicas
                </h3>
                <div 
                  className="text-base text-gray-600 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: product.especificaciones_tecnicas }}
                />
              </div>
            )}

            {/* Applications */}
            {product.aplicaciones && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Aplicaciones
                </h3>
                <div 
                  className="text-base text-gray-600 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: product.aplicaciones }}
                />
              </div>
            )}

            {/* Brand and Category */}
            <div className="mt-6">
              <div className="flex items-center space-x-4">
                {product.marca && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">Marca:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{product.marca.nombre}</span>
                  </div>
                )}
                {product.categoria && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">Categoría:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{product.categoria.nombre}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart Form */}
            <form className="mt-10" onSubmit={(e) => { e.preventDefault(); handleAddToCart(); }}>
              <div className="flex items-start gap-4">
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="quantity">
                    Cantidad
                  </label>
                  <select 
                    className="form-select mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-primary focus:border-primary" 
                    id="quantity" 
                    name="quantity"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 pt-6">
                  <button 
                    className="w-full flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary" 
                    type="submit"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-4">
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Heart className="w-5 h-5 mr-2" />
                Favoritos
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Share2 className="w-5 h-5 mr-2" />
                Compartir
              </button>
            </div>
          </div>
        </div>

        {/* Product Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-16">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Etiquetas
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}