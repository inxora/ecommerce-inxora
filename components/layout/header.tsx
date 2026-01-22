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
import { CategoriesSidebar } from '@/components/layout/categories-sidebar'
import { CategoriaNavegacion } from '@/lib/services/categories.service'

interface HeaderProps {
  categories?: CategoriaNavegacion[]
}

export function Header({ categories = [] }: HeaderProps) {
  const { items, updateTrigger, isLoaded, getItemsCount } = useCart()
  const { currency, setCurrency, currencySymbol } = useCurrency()
  const { getFavoritesCount } = useFavorites()
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname() || '/es'
  const locale = (pathname.split('/')[1] || 'es') || 'es'

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
          {/* Menú hamburguesa después del logo - Solo visible en desktop */}
          <div className="hidden lg:block">
            <CategoriesSidebar 
              locale={locale}
              categories={categories}
            />
          </div>
          <nav className="hidden md:flex gap-5 lg:gap-6 items-center">
            <a
              href={`/${locale}`}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Inicio
            </a>
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
                  <CategoriesSidebar 
                    locale={locale}
                    categories={categories}
                    trigger={
                      <button className="text-left text-sm font-medium hover:text-primary">
                        Categorías
                      </button>
                    }
                  />
                  <a href={`/${locale}/catalogo`} className="text-sm font-medium hover:text-primary">
                    Catálogo
                  </a>
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