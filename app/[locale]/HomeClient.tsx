'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Producto, Categoria } from '@/lib/supabase';
import type { Banner } from '@/lib/types';
import { ProductGridLoader, Loader } from '@/components/ui/loader';
import { BannerSlot } from '@/components/banner/banner-slot';
import { ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import { buildProductFullUrl, buildCategoryUrlFromObject } from '@/lib/product-url';
import { ProductCard } from '@/components/catalog/product-card';
import { useTranslations } from 'next-intl'
import { getIndustrialQuotationWhatsAppUrl } from '@/lib/whatsapp-industrial-cta'
import { useAuthModal } from '@/lib/contexts/auth-modal-context'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'

const HERO_FALLBACK_IMAGE = '/suministros_industriales_inxora_ecommerce_2025_front_1_web.jpg'

/** Primera entrada al home en esta pestaña/sesión: al cerrar el modal se guarda en sessionStorage (nueva pestaña = vuelve a mostrarse una vez). */
const WELCOME_MODAL_STORAGE_KEY = 'inxora_welcome_modal_seen'

function isWelcomeModalHost(hostname: string): boolean {
  if (hostname === 'tienda.inxora' || hostname === 'www.tienda.inxora') return true
  // Desarrollo: misma regla de “primera vez” que en producción
  if (hostname === 'localhost' || hostname === '127.0.0.1') return true
  return false
}

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
  // Si tenemos todos los datos necesarios, construir URL canónica
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
  
  // Último fallback
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
  const t = useTranslations('home')
  const sliderRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
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
    <section className={`py-14 sm:py-20 lg:py-24 ${bgColor} w-full`}>
      <div className={`w-full px-6 lg:px-8 xl:px-12 ${rightBannerSlot ? 'min-[1600px]:flex min-[1600px]:items-stretch min-[1600px]:gap-10 min-[1600px]:pl-6 min-[1600px]:pr-6' : ''}`}>
        {/* Columna productos: flex-1 cuando hay banner; gap y pr evitan que la última card quede cortada */}
        <div className={`${rightBannerSlot ? 'min-[1600px]:flex-1 min-[1600px]:min-w-0 min-[1600px]:pr-1' : ''} grid gap-8 min-[1600px]:gap-10 grid-cols-1`}>
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
            className={`flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide pb-4 px-1 sm:px-2 pr-8 min-w-0 ${rightBannerSlot ? 'min-[1600px]:pr-6' : 'min-[1600px]:pr-4'}`}
            style={{ scrollBehavior: 'smooth' }}
          >
            {displayProducts.length > 0 ? (
              displayProducts.map((product, index) => (
                <div
                  key={`${product.sku}-${index}`}
                  className={`product-card flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[340px] xl:w-[360px] ${rightBannerSlot ? 'min-[1600px]:w-[320px]' : ''}`}
                >
                  <ProductCard
                    product={product}
                    badgeText={badgeText}
                    badgeColor={badgeColor}
                  />
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
            {t('sliders.viewAllProducts')}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
          </div>
        </div>

        {/* Banner lateral derecho: hijo directo del contenedor flex para quedar pegado al borde derecho */}
        {rightBannerSlot && (
          <div className="hidden min-[1600px]:flex min-[1600px]:flex-shrink-0 min-[1600px]:self-center min-[1600px]:w-[600px]">
            <div className="w-full sticky top-24">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 dark:border-slate-600/50 bg-white dark:bg-slate-800 min-w-0">
                {rightBannerSlot}
              </div>
            </div>
          </div>
        )}
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
  const t = useTranslations('home')
  const hasHeroBanners = bannersHero && bannersHero.length > 0
  const [seoOpen, setSeoOpen] = useState<Set<number>>(new Set())
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const { openAuthModal } = useAuthModal()
  const { isLoggedIn } = useClienteAuth()

  const dismissWelcome = useCallback(() => {
    setWelcomeOpen(false)
    try {
      sessionStorage.setItem(WELCOME_MODAL_STORAGE_KEY, '1')
    } catch {
      /* almacenamiento no disponible */
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isWelcomeModalHost(window.location.hostname)) return
    try {
      if (sessionStorage.getItem(WELCOME_MODAL_STORAGE_KEY) === '1') return
    } catch {
      return
    }
    const timer = setTimeout(() => setWelcomeOpen(true), 800)
    return () => clearTimeout(timer)
  }, [])
  const toggleSeo = (i: number) =>
    setSeoOpen((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  const seoAccordionItems = useMemo(
    () => [
      {
        id: 'how',
        title: t('seo.accordion.how.title'),
        content: (
          <>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('seo.accordion.how.p1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('seo.accordion.how.p2')}
            </p>
          </>
        ),
      },
      {
        id: 'sara',
        title: t('seo.accordion.sara.title'),
        content: (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('seo.accordion.sara.body')}
          </p>
        ),
      },
      {
        id: 'coverage',
        title: t('seo.accordion.coverage.title'),
        content: (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('seo.accordion.coverage.body')}
          </p>
        ),
      },
      {
        id: 'financing',
        title: t('seo.accordion.financing.title'),
        content: (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('seo.accordion.financing.body')}
          </p>
        ),
      },
    ],
    [t]
  )

  const benefitsStripItems = useMemo(
    () => [
      { id: 'quote', title: t('benefitsStrip.quote.title'), desc: t('benefitsStrip.quote.desc') },
      { id: 'oc', title: t('benefitsStrip.oc.title'), desc: t('benefitsStrip.oc.desc') },
      { id: 'dispatch', title: t('benefitsStrip.dispatch.title'), desc: t('benefitsStrip.dispatch.desc') },
      { id: 'suppliers', title: t('benefitsStrip.suppliers.title'), desc: t('benefitsStrip.suppliers.desc') },
      { id: 'pricing', title: t('benefitsStrip.pricing.title'), desc: t('benefitsStrip.pricing.desc') },
      { id: 'support', title: t('benefitsStrip.support.title'), desc: t('benefitsStrip.support.desc') },
    ],
    [t]
  )

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
                alt={t('hero.heroImageAlt')}
                title={t('hero.heroImageAlt')}
                fill
                priority
                className="object-cover"
                sizes="100vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
            </div>
            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 max-w-7xl py-16 sm:py-20 lg:py-28 flex flex-col justify-center">
              <div className="text-white max-w-3xl">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#88D4E4] mb-3 sm:mb-4">
                  {t('hero.kicker')}
                </p>
                <h1 className="text-[1.75rem] leading-tight font-extrabold tracking-tight sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem]">
                  {t('hero.titlePrefix')}{' '}
                  <span className="text-[#88D4E4] font-black drop-shadow-sm">
                    {t('hero.titleHighlight')}
                  </span>{' '}
                  {t('hero.titleSuffix')}{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10 px-1.5 py-0.5 sm:px-2 rounded-md bg-gradient-to-r from-[#88D4E4] to-white/90 text-[#171D4C] font-black shadow-lg leading-none">
                      {t('hero.aiBadge')}
                    </span>
                  </span>
                </h1>
                <p className="mt-4 sm:mt-5 lg:mt-6 text-base sm:text-lg leading-relaxed text-white/85 max-w-xl">
                  {t('hero.description')}
                </p>
                <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/${locale}/catalogo`}
                    className="inline-flex items-center gap-2 rounded-xl bg-white text-[#171D4C] hover:bg-white/90 px-6 py-3 md:px-8 md:py-3.5 text-sm sm:text-base font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    {t('hero.exploreProducts')}
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  </Link>
                  <a
                    href={getIndustrialQuotationWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] px-6 py-3 md:px-8 md:py-3.5 text-sm sm:text-base font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/25"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {t('hero.industrialQuotation')}
                  </a>
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

      {/* BLOQUE 1 — Grid 8 categorías con logo_url (debajo del hero) */}
      <section className="bg-white dark:bg-slate-900 py-8 sm:py-10 lg:py-12">
        <div className="w-full px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-inxora-dark-blue dark:text-white">
              {t('categories.title')}
            </h2>
            <Link
              href={`/${locale}/catalogo`}
              className="inline-flex items-center gap-1 text-inxora-blue dark:text-[#88D4E4] font-semibold hover:underline"
            >
              {t('categories.viewFullCatalog')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 lg:gap-6">
            {(categories.slice(0, 8)).map((category) => (
              <Link
                key={category.id}
                href={buildCategoryUrlFromObject(category, locale)}
                className="group flex flex-col items-center gap-2 sm:gap-3 cursor-pointer"
              >
                <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-inxora-blue transition-all duration-200 shadow-sm group-hover:shadow-md p-2 sm:p-3">
                  {category.logo_url ? (
                    <Image
                      src={category.logo_url}
                      alt={category.nombre}
                      title={category.nombre}
                      width={128}
                      height={128}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-3xl">📦</span>
                  )}
                </div>
                <span className="text-xs font-semibold text-center text-gray-700 dark:text-gray-300 uppercase tracking-wide leading-tight group-hover:text-inxora-blue transition-colors line-clamp-2">
                  {category.nombre}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href={`/${locale}/catalogo`}
              className="inline-flex items-center gap-2 bg-inxora-dark-blue hover:bg-[#1A56DB] dark:bg-inxora-dark-blue dark:hover:bg-[#1A56DB] text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg"
            >
              {t('categories.viewFullCatalog')}
            </Link>
          </div>
        </div>
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
        title={t('sliders.featuredTitle')}
        subtitle={t('sliders.featuredSubtitle')}
        badgeText={t('sliders.featuredBadge')}
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
        title={t('sliders.newTitle')}
        subtitle={t('sliders.newSubtitle')}
        badgeText={t('sliders.newBadge')}
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

      {/* BLOQUE 4 — SEO al pie con stats + 2 columnas de texto */}
      <section className="bg-white dark:bg-slate-900 py-16 sm:py-20 lg:py-24 w-full">
        <div className="w-full px-6 lg:px-8 xl:px-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-inxora-dark-blue dark:text-white mb-6 sm:mb-8">
            {t('seo.mainTitle')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t('seo.introP1')}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-10 sm:mb-12">
            {t('seo.introP2')}
          </p>

          {/* Stats — fondo navy */}
          <div className="bg-[#171D4C] rounded-2xl p-8 sm:p-10 mb-12 sm:mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-[#88D4E4]">+80%</p>
                <p className="text-sm sm:text-base text-white/90 mt-1">{t('seo.stats.repurchase')}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-[#88D4E4]">26+</p>
                <p className="text-sm sm:text-base text-white/90 mt-1">{t('seo.stats.companies')}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-[#88D4E4]">24/7</p>
                <p className="text-sm sm:text-base text-white/90 mt-1">{t('seo.stats.support')}</p>
              </div>
            </div>
          </div>

          {/* Acordeón SEO */}
          <div className="divide-y divide-gray-200 dark:divide-slate-700 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            {seoAccordionItems.map(({ id, title, content }, i) => (
              <div key={id} className="bg-white dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => toggleSeo(i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inxora-blue"
                  aria-expanded={seoOpen.has(i)}
                >
                  <span className="text-base sm:text-lg font-bold text-inxora-dark-blue dark:text-white">{title}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-inxora-blue transition-transform duration-200 ${seoOpen.has(i) ? 'rotate-180' : ''}`} />
                </button>
                {seoOpen.has(i) && (
                  <div className="px-6 pb-6 text-sm sm:text-base">
                    {content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE 2 — Barra 6 beneficios (fondo navy #171D4C) — justo antes del footer */}
      <section className="bg-[#171D4C] py-8 sm:py-10">
        <div className="w-full px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 lg:gap-4">
            {benefitsStripItems.map(({ id, title, desc }) => (
              <div key={id} className="text-center lg:text-left">
                <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
                <p className="text-sm text-white/80 mt-1">{desc}</p>
              </div>
            ))}
          </div>
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
              {t('preFooter.title')}
            </h2>
            <div className="mt-8">
              <Link
                href={`/${locale}/catalogo`}
                className="inline-block rounded-lg bg-inxora-blue hover:bg-inxora-blue/90 px-8 py-3 text-base font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105"
              >
                {t('preFooter.viewAllProducts')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Modal de bienvenida Sara Xora ── */}
      {welcomeOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto overscroll-contain"
          onClick={dismissWelcome}
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-modal-title"
        >
          <div
            className="relative w-full max-w-lg max-h-[min(92dvh,calc(100dvh-1.5rem))] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-x-hidden mb-[env(safe-area-inset-bottom,0px)] sm:mb-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header navy con foto de Sara */}
            <div className="relative bg-[#171D4C] px-6 pt-7 pb-16 sm:pb-24 text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#171D4C] via-[#1A3A6B] to-[#13A0D8]/40" />
              <div className="relative z-10 pr-24 sm:pr-28">
                <p className="text-xs font-bold uppercase tracking-widest text-[#88D4E4] mb-2">{t('welcome.kicker')}</p>
                <h2 id="welcome-modal-title" className="text-lg sm:text-2xl font-extrabold leading-snug">
                  {t('welcome.title')}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed">
                  {t('welcome.introPrefix')} <strong className="text-[#88D4E4]">Sara Xora</strong>, {t('welcome.introSuffix')}
                </p>
              </div>
              {/* Imagen de Sara flotante */}
              <div className="absolute right-0 bottom-0 h-32 w-24 sm:h-40 sm:w-32 overflow-hidden pointer-events-none">
                <Image
                  src="/sara-pose2.png"
                  alt={t('welcome.saraImageAlt')}
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171D4C]/60 via-transparent to-transparent" />
              </div>
              {/* Botón cerrar */}
              <button
                type="button"
                onClick={dismissWelcome}
                className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
                aria-label={t('welcome.close')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Cuerpo: 3 beneficios */}
            <div className="px-6 pt-5 pb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">{t('welcome.whyTitle')}</p>
              <ul className="space-y-3 mb-6">
                {[
                  {
                    icon: '⚡',
                    title: t('welcome.benefits.fastQuotesTitle'),
                    desc: t('welcome.benefits.fastQuotesDesc'),
                  },
                  {
                    icon: '🔒',
                    title: t('welcome.benefits.verifiedSuppliersTitle'),
                    desc: t('welcome.benefits.verifiedSuppliersDesc'),
                  },
                  {
                    icon: '💳',
                    title: t('welcome.benefits.financingTitle'),
                    desc: t('welcome.benefits.financingDesc'),
                  },
                ].map(({ icon, title, desc }) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#13A0D8]/10 text-[#13A0D8] text-base">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className={`flex flex-col gap-3 ${isLoggedIn ? '' : 'sm:flex-row'}`}>
                <a
                  href={getIndustrialQuotationWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismissWelcome}
                  className={`inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm transition-colors shadow-sm ${isLoggedIn ? 'w-full' : 'flex-1'}`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t('welcome.quoteWithSara')}
                </a>
                {!isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => {
                      dismissWelcome()
                      openAuthModal()
                    }}
                    className="flex-1 text-center py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {t('welcome.exploreFirst')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}