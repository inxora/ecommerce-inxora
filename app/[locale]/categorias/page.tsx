'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart } from 'lucide-react'

interface Category {
  id: string
  name: string
  image: string
  slug: string
  description?: string
}

// Mock categories data - replace with actual data fetching
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Equipo de Seguridad',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAK6Cqe7Koke8R4dhAYOTgTCQPkUHk0xTnhzGWr-jEqeDgr70pskHF0wjOq5q7hWt-IKIOeZ8HSP5FgwhReFVhRk6-rBjV8-kCKz1T4pwe3pWIG5FwyAjaH8eP2f0N7z5b6plsaWz4x_PugmH3pBaVeMuQ0QZbgUqvdJrlxccC1rXRIY5SeGtzbiLsd854Od6aWhiPlFqJ6oO9SDvuhaIeFpWbWprMJHRdSATzfYz0jVpB4jUPxP98qvvSWPc--slJ3WFERtG6GWek',
    slug: 'equipo-seguridad',
    description: 'Protección personal y equipos de seguridad industrial'
  },
  {
    id: '2',
    name: 'Herramientas Eléctricas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0Fpl-kNijdsOn7k2nqkumetmKC6iqRXwncUPkf_yYYcPIjsuVd5LSRTFEMZd_RT0T3ry0OoP5yWeeu4kZHRpiQlsAJtXSDucbzSKykDvX8lwaKf2GBXkawu3AUDTU7r4gY5qhFX7vJu6ghMbveHdZEHHyz8uxoOb2hQXV2IGGI3cVF-S0a3LpZuVv9X73wSDYSQQiH6IWj-N35qJ9k6p9v2Y5AQBcmGAJZeVk7chWhAVYQtit3QUBQxWlGeHdeLShwGq6dHtBdDw',
    slug: 'herramientas-electricas',
    description: 'Taladros, sierras, lijadoras y más herramientas eléctricas'
  },
  {
    id: '3',
    name: 'Herramientas Manuales',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqnwZIH1j1wjPPitHdUiCJ_qRtCOO8iCK06cdTOpQgYRC2ccc05JNzSlW3fsUM6kRRTF3zBMgiCcRNOyH4FEpsrl9RefqmvNC7f7mzX5t0nM7N7efgdo6AwTnVsfyEPNjC5FyrRHuifiZW8vEMjINfEsU2iX6Rmt3DvcN7uB2xVK_8PBFvsptJGGT_iLijH8PlBbXRAjbovOwuG9Qu1kzLlZjghSxAD2LG_3MrZLZN7AOOvyRr1U-FOP35hgK6abSRmCpuTAhQmf8',
    slug: 'herramientas-manuales',
    description: 'Martillos, destornilladores, llaves y herramientas básicas'
  },
  {
    id: '4',
    name: 'Suministros Eléctricos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3v5ThMAuLby0C8Zj6oxnjellsNmTNug-6oHqNcQgApqVijUys03ilSeLRcTto8a9pVVIaYgfXmI6VXDB27NZJeWNgIa9a5kM6SNFo8ZA04ilLr9a1qz-2Xb0rAmz7VniHAGFmdwcT3dqalvCG53RgFWiLixxgcDVQ01nCU9eB_fRdYbDD45LLOQ_xSzZ6BBMmo5l1ZwF9bFEQkinxRfF6cOC-UZG-WAy24PI5g2hpuyxCNOTTxO2bv2Gki3NNIihYtPkRoqSW7-U',
    slug: 'suministros-electricos',
    description: 'Cables, conectores, interruptores y componentes eléctricos'
  },
  {
    id: '5',
    name: 'Suministros de Plomería',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAImFJN43lLeUAJthKnNB6PgX_6p3DNTibAy_wV5mY9ApPWJYeAA_hNl1m_S8BT__PMqmP98U3E-oy7VvIpk4P3BwpCm9Tv6vVYsPRgK49mMEJtOkzBZgv-5-yO3n6ru5q1anj9PiSJkUv5vchrSDfN4hHuaJD7gYSxLmCvKCF7jNLSGLO4sEiLkGR1Gf5zGE3IRYLC2yRHZD5BZrlRw2J-iM6bHME76_zSXfVgxSRT2JSFD_TJ4GsNbJiXmT4s1Gdn7dwZzg76JNw',
    slug: 'suministros-plomeria',
    description: 'Tuberías, válvulas, accesorios y herramientas de plomería'
  },
  {
    id: '6',
    name: 'Sujetadores',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5TXJRk9GH4gK-Cwl70DmFPK1TwnFp0hoXlWomQdm5rL_r2F06SsB4wATWsgXzk6yvYoeeftrJYdieJnVVfzFLtG3qRMtUfNDHi4Fxiejze86Cs-rde30SiaE2YE0GrZhsA-CnoEtjeNSK9mNA8UyyeMliSVKuw8hJG2LzDNmFRq4Nf0BDuwsAGL77b6Yl6rjQEO-SzEUWvazbgQhf_Er4iRB0vfQrS0Jyp8-pD6nGaqwu9yPO03zmDZ7FxoNa1twbnQklhN3OvEY',
    slug: 'sujetadores',
    description: 'Tornillos, pernos, tuercas y elementos de fijación'
  }
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Categorías de Productos
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Explora nuestra amplia gama de suministros industriales.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              href={`/catalogo?categoria=${category.slug}`}
              className="group cursor-pointer"
            >
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 transition-transform duration-300 group-hover:scale-105">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* No Results Message */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Search className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No se encontraron categorías
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Intenta con un término de búsqueda diferente.
            </p>
          </div>
        )}

        {/* Featured Categories Section */}
        <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Categorías Destacadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((category) => (
              <div
                key={`featured-${category.id}`}
                className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-48 w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {category.description}
                  </p>
                  <Link
                    href={`/catalogo?categoria=${category.slug}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >
                    Ver Productos
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-primary rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-blue-100 mb-6">
            Contáctanos y te ayudaremos a encontrar los productos que necesitas para tu proyecto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
            >
              Contactar Soporte
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
            >
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}