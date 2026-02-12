'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { buildBrandLogoUrl } from '@/lib/utils/image-urls'
import { normalizeName } from '@/lib/product-url'
import { ChevronRight } from 'lucide-react'

interface Marca {
  id: number
  nombre: string
  logo_url: string
}

interface MarcasGridProps {
  marcas: Marca[]
  locale: string
}

function BrandLogo({ brand }: { brand: Marca }) {
  const [imageError, setImageError] = useState(false)
  const logoUrl = brand.logo_url ? buildBrandLogoUrl(brand.logo_url) : null
  const brandName = brand.nombre.trim()

  if (logoUrl && !imageError) {
    return (
      <Image
        src={logoUrl}
        alt={brandName}
        title={brandName}
        width={48}
        height={48}
        className="object-contain w-full h-full"
        loading="lazy"
        unoptimized={true}
        onError={() => setImageError(true)}
      />
    )
  }

  return (
    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
      {brandName.substring(0, 2).toUpperCase()}
    </span>
  )
}

function BrandCard({ brand, locale }: { brand: Marca; locale: string }) {
  const brandSlug = normalizeName(brand.nombre) || String(brand.id)
  const brandName = brand.nombre.trim()

  return (
    <Link
      href={`/${locale}/marca/${brandSlug}`}
      className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-[#88D4E4]/10 hover:border-[#139ED4]/30 dark:hover:bg-slate-700/50 transition-all duration-200 group"
    >
      <div className="w-14 h-14 flex-shrink-0 rounded-lg bg-white dark:bg-slate-600 p-2 border border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden">
        <BrandLogo brand={brand} />
      </div>
      <span className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-inxora-blue dark:group-hover:text-[#88D4E4] transition-colors">
        {brandName}
      </span>
      <ChevronRight className="h-5 w-5 text-gray-400 ml-auto flex-shrink-0 group-hover:text-inxora-blue dark:group-hover:text-[#88D4E4] transition-colors" />
    </Link>
  )
}

export function MarcasGrid({ marcas, locale }: MarcasGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
      {marcas.map((brand) => (
        <BrandCard key={brand.id} brand={brand} locale={locale} />
      ))}
    </div>
  )
}
