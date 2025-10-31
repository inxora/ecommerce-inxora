'use client'

import { Search, ShoppingCart, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@/hooks/use-cart'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export function Header() {
  const { items, updateTrigger, isLoaded } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname() || '/es'
  const locale = (pathname.split('/')[1] || 'es') || 'es'

  // Calcular la cantidad de items directamente desde el array
  const itemsCount = items.reduce((total, item) => total + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/catalogo?buscar=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <a href={`/${locale}`} className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl">INXORA</span>
          </a>
          <nav className="hidden md:flex gap-6">
            <a
              href={`/${locale}`}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Inicio
            </a>
            <a
              href={`/${locale}/catalogo`}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Catálogo
            </a>
            <a
              href={`/${locale}/nosotros`}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Nosotros
            </a>
            <a
              href={`/${locale}/contacto`}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Contacto
            </a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <form onSubmit={handleSearch} className="hidden sm:flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="sm" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </form>

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
                  <a href={`/${locale}/catalogo`} className="text-sm font-medium hover:text-primary">
                    Catálogo
                  </a>
                  <a href={`/${locale}/categorias`} className="text-sm font-medium hover:text-primary">
                    Categorías
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