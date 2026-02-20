'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductImage } from '@/components/ui/product-image';
import { Producto, Categoria } from '@/lib/supabase';
import type { Banner } from '@/lib/types';
import { ProductGridLoader, Loader } from '@/components/ui/loader';
import { CategoriesCarousel } from '@/components/home/categories-carousel';
import { BannerSlot } from '@/components/banner/banner-slot';
import { ChevronRight, ChevronLeft, ShoppingCart } from 'lucide-react';
import { buildProductFullUrl } from '@/lib/product-url';
import { useCart } from '@/lib/hooks/use-cart';
import { useCurrency } from '@/lib/hooks/use-currency';
import { getDisplaySymbol } from '@/lib/constants/currencies';
import { formatPriceWithThousands } from '@/lib/utils';

const HERO_FALLBACK_IMAGE = '/suministros_industriales_inxora_ecommerce_2025_front_1_web.jpg'

interface HomeClientProps {
  locale: string;
  featuredProducts?: Producto[];
  newProducts?: Producto[];
  categories?: Categoria[];
  bannersHero?: Banner[];
  bannersRightDestacados?: Banner[];
  bannersRightNuevos?: Banner[];
  bannersBelowHero?: Banner[];
  bannersBelowCategories?: Banner[];
  bannersMiddle?: Banner[];
  bannersBetweenSections?: Banner[];
  bannersPreFooter?: Banner[];
}

// Helper para construir la URL del producto
function getProductUrl(product: Producto, locale: string): string {
  // Si tenemos todos los datos necesarios, construir URL canÃ³nica
  if (product.categoria && product.subcategoria_principal && product.marca && product.seo_slug) {
    return buildProductFullUrl(
      { nombre: typeof product.categoria === 'string' ? product.categoria : product.categoria.nombre },
      { nombre: product.subcategoria_principal.nombre },
      { nombre: product.marca.nombre },
      product.seo_slug,
      locale
    )
  }
  
  // Fallback: URL con seo_slug
  if (product.seo_slug) {
    return `/${locale}/producto/${product.seo_slug}`
  }
  
  // Ãšltimo fallback
  return `/${locale}/catalogo`
}

// Interfaz para el componente de Slider
interface ProductSliderProps {
  products: Producto[]
  locale: string
  title?: string
  subtitle?: string
  badgeText?: string
  badgeColor?: string
  bgColor?: string
  maxProducts?: number
  rightBannerSlot?: React.ReactNode
}

// Componente de Slider reutilizable para productos
function FeaturedProductsSlider({ 
  products, 
  locale, 
  title = "Productos Destacados",
  subtitle = "Los favoritos de nuestros clientes",
  badgeText = "Destacado",
  badgeColor = "bg-inxora-blue",
  bgColor = "bg-white dark:bg-slate-900",
  maxProducts = 20,
  rightBannerSlot,
}: ProductSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { addItem } = useCart()
  const { currencySymbol } = useCurrency()

  // Precio: priorizar precio_simbolo + precio_mostrar del API (moneda seleccionada)
  const getPrecioDisplay = (product: Producto) => {
    if (product.precio_simbolo != null && product.precio_mostrar != null) {
      return `${getDisplaySymbol(product.precio_simbolo)}${formatPriceWithThousands(product.precio_mostrar)}`
    }
    const precio = product.precio_venta ?? product.precios?.[0]?.precio_venta ?? 0
    return `${currencySymbol}${formatPriceWithThousands(precio)}`
  }

  const getPrecioNumerico = (product: Producto) => {
    if (product.precio_mostrar != null) return parseFloat(String(product.precio_mostrar))
    return product.precio_venta ?? product.precios?.[0]?.precio_venta ?? 0
  }
  
  // Duplicamos los productos para crear efecto infinito
  const limitedProducts = products.slice(0, maxProducts)
  const displayProducts = limitedProducts.length > 0 ? [...limitedProducts, ...limitedProducts] : []
  const realProductsCount = limitedProducts.length

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current && realProductsCount > 0) {
      const cardWidth = sliderRef.current.querySelector('.product-card')?.clientWidth || 300
      const gap = 24
      const scrollAmount = cardWidth + gap
      
      if (direction === 'right') {
        const newIndex = currentIndex + 1
        if (newIndex >= realProductsCount) {
          // Llegamos al final, saltar al inicio sin animaciÃ³n
          sliderRef.current.scrollTo({ left: 0, behavior: 'auto' })
          setCurrentIndex(0)
          // Luego hacer scroll suave al segundo
          setTimeout(() => {
            sliderRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' })
            setCurrentIndex(1)
          }, 50)
        } else {
          sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
          setCurrentIndex(newIndex)
        }
      } else {
        const newIndex = currentIndex - 1
        if (newIndex < 0) {
          // Llegamos al inicio, saltar al final sin animaciÃ³n
          const maxScroll = (realProductsCount - 1) * scrollAmount
          sliderRef.current.scrollTo({ left: maxScroll, behavior: 'auto' })
          setCurrentIndex(realProductsCount - 1)
        } else {
          sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
          setCurrentIndex(newIndex)
        }
      }
    }
  }

  return (
    <section className={`py-14 sm:py-20 lg:py-24 ${bgColor}`}>
      <div className="container mx-auto px-6 lg:px-8 xl:px-12 min-[1600px]:px-16 max-w-screen-2xl min-[1600px]:max-w-[1920px]">
        <div className={`grid gap-8 min-[1600px]:gap-10 ${rightBannerSlot ? 'grid-cols-1 min-[1600px]:grid-cols-[1fr_minmax(320px,380px)]' : 'grid-cols-1'}`}>
          <div className="min-w-0 flex flex-col overflow-hidden">
        {/* Header de la secciÃ³n */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-inxora-dark-blue dark:text-white">
              {title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
              {subtitle}
            </p>
          </div>
          
          {/* Controles del slider - siempre activos para infinito */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="p-2 sm:p-3 rounded-full border-2 border-inxora-blue text-inxora-blue hover:bg-inxora-blue hover:text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 sm:p-3 rounded-full border-2 border-inxora-blue text-inxora-blue hover:bg-inxora-blue hover:text-white transition-all"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Slider de productos - infinito */}
        <div className="relative overflow-hidden min-w-0">
          <div 
            ref={sliderRef}
            className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide pb-4 px-1 sm:px-2 pr-8 min-[1600px]:pr-4 min-w-0"
            style={{ scrollBehavior: 'smooth' }}
          >
            {displayProducts.length > 0 ? (
              displayProducts.map((product, index) => (
                <div 
                  key={`${product.sku}-${index}`} 
                  className={`product-card flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[340px] xl:w-[360px] ${rightBannerSlot ? 'min-[1600px]:w-[320px]' : ''} bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group hover:-translate-y-1`}
                >
                  <Link href={getProductUrl(product, locale)} className="block">
                    {/* Imagen del producto */}
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 p-4">
                      {product.imagen_principal_url ? (
                        <ProductImage
                          src={product.imagen_principal_url}
                          alt={product.nombre}
                          title={product.nombre}
                          fill
                          className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl">ðŸ“¦</span>
                        </div>
                      )}
                      <div className={`absolute top-3 left-3 ${badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md`}>
                        {badgeText}
                      </div>
                    </div>
                    {/* Nombre, categorÃ­a, SKU - tamaÃ±os reducidos para no cortar botones */}
                    <div className="p-4 pb-0">
                      <p className="text-[10px] sm:text-xs text-inxora-blue font-medium uppercase tracking-wide mb-1">
                        {typeof product.categoria === 'string' ? product.categoria : (product.categoria?.nombre || 'Producto')}
                      </p>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-inxora-blue transition-colors">
                        {product.nombre}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-400 mb-2">
                        SKU: {product.sku_producto || product.sku}
                      </p>
                    </div>
                  </Link>
                  {/* Precio y botones - precio mÃ¡s pequeÃ±o, botones siempre visibles */}
                  <div className="p-4 pt-1">
                    <div className="flex items-end justify-between gap-2 min-h-[52px]">
                      <div className="min-w-0 flex-1">
                        <p className="text-lg sm:text-xl font-bold text-inxora-dark-blue dark:text-white truncate" title={getPrecioDisplay(product)}>
                          {getPrecioDisplay(product)}
                        </p>
                        <p className="text-[10px] text-gray-400">Inc. IGV</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            addItem({ ...product, precio_venta: getPrecioNumerico(product) }, 1)
                          }}
                          className="flex items-center gap-1 bg-inxora-blue hover:bg-inxora-blue/90 text-white text-xs sm:text-sm font-semibold py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg sm:rounded-xl transition-colors shadow-md hover:shadow-lg"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Agregar
                        </button>
                        <Link
                          href={getProductUrl(product, locale)}
                          className="flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-colors shrink-0"
                          aria-label="Ver producto"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Placeholders
              Array.from({ length: 5 }).map((_, index) => (
                <div 
                  key={index} 
                  className="product-card flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[320px]"
                >
                  <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200 dark:bg-slate-700" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-gray-300 dark:bg-slate-600 rounded w-1/3" />
                      <div className="h-5 bg-gray-300 dark:bg-slate-600 rounded w-full" />
                      <div className="h-5 bg-gray-300 dark:bg-slate-600 rounded w-2/3" />
                      <div className="h-8 bg-gray-300 dark:bg-slate-600 rounded w-1/2 mt-4" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ver todos los productos */}
        <div className="mt-10 text-center">
          <Link 
            href={`/${locale}/catalogo`}
            className="inline-flex items-center gap-2 bg-inxora-dark-blue hover:bg-inxora-blue text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            Ver todos los productos
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
          </div>

          {/* Banner lateral derecho - columna hermana sin absolute */}
          {rightBannerSlot && (
            <div className="hidden min-[1600px]:flex min-[1600px]:justify-end min-[1600px]:self-center w-full shrink-0">
              <div className="w-[320px] max-w-full sticky top-24">
                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 dark:border-slate-600/50 bg-white dark:bg-slate-800">
                  {rightBannerSlot}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function HomeClient({
  locale,
  featuredProducts = [],
  newProducts = [],
  categories = [],
  bannersHero = [],
  bannersRightDestacados = [],
  bannersRightNuevos = [],
  bannersBelowHero = [],
  bannersBelowCategories = [],
  bannersMiddle = [],
  bannersBetweenSections = [],
  bannersPreFooter = [],
}: HomeClientProps) {
  const hasHeroBanners = bannersHero && bannersHero.length > 0

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section - Banner dinámico o fallback estático (max 1920×823 Desktop / 750×562 Mobile) */}
      <section className="relative min-h-[500px] lg:min-h-[600px] overflow-hidden">
        {hasHeroBanners ? (
          <div className="w-full max-w-[1920px] mx-auto">
            <BannerSlot
              posicionSlug="home-hero"
              banners={bannersHero}
              locale={locale}
            />
          </div>
        ) : (
          <>
            <div className="absolute inset-0 z-0">
              <Image
                src={HERO_FALLBACK_IMAGE}
                alt="Suministros Industriales INXORA - Herramientas y equipos industriales de alta calidad"
                title="Suministros Industriales INXORA - Herramientas y equipos industriales de alta calidad"
                fill
                priority
                className="object-cover"
                sizes="100vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
            </div>
            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 max-w-7xl h-full flex flex-col">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 pt-4 sm:pt-6 lg:pt-8 text-white flex-shrink-0">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-white/50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium">Productos de Calidad</span>
                </div>
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-white/50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h.01M16 17h.01M9 11h6M3 13h2l.4-2M7 13l1.6-8H20l1 5h-1M7 13h13m-5 0v4m-8-4v4m0 0a2 2 0 104 0m4 0a2 2 0 104 0" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium">Envíos a Todo el Perú</span>
                </div>
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-white/50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 18v-6a9 9 0 0118 0v6M3 18a3 3 0 003 3h1a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v2zM21 18a3 3 0 01-3 3h-1a1 1 0 01-1-1v-4a1 1 0 011-1h3a1 1 0 011 1v2z" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium">Asesoría Profesional</span>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-8 lg:py-12 flex-1 min-h-0 justify-center">
                <div className="flex-1 text-white max-w-3xl w-full">
                  <h1 className="text-[1.75rem] leading-tight font-extrabold tracking-tight sm:text-[2.25rem] md:text-[2.5rem] lg:text-[3rem] xl:text-[3.5rem] 2xl:text-5xl">
                    El{' '}
                    <span className="relative inline-block">
                      <span className="relative z-10 px-1.5 py-0.5 sm:px-2 rounded-md bg-gradient-to-r from-[#88D4E4] to-white/90 text-[#171D4C] font-black shadow-lg text-[1em] leading-none align-baseline">
                        PRIMER
                      </span>
                    </span>{' '}
                    Marketplace Industrial del Perú potenciado con{' '}
                    <span className="text-[#88D4E4] font-black drop-shadow-sm">
                      Inteligencia Artificial
                    </span>
                  </h1>
                  <p className="mt-3 sm:mt-4 lg:mt-6 text-base sm:text-lg md:text-xl leading-relaxed sm:leading-8 text-white/90 max-w-lg">
                    Encuentra suministros industriales, cotiza al instante y recibe asesoría 24/7 con el respaldo de IA.
                  </p>
                  <div className="mt-5 sm:mt-6 lg:mt-10 flex flex-wrap items-center gap-2 sm:gap-3">
                    <Link
                      href={`/${locale}/catalogo`}
                      className="inline-flex items-center gap-2 rounded-lg bg-inxora-blue hover:bg-inxora-blue/90 px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3.5 text-sm sm:text-base md:text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      Explorar Catálogo
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
                    </Link>
                    <a
                      href="https://wa.me/51946885531"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3.5 text-sm sm:text-base md:text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      aria-label="Solicitar cotización por WhatsApp"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" viewBox="0 0 32 32" fill="currentColor" aria-hidden>
                        <path d="M16.002 3C8.833 3 3 8.833 3 16.002c0 2.292.6 4.533 1.737 6.504L3 29l6.695-1.756A12.94 12.94 0 0 0 16.002 29C23.169 29 29 23.169 29 16.002 29 8.833 23.169 3 16.002 3zm0 23.545a10.5 10.5 0 0 1-5.354-1.463l-.384-.228-3.977 1.043 1.062-3.882-.25-.398a10.46 10.46 0 0 1-1.606-5.615c0-5.8 4.72-10.52 10.52-10.52 5.799 0 10.52 4.72 10.52 10.52 0 5.8-4.72 10.52-10.52 10.52v.023zm5.77-7.882c-.316-.158-1.872-.924-2.162-1.03-.29-.105-.502-.158-.713.158-.21.316-.818 1.03-.999 1.24-.184.21-.368.237-.684.079-.316-.158-1.334-.492-2.54-1.569-.94-.838-1.573-1.872-1.757-2.188-.184-.316-.02-.486.138-.644.141-.141.316-.368.474-.553.158-.184.21-.316.316-.526.105-.21.052-.395-.026-.553-.079-.158-.713-1.716-.977-2.35-.257-.617-.52-.533-.713-.543-.184-.01-.394-.012-.605-.012-.21 0-.553.079-.842.395-.29.316-1.108 1.082-1.108 2.64 0 1.556 1.134 3.06 1.293 3.27.158.211 2.232 3.41 5.41 4.782.756.326 1.346.52 1.806.667.759.241 1.45.207 1.996.125.61-.09 1.872-.765 2.135-1.504.263-.738.263-1.372.184-1.504-.079-.131-.29-.21-.605-.368z" />
                      </svg>
                      Solicitar Cotización
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* home-below-hero — Strip Post-Hero (1920×240 Desktop, 750×188 Mobile) */}
      {bannersBelowHero && bannersBelowHero.length > 0 && (
        <section className="py-0">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px]">
            <BannerSlot
              posicionSlug="home-below-hero"
              banners={bannersBelowHero}
              locale={locale}
            />
          </div>
        </section>
      )}

      {/* Barra de Categorías Rápidas - Slider Infinito */}
      <section className="bg-gray-100 dark:bg-slate-800 py-4 lg:py-5 border-y border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Slider con animación CSS */}
            <div className="overflow-hidden">
              <div 
                className="flex items-center gap-2 sm:gap-4 animate-scroll-x"
                style={{
                  animationDuration: `${Math.max(categories.length * 4, 20)}s`,
                }}
              >
                {/* Duplicamos las categorías para crear el efecto infinito */}
                {[...categories, ...categories].map((category, index) => (
                  <React.Fragment key={`${category.id}-${index}`}>
                    {/* Categoría con icono y texto */}
                    <Link
                      href={`/${locale}/${category.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[Ã¡Ã Ã¤Ã¢]/g, 'a').replace(/[Ã©Ã¨Ã«Ãª]/g, 'e').replace(/[Ã­Ã¬Ã¯Ã®]/g, 'i').replace(/[Ã³Ã²Ã¶Ã´]/g, 'o').replace(/[ÃºÃ¹Ã¼Ã»]/g, 'u').replace(/Ã±/g, 'n').replace(/[^a-z0-9-]/g, '')}`}
                      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors group flex-shrink-0"
                    >
                      {/* Imagen de la categoría */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex-shrink-0">
                        {category.logo_url ? (
                          <Image
                            src={category.logo_url}
                            alt={category.nombre}
                            title={category.nombre}
                            width={56}
                            height={56}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-slate-600 rounded flex items-center justify-center">
                            <span className="text-lg">ðŸ“¦</span>
                          </div>
                        )}
                      </div>
                      {/* Nombre */}
                      <span className="text-xs sm:text-sm lg:text-base font-semibold text-inxora-dark-blue dark:text-white whitespace-nowrap group-hover:text-inxora-blue transition-colors">
                        {category.nombre}
                      </span>
                    </Link>
                    
                    {/* Separador ">" */}
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* Gradientes en los bordes para efecto de desvanecimiento */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-gray-100 dark:from-slate-800 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-gray-100 dark:from-slate-800 to-transparent z-10 pointer-events-none" />
          </div>
        </div>
        
        {/* CSS para la animación del slider */}
        <style jsx>{`
          @keyframes scroll-x {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll-x {
            animation: scroll-x linear infinite;
          }
          .animate-scroll-x:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* home-below-categories — Entre Categorías y Productos Destacados */}
      {bannersBelowCategories && bannersBelowCategories.length > 0 && (
        <section className="py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px]">
            <BannerSlot
              posicionSlug="home-below-categories"
              banners={bannersBelowCategories}
              locale={locale}
            />
          </div>
        </section>
      )}

      {/* Productos Destacados Section - con slot de banner lateral derecho */}
      <FeaturedProductsSlider 
        products={featuredProducts} 
        locale={locale} 
        title="Productos Destacados"
        subtitle="Los favoritos de nuestros clientes"
        badgeText="Destacado"
        badgeColor="bg-inxora-blue"
        rightBannerSlot={
          bannersRightDestacados.length > 0 ? (
            <BannerSlot
              posicionSlug="home-right-destacados"
              banners={bannersRightDestacados}
              locale={locale}
            />
          ) : undefined
        }
      />

      {/* Productos Nuevos Section - con slot de banner lateral derecho */}
      <FeaturedProductsSlider 
        products={newProducts} 
        locale={locale} 
        title="Nuevos Productos"
        subtitle="Lo más reciente en nuestro catálogo"
        badgeText="Nuevo"
        badgeColor="bg-green-500"
        bgColor="bg-gray-50 dark:bg-slate-800"
        rightBannerSlot={
          bannersRightNuevos.length > 0 ? (
            <BannerSlot
              posicionSlug="home-right-nuevos"
              banners={bannersRightNuevos}
              locale={locale}
            />
          ) : undefined
        }
      />

      {/* home-middle — Entre Destacados y Nuevos (1920×400) */}
      {bannersMiddle && bannersMiddle.length > 0 && (
        <section className="py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px]">
            <BannerSlot
              posicionSlug="home-middle"
              banners={bannersMiddle}
              locale={locale}
            />
          </div>
        </section>
      )}

      {/* home-between-sections — Entre Nuevos y Categorías (1920×300 Desktop, 375×188 Mobile) */}
      {bannersBetweenSections && bannersBetweenSections.length > 0 && (
        <section className="py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px]">
            <BannerSlot
              posicionSlug="home-between-sections"
              banners={bannersBetweenSections}
              locale={locale}
            />
          </div>
        </section>
      )}

      {/* Main Categories Section */}
      <section className="bg-background-light dark:bg-background-dark py-20 sm:py-28 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight text-inxora-dark-blue dark:text-white sm:text-4xl mb-10 sm:mb-14 text-center">
            Categorías Principales
          </h2>
          <CategoriesCarousel categories={categories} locale={locale} />
        </div>
      </section>

      {/* Pre-Footer / CTA Section - Banner dinámico o fallback estático */}
      {bannersPreFooter && bannersPreFooter.length > 0 ? (
        <section className="py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px]">
            <BannerSlot
              posicionSlug="home-pre-footer"
              banners={bannersPreFooter}
              locale={locale}
            />
          </div>
        </section>
      ) : (
        <section className="py-20 sm:py-28 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 max-w-7xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-inxora-dark-blue dark:text-white sm:text-4xl">
              Explora Nuestro Catálogo Completo
            </h2>
            <div className="mt-8">
              <Link
                href={`/${locale}/catalogo`}
                className="inline-block rounded-lg bg-inxora-blue hover:bg-inxora-blue/90 px-8 py-3 text-base font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105"
              >
                Ver Todos los Productos
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}