import Link from 'next/link'
import { Metadata } from 'next'
import { getMarcas } from '@/lib/supabase'
import { ChevronRight, Package } from 'lucide-react'
import { MarcasGrid } from './marcas-grid'

export const dynamic = 'force-dynamic'
export const revalidate = 60

interface MarcasPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: MarcasPageProps): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = 'https://tienda.inxora.com'
  return {
    title: 'Todas las marcas | Suministros Industriales | TIENDA INXORA',
    description: 'Explora todas las marcas de suministros industriales disponibles en TIENDA INXORA. Herramientas, equipos de seguridad, electricidad y más. Perú.',
    keywords: 'marcas industriales, 3M, Stanley, Makita, Milwaukee, herramientas industriales, Perú',
    openGraph: {
      title: 'Todas las marcas | TIENDA INXORA',
      description: 'Explora todas las marcas de suministros industriales en TIENDA INXORA.',
      url: `${baseUrl}/${locale}/marcas`,
    },
    alternates: { canonical: `${baseUrl}/${locale}/marcas` },
  }
}

export default async function MarcasPage({ params }: MarcasPageProps) {
  const { locale } = await params
  const { data: marcas, error } = await getMarcas()

  if (error || !marcas?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 max-w-[1920px] mx-auto">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-gray-500 dark:text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Marcas</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No hay marcas disponibles en este momento.
            </p>
            <Link
              href={`/${locale}/catalogo`}
              className="inline-flex items-center gap-2 text-inxora-blue hover:text-inxora-blue/80 font-medium"
            >
              Ver catálogo
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const marcasOrdenadas = [...marcas].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es')
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 max-w-[1920px] mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <Link href={`/${locale}`} className="hover:text-inxora-blue dark:hover:text-[#88D4E4] transition-colors">
                Inicio
              </Link>
            </li>
            <li><ChevronRight className="h-4 w-4" /></li>
            <li>
              <Link href={`/${locale}/catalogo`} className="hover:text-inxora-blue dark:hover:text-[#88D4E4] transition-colors">
                Catálogo
              </Link>
            </li>
            <li><ChevronRight className="h-4 w-4" /></li>
            <li className="font-medium text-gray-900 dark:text-white">Marcas</li>
          </ol>
        </nav>

        {/* Header como en catálogo */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent dark:from-[#88D4E4] dark:to-[#139ED4]">
                Todas las marcas
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Explora productos por marca. {marcasOrdenadas.length} marcas disponibles en TIENDA INXORA.
              </p>
            </div>
          </div>
        </div>

        <MarcasGrid marcas={marcasOrdenadas} locale={locale} />

        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`/${locale}/catalogo`}
            className="inline-flex items-center gap-2 text-inxora-blue hover:text-inxora-blue/80 font-semibold"
          >
            Ver catálogo completo de productos
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
