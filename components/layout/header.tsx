'use client'

import { Search, ShoppingCart, Menu, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCart } from '@/lib/hooks/use-cart'
import { useCurrency } from '@/lib/hooks/use-currency'
import { useFavorites } from '@/lib/hooks/use-favorites'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCategorias, Categoria } from '@/lib/supabase'
import { ChevronDown } from 'lucide-react'
import { buildCategoryUrlFromObject } from '@/lib/product-url'

export function Header() {
  const { items, updateTrigger, isLoaded, getItemsCount } = useCart()
  const { currency, setCurrency, currencySymbol } = useCurrency()
  const { getFavoritesCount } = useFavorites()
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<Categoria[]>([])
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const pathname = usePathname() || '/es'
  const locale = (pathname.split('/')[1] || 'es') || 'es'

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await getCategorias()
        if (data) {
          setCategories(data)
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }
    loadCategories()
  }, [])

  // Calcular la cantidad de items usando la función del hook para asegurar actualización
  const itemsCount = getItemsCount()
  const favoritesCount = getFavoritesCount()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/catalogo?buscar=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-2 sm:px-3 md:px-4">
        <div className="flex items-center gap-4 md:gap-8 lg:gap-10 flex-shrink-0">
          <a href="https://www.inxora.com/" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <Image 
              src="/LOGO-35.png" 
              alt="INXORA" 
              width={180} 
              height={60} 
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] object-contain transition-all duration-300"
              priority
            />
          </a>
          <nav className="hidden md:flex gap-5 lg:gap-6">
            <a
              href={`/${locale}`}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Inicio
            </a>
            <div className="relative">
              <button
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  setCategoriesOpen(!categoriesOpen)
                }}
              >
                Categorías
                <ChevronDown className={`h-4 w-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoriesOpen && categories.length > 0 && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCategoriesOpen(false)}
                  />
                  <div
                    className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={buildCategoryUrlFromObject(category, locale)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#88D4E4]/20 hover:text-[#139ED4] dark:hover:bg-[#88D4E4]/10 dark:hover:text-[#88D4E4] transition-colors"
                        onClick={() => setCategoriesOpen(false)}
                      >
                        {category.nombre}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
            <a
              href={`/${locale}/nosotros`}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Nosotros
            </a>
            <a
              href={`/${locale}/contacto`}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contacto
            </a>
          </nav>
        </div>
        <div className="flex items-center justify-end gap-3 sm:gap-4 flex-shrink-0">
          <form onSubmit={handleSearch} className="hidden sm:flex items-center">
            <div className="relative w-64">
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="sm" 
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Currency Selector */}
          <Select value={currency} onValueChange={(value) => setCurrency(value as 'PEN' | 'USD')}>
            <SelectTrigger className="hidden sm:flex w-[110px] h-9">
              <SelectValue placeholder="Moneda">
                {currencySymbol} {currency}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PEN">S/ Soles (PEN)</SelectItem>
              <SelectItem value="USD">$ Dólares (USD)</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile menu button (hamburger) visible on small screens */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden" aria-label="Abrir menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Menú</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-6">
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <Input
                    type="search"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" size="sm" variant="default">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>

                <nav className="grid gap-2">
                  <a href={`/${locale}`} className="text-sm font-medium hover:text-primary">
                    Inicio
                  </a>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Categorías</div>
                    {categories.map((category) => (
                      <a
                        key={category.id}
                        href={buildCategoryUrlFromObject(category, locale)}
                        className="block pl-4 text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
                      >
                        {category.nombre}
                      </a>
                    ))}
                  </div>
                  <a href={`/${locale}/nosotros`} className="text-sm font-medium hover:text-primary">
                    Nosotros
                  </a>
                  <a href={`/${locale}/contacto`} className="text-sm font-medium hover:text-primary">
                    Contacto
                  </a>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Favoritos */}
          <Link href={`/${locale}/favoritos`}>
            <Button variant="ghost" size="sm" className="relative">
              <Heart className="h-5 w-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg border-2 border-background">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </Button>
          </Link>

          <CartDrawer>
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg border-2 border-background">
                  {itemsCount > 99 ? '99+' : itemsCount}
                </span>
              )}
            </Button>
          </CartDrawer>
        </div>
      </div>
    </header>
  )
}