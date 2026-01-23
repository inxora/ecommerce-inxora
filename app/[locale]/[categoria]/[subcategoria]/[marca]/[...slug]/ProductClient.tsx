'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { Producto, Product } from '@/lib/supabase'
import { ProductInfo } from '@/components/product/product-info'
import { ProductImageZoom } from '@/components/product/product-image-zoom'
import { RelatedProductsCarousel } from '@/components/product/related-products-carousel'
import { buildCategoryUrl, buildCategorySubcategoriaUrl, normalizeName } from '@/lib/product-url'
import { ProductsService } from '@/lib/services/products.service'

interface ProductClientProps {
  product: Producto
  relatedProducts: Producto[]
  locale: string
}

export default function ProductClient({ product, relatedProducts, locale }: ProductClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  // Debug: Verificar que descripcion_detallada esté presente
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[ProductClient] Product descripcion_detallada:', {
        hasDescripcionDetallada: !!product.descripcion_detallada,
        length: product.descripcion_detallada?.length || 0,
        preview: product.descripcion_detallada?.substring(0, 100) || 'N/A'
      })
    }
  }, [product.descripcion_detallada])

  // Incrementar visualización al cargar la página (solo una vez)
  const hasTrackedView = useRef(false)
  useEffect(() => {
    if (product?.sku && !hasTrackedView.current) {
      hasTrackedView.current = true
      ProductsService.incrementarVisualizacion(product.sku).catch(() => {
        // Silenciar errores - no es crítico para el usuario
      })
    }
  }, [product?.sku])

  // Construir array de imágenes válidas
  const images: string[] = []
  
  if (product.imagen_principal_url && product.imagen_principal_url.trim() !== '') {
    images.push(product.imagen_principal_url)
  }
  
  if (product.galeria_imagenes_urls && Array.isArray(product.galeria_imagenes_urls)) {
    product.galeria_imagenes_urls.forEach(url => {
      if (url && typeof url === 'string' && url.trim() !== '' && !images.includes(url)) {
        images.push(url)
      }
    })
  }
  
  if (images.length === 0) {
    images.push('/placeholder-product.svg')
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href={`/${locale}`} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                    Inicio
                  </Link>
                </li>
                {(() => {
                  // Usar primera categoría del array categorias, o categoria como fallback
                  const categoria = product?.categorias && product.categorias.length > 0
                    ? product.categorias[0]
                    : product?.categoria
                  
                  // Obtener subcategoría si está disponible
                  const subcategoria = product?.subcategoria_principal
                  
                  return (
                    <>
                      {categoria && (
                        <li>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <Link 
                              href={
                                typeof categoria === 'object' && categoria.nombre
                                  ? buildCategoryUrl(categoria.nombre, locale)
                                  : `/${locale}/categoria`
                              } 
                              className="text-sm font-medium text-gray-700 hover:text-inxora-blue dark:text-gray-400 dark:hover:text-inxora-light-blue transition-colors"
                            >
                              {typeof categoria === 'object' ? categoria.nombre : 'Categoría'}
                            </Link>
                          </div>
                        </li>
                      )}
                      {subcategoria && typeof categoria === 'object' && categoria.nombre && (
                        <li>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <Link 
                              href={`/${locale}/${normalizeName(categoria.nombre)}/${normalizeName(subcategoria.nombre)}`}
                              className="text-sm font-medium text-gray-700 hover:text-inxora-blue dark:text-gray-400 dark:hover:text-inxora-light-blue transition-colors"
                            >
                              {subcategoria.nombre}
                            </Link>
                          </div>
                        </li>
                      )}
                    </>
                  )
                })()}
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {product.nombre}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12" style={{ minHeight: '500px' }}>
            {/* Product Images */}
            <div className="space-y-4 lg:space-y-6 bg-white dark:bg-slate-800 p-4 lg:p-6">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50 dark:bg-slate-700" style={{ minHeight: '400px' }}>
                <ProductImageZoom
                  src={images[currentImageIndex] || '/placeholder-product.svg'}
                  alt={product.nombre}
                  className="w-full h-full rounded-2xl"
                  priority={currentImageIndex === 0}
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'bg-white shadow-lg scale-125' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-200 hover:scale-105 ${
                        index === currentImageIndex 
                          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                      }`}
                    >
                      <img
                        src={image || '/placeholder-product.svg'}
                        alt={`${product.nombre} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          if (target.src !== '/placeholder-product.svg') {
                            target.src = '/placeholder-product.svg'
                          }
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="bg-white dark:bg-slate-800 p-4 lg:p-6 xl:p-8">
              <ProductInfo product={product as Product} />
            </div>
          </div>

          {/* Product Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-4 lg:p-6 xl:p-8 mt-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Etiquetas
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-md text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Details Sections */}
        {product.descripcion_detallada && product.descripcion_detallada.trim() !== '' && (
          <div className="w-full bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full mr-3"></div>
                Descripción Detallada
              </h3>
              <div className="relative">
                <div 
                  className={`text-gray-700 dark:text-gray-300 prose prose-lg max-w-none dark:prose-invert
                  prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-bold
                  prose-p:mb-6 prose-p:leading-relaxed prose-p:text-base lg:prose-p:text-lg prose-p:text-gray-700 dark:prose-p:text-gray-300
                  prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold prose-strong:text-lg
                  prose-ul:my-8 prose-ul:space-y-4 prose-ul:pl-6
                  prose-ol:my-8 prose-ol:space-y-4 prose-ol:pl-6
                  prose-li:marker:text-green-600 dark:prose-li:marker:text-green-400
                  prose-li:ml-4 prose-li:leading-relaxed prose-li:text-base lg:prose-li:text-lg
                  prose-li:pl-2 prose-li:my-2
                  prose-h3:text-xl lg:prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-10 prose-h3:mb-6 prose-h3:text-gray-900 dark:prose-h3:text-white
                  prose-h4:text-lg lg:prose-h4:text-xl prose-h4:font-semibold prose-h4:mt-8 prose-h4:mb-4 prose-h4:text-gray-800 dark:prose-h4:text-gray-200
                  prose-h2:text-2xl lg:prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6
                  prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-blockquote:border-l-4 prose-blockquote:border-green-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6
                  prose-table:w-full prose-table:my-6
                  prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600 prose-th:px-4 prose-th:py-2 prose-th:bg-gray-100 dark:prose-th:bg-gray-700
                  prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600 prose-td:px-4 prose-td:py-2
                  [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                  [&>p]:mb-6 [&>p]:leading-7
                  [&>ul>li]:mb-3 [&>ol>li]:mb-3
                  [&>h2]:mt-12 [&>h2]:mb-6
                  [&>h3]:mt-10 [&>h3]:mb-6
                  transition-all duration-300 overflow-hidden
                  ${isDescriptionExpanded ? 'max-h-none columns-1' : 'max-h-96 columns-1'}
                `}
                  dangerouslySetInnerHTML={{ __html: product.descripcion_detallada }}
                />
                {!isDescriptionExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-800 to-transparent pointer-events-none"></div>
                )}
              </div>
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
              >
                {isDescriptionExpanded ? (
                  <>
                    <span>Ver menos</span>
                    <ChevronUp className="h-5 w-5" />
                  </>
                ) : (
                  <>
                    <span>Ver más</span>
                    <ChevronDown className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="w-full bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
              <RelatedProductsCarousel products={relatedProducts} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

