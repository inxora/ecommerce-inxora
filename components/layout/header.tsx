'use client'

import { Search, ShoppingCart, Menu, Heart, Truck, User, MessageCircle, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItemIndicatorRight, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCart } from '@/lib/hooks/use-cart'
import { useCurrency } from '@/lib/hooks/use-currency'
import { useFavorites } from '@/lib/hooks/use-favorites'
import { CURRENCIES, getCurrencyByCode } from '@/lib/constants/currencies'
import { CurrencyFlag } from '@/components/ui/currency-flag'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CategoriesSidebar } from '@/components/layout/categories-sidebar'
import { CategoriaNavegacion } from '@/lib/services/categories.service'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import { cn } from '@/lib/utils'
import { BannerSlot } from '@/components/banner/banner-slot'
import type { Banner } from '@/lib/types'

interface HeaderProps {
  categories?: CategoriaNavegacion[]
  bannersHeaderStrip?: Banner[]
  locale?: string
}

export function Header({ categories = [], bannersHeaderStrip = [], locale: localeProp }: HeaderProps) {
  const { isLoggedIn, cliente, logout } = useClienteAuth()
  const { getItemsCount, clearCart } = useCart()
  const router = useRouter()
  const { currency, setCurrency } = useCurrency()
  const currentCurrency = getCurrencyByCode(currency)
  const { getFavoritesCount } = useFavorites()
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname() || '/es'
  const locale = localeProp ?? (pathname.split('/')[1] || 'es') ?? 'es'

  const itemsCount = getItemsCount()
  const favoritesCount = getFavoritesCount()

  const handleLogout = () => {
    logout()
    clearCart()
    router.push(`/${locale}/login`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // /buscar redirige a /marca/[slug] si coincide con una marca, o a /catalogo?buscar=... si no
      window.location.href = `/${locale}/buscar?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-inxora-blue shadow-lg">
      {/* layout-header-strip — Strip promo encima del header */}
      {bannersHeaderStrip && bannersHeaderStrip.length > 0 && (
        <div className="w-full">
          <BannerSlot
            posicionSlug="layout-header-strip"
            banners={bannersHeaderStrip}
            locale={locale}
          />
        </div>
      )}
      <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6 flex h-16 sm:h-[72px] md:h-20 items-center justify-between gap-2 sm:gap-4 lg:gap-5">
        {/* Logo / Marca - más grande */}
        <Link
          href={`/${locale}`}
          className="flex-shrink-0 flex items-center"
          aria-label="Ir a inicio"
        >
          <Image
            src="/LOGO-30.png"
            alt="INXORA"
            title="INXORA"
            width={200}
            height={68}
            className="h-11 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
            priority
            unoptimized
          />
        </Link>

        {/* Botón Categorías - más grande (desktop); en tablet/md se usa el menú hamburguesa) */}
        <div className="hidden xl:flex flex-shrink-0">
          <CategoriesSidebar
            locale={locale}
            categories={categories}
            trigger={
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 text-white px-4 py-3 font-semibold text-sm uppercase tracking-wide transition-colors"
                aria-label="Ver categorías"
              >
                <Menu className="h-5 w-5" />
                <span>Categorías</span>
              </button>
            }
          />
        </div>

        {/* Buscador - ancho completo del espacio central, sin lupa a la izquierda, botón buscar destacado */}
        <div className="flex-1 flex items-stretch min-w-0 px-1 sm:px-2">
          <form
            action={`/${locale}/buscar`}
            method="get"
            onSubmit={handleSearch}
            className="w-full flex-1 flex items-stretch rounded-xl overflow-hidden bg-white shadow-sm min-w-0"
          >
            <Input
              type="search"
              name="q"
              placeholder="¿Qué estás buscando?"
              className={cn(
                "flex-1 min-w-0 h-12 md:h-14 pl-4 pr-4 rounded-l-xl rounded-r-none border-0",
                "bg-transparent text-gray-900 placeholder:text-gray-500 text-base",
                "focus-visible:ring-0 focus-visible:ring-offset-0"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar productos"
            />
            <Button
              type="submit"
              className="h-12 md:h-14 px-5 md:px-6 bg-amber-400 hover:bg-amber-500 text-inxora-blue rounded-r-xl rounded-l-none shrink-0 font-semibold"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Acciones derecha: el menú hamburguesa va primero para no ser recortado por overflow en resoluciones medias */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 overflow-hidden">
          {/* Menú hamburguesa: visible hasta xl (1280px); primero en el flex para no recortarse */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden h-10 w-10 sm:h-11 sm:w-11 text-white hover:bg-white/20 flex-shrink-0"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-sm bg-white dark:bg-slate-900 text-foreground">
              <SheetHeader>
                <SheetTitle>Menú</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Moneda</label>
                  <Select value={currency} onValueChange={(v) => setCurrency(v as typeof currency)}>
                    <SelectTrigger className="w-full bg-muted/50">
                      <SelectValue>
                        <span className="flex items-center gap-2.5">
                          <CurrencyFlag countryCode={currentCurrency.countryCode} size="sm" />
                          <span className="truncate text-left">
                            {currentCurrency.name} ({currentCurrency.symbol}) - {currentCurrency.code}
                          </span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[70vh] min-w-[280px] p-1.5">
                      {CURRENCIES.map((c) => (
                        <SelectItemIndicatorRight key={c.code} value={c.code} className="flex items-center gap-3 py-2.5 rounded-md">
                          <CurrencyFlag countryCode={c.countryCode} size="md" />
                          <span className="min-w-0 flex-1 text-left text-sm">
                            {c.name} ({c.symbol}) - {c.code}
                          </span>
                        </SelectItemIndicatorRight>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <form action={`/${locale}/buscar`} method="get" onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    type="search"
                    name="q"
                    placeholder="¿Qué estás buscando?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="default">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
                <nav className="flex flex-col gap-1">
                  <CategoriesSidebar
                    locale={locale}
                    categories={categories}
                    trigger={
                      <button type="button" className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-lg hover:bg-muted font-medium">
                        <Menu className="h-4 w-4" />
                        Categorías
                      </button>
                    }
                  />
                  <Link href={`/${locale}`} className="py-2 px-3 rounded-lg hover:bg-muted font-medium">
                    Inicio
                  </Link>
                  {isLoggedIn && (
                    <>
                      <Link href={`/${locale}/cuenta/chat-sara`} className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted font-medium">
                        <MessageCircle className="h-4 w-4" />
                        Chat con Sara
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-lg hover:bg-muted font-medium text-red-600 dark:text-red-400"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </>
                  )}
                  <Link href={`/${locale}/catalogo`} className="py-2 px-3 rounded-lg hover:bg-muted font-medium">
                    Catálogo
                  </Link>
                  <Link href={`/${locale}/nosotros`} className="py-2 px-3 rounded-lg hover:bg-muted font-medium">
                    Nosotros
                  </Link>
                  <Link href={`/${locale}/contacto`} className="py-2 px-3 rounded-lg hover:bg-muted font-medium">
                    Contacto
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Envíos - más grande en desktop */}
          <div className="hidden xl:flex items-center gap-2 text-white/95 text-sm whitespace-nowrap">
            <Truck className="h-5 w-5 flex-shrink-0" />
            <span>Envíos a todo el Perú</span>
          </div>

          {/* Selector moneda — oculto en viewports &lt; 640px para que el menú hamburguesa siempre sea visible */}
          <Select value={currency} onValueChange={(v) => setCurrency(v as typeof currency)}>
            <SelectTrigger className="hidden sm:flex w-[200px] sm:w-[220px] h-10 sm:h-11 bg-white/10 border-white/20 text-white hover:bg-white/20 [&>span]:text-white text-sm gap-2.5">
              <SelectValue>
                <span className="flex items-center gap-2.5 text-white">
                  <CurrencyFlag countryCode={currentCurrency.countryCode} size="sm" className="shrink-0" />
                  <span className="truncate text-left">
                    {currentCurrency.name} ({currentCurrency.symbol}) - {currentCurrency.code}
                  </span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[min(70vh,400px)] min-w-[280px] p-1.5" align="end">
              {CURRENCIES.map((c) => (
                <SelectItemIndicatorRight
                  key={c.code}
                  value={c.code}
                  className="flex items-center gap-3 py-2.5 cursor-pointer rounded-md focus:bg-inxora-blue/10 data-[highlighted]:bg-inxora-blue/10"
                >
                  <CurrencyFlag countryCode={c.countryCode} size="md" className="shrink-0" />
                  <span className="min-w-0 flex-1 text-left text-sm">
                    {c.name} ({c.symbol}) - {c.code}
                  </span>
                </SelectItemIndicatorRight>
              ))}
            </SelectContent>
          </Select>

          {/* Favoritos - más grande */}
          <Link href={`/${locale}/favoritos`}>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 sm:h-11 sm:w-11 text-white hover:bg-white/20 hover:text-white"
              aria-label="Favoritos"
            >
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Carrito - más grande */}
          <CartDrawer>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 sm:h-11 sm:w-11 text-white hover:bg-white/20 hover:text-white"
              aria-label="Ver carrito"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {itemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {itemsCount > 99 ? '99+' : itemsCount}
                </span>
              )}
            </Button>
          </CartDrawer>

          {/* Chat con Sara (solo logueados) */}
          {isLoggedIn && (
            <Link
              href={`/${locale}/cuenta/chat-sara`}
              className="hidden sm:flex items-center gap-2 text-white hover:bg-white/20 py-2 px-3 rounded-lg text-sm font-medium"
              title="Chat con Sara"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Chat con Sara</span>
            </Link>
          )}
          {/* Usuario / Logout - más grande */}
          {isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm text-white/90">Hola, {cliente?.nombre ?? 'Usuario'}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-white/80 hover:text-red-200 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="hidden sm:flex flex-col items-start text-white hover:underline underline-offset-2 py-2 px-3 rounded hover:bg-white/10"
            >
              <span className="text-xs leading-tight">Hola</span>
              <span className="text-sm font-semibold leading-tight">Iniciar sesión</span>
            </Link>
          )}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="sm:hidden flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 text-white hover:bg-white/20 rounded-lg"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="sm:hidden flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 text-white hover:bg-white/20 rounded-lg"
              aria-label="Iniciar sesión"
            >
              <User className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
