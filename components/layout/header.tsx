'use client'

import { Search, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { useCart } from '@/hooks/use-cart'
import { useState, useEffect } from 'react'

export function Header() {
  const { getItemsCount, updateTrigger } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [itemsCount, setItemsCount] = useState(0)

  // Force re-render when updateTrigger changes
  useEffect(() => {
    const count = getItemsCount()
    console.log('🔄 Header useEffect - updateTrigger:', updateTrigger, 'itemsCount:', count)
    setItemsCount(count)
  }, [updateTrigger, getItemsCount])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/es/catalogo?buscar=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <a href="/es" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl">INXORA</span>
          </a>
          <nav className="hidden md:flex gap-6">
            <a
              href="/es"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Inicio
            </a>
            <a
              href="/es/catalogo"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Catálogo
            </a>
            <a
              href="/es/about"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Nosotros
            </a>
            <a
              href="/es/contact"
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
          <CartDrawer>
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Button>
          </CartDrawer>
        </div>
      </div>
    </header>
  )
}