'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Producto, Categoria } from '@/lib/supabase';
import { ProductCard } from '@/components/catalog/product-card';
import { ProductGridLoader, Loader } from '@/components/ui/loader';
import { CategoriesCarousel } from '@/components/home/categories-carousel';

interface HomeClientProps {
  locale: string;
  featuredProducts?: Producto[];
  categories?: Categoria[];
}

export default function HomeClient({ locale, featuredProducts = [], categories = [] }: HomeClientProps) {
  // ✅ FIX 1: Los datos ahora vienen del servidor, no necesitamos fetch en el cliente
  const loading = false; // Ya no hay loading porque los datos vienen del servidor


  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/suministros_industriales_inxora_ecommerce_2025_front_1_web.jpg"
            alt="Suministros Industriales INXORA - Herramientas y equipos industriales de alta calidad"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Suministros Industriales de Calidad
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-200">
            Encuentra todo lo que necesitas para tu negocio en un solo lugar. Explora nuestra amplia gama de productos y aprovecha nuestras ofertas exclusivas.
          </p>
          <div className="mt-10">
            <Link 
              href={`/${locale}/catalogo`}
              className="inline-block rounded-lg bg-inxora-blue hover:bg-inxora-blue/90 px-8 py-3 text-base font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105"
            >
              Explorar Catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-inxora-dark-blue dark:text-white sm:text-4xl mb-12 text-center">
            Productos Destacados
          </h2>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No hay productos destacados disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="bg-background-light dark:bg-background-dark py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-inxora-dark-blue dark:text-white sm:text-4xl mb-8 sm:mb-12 text-center">
            Categorías Principales
          </h2>
          <CategoriesCarousel categories={categories} locale={locale} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
    </div>
  );
}

