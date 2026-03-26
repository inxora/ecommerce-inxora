'use client'

import { Search, ShoppingCart, Menu, Heart, User, MessageCircle, LogOut, ChevronDown, Settings, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItemIndicatorRight, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCart } from '@/lib/hooks/use-cart'
import { useCurrency } from '@/lib/hooks/use-currency'
import { useFavorites } from '@/lib/hooks/use-favorites'
import { getCountryCode } from '@/lib/constants/currencies'
import { CurrencyFlag } from '@/components/ui/currency-flag'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CategoriesSidebar } from '@/components/layout/categories-sidebar'
import { CategoriaNavegacion } from '@/lib/services/categories.service'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import { useAuthModal } from '@/lib/contexts/auth-modal-context'
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
  const { openAuthModal } = useAuthModal()
  const { getItemsCount, clearCart } = useCart()
  const router = useRouter()
  const { currency, setCurrency, availableCurrencies } = useCurrency()
  const currentCurrency = availableCurrencies.find((m) => m.codigo === currency)
  const { getFavoritesCount } = useFavorites()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname() || '/es'
  const locale = localeProp ?? (pathname.split('/')[1] || 'es') ?? 'es'

  const itemsCount = getItemsCount()
  const favoritesCount = getFavoritesCount()

  const handleLogout = () => {
    logout()
    clearCart()
    router.push(`/${locale}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setMobileSearchOpen(false)
      window.location.href = `/${locale}/buscar?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const cleanName = (value?: string | null): string =>
    value && value.trim().toUpperCase() !== 'N/A' ? value.trim() : ''

  const rawTipoCliente = cliente?.tipo_cliente ?? cliente?.id_tipo_cliente ?? null
  const tipoCliente = typeof rawTipoCliente === 'string' ? Number(rawTipoCliente) : rawTipoCliente
  const esEmpresa =
    tipoCliente === 2 ||
    !!cliente?.razon_social?.trim() ||
    !!cliente?.documento_empresa?.trim() ||
    (cliente?.apellidos?.trim().toUpperCase() === 'N/A')
  const nombreCompleto = [cleanName(cliente?.nombre), cleanName(cliente?.apellidos)].filter(Boolean).join(' ').trim()
  const nombreMenu = isLoggedIn
    ? (esEmpresa
        ? cleanName(cliente?.display_name) || cleanName(cliente?.razon_social) || cleanName(cliente?.contacto_principal_nombre) || nombreCompleto || 'Empresa'
        : cleanName(cliente?.display_name) || nombreCompleto || cleanName(cliente?.nombre) || 'Usuario')
    : 'Visitante'

  // ── Profile dropdown — reutilizado en desktop y móvil ─────────────────────
  const ProfileMenuItems = () => (
    <>
      <DropdownMenuLabel className="px-3 py-2.5 select-none">
        {isLoggedIn ? (
          <div className="space-y-0.5">
            <p className="text-[11px] text-slate-400 font-normal">Bienvenido</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
              {nombreMenu}
            </p>
            {cliente?.correo && (
              <p className="text-[11px] text-slate-400 font-normal truncate">{cliente.correo}</p>
            )}
          </div>
        ) : (
          <div className="space-y-0.5">
            <p className="text-[11px] text-slate-400 font-normal">No has iniciado sesión</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Visitante</p>
          </div>
        )}
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      {isLoggedIn ? (
        <>
          <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/cuenta`}
              className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer"
            >
              <Settings className="h-4 w-4 text-slate-400 flex-shrink-0" />
              Cuenta
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/favoritos`}
              className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer"
            >
              <Heart className="h-4 w-4 text-slate-400 flex-shrink-0" />
              Favoritos
              {favoritesCount > 0 && (
                <span className="ml-auto min-w-[20px] h-5 px-1 rounded-full bg-amber-400 text-[#171D4C] text-[10px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/cuenta/pedidos`}
              className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer"
            >
              <Package className="h-4 w-4 text-slate-400 flex-shrink-0" />
              Mis pedidos
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Cerrar sesión
          </DropdownMenuItem>
        </>
      ) : (
        <>
          <DropdownMenuItem
            onSelect={() => openAuthModal()}
            className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer"
          >
            <User className="h-4 w-4 text-slate-400 flex-shrink-0" />
            Iniciar sesión
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => openAuthModal({ initialMode: 'register' })}
            className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold cursor-pointer text-[#171D4C] dark:text-amber-300 focus:bg-amber-50 dark:focus:bg-amber-950/20"
          >
            Crear cuenta
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/favoritos`}
              className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer"
            >
              <Heart className="h-4 w-4 text-slate-400 flex-shrink-0" />
              Favoritos
            </Link>
          </DropdownMenuItem>
        </>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-40 w-full">

      {/* ── Promo strip ─────────────────────────────────────────────────────── */}
      {bannersHeaderStrip && bannersHeaderStrip.length > 0 && (
        <div className="w-full">
          <BannerSlot
            posicionSlug="layout-header-strip"
            banners={bannersHeaderStrip}
            locale={locale}
          />
        </div>
      )}

      {/* ── Main bar ────────────────────────────────────────────────────────── */}
      <div className="bg-[#171D4C] border-b border-white/10 shadow-lg">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 flex h-[68px] items-center gap-2 sm:gap-3 lg:gap-4">

            {/* Hamburguesa — PRIMERO, visible hasta xl */}
            <SheetTrigger asChild>
              <button
                type="button"
                className="xl:hidden flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-lg text-white bg-white/10 border-0 hover:bg-white/20 transition-colors"
                aria-label="Abrir menú"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>

            {/* Logo */}
            <Link href={`/${locale}`} className="flex-shrink-0" aria-label="Ir a inicio">
              <Image
                src="/LOGO-30.png"
                alt="INXORA"
                title="INXORA"
                width={160}
                height={54}
                className="h-9 sm:h-10 xl:h-11 w-auto object-contain"
                priority
                unoptimized
              />
            </Link>

            {/* Categorías — solo xl+ */}
            <div className="hidden xl:flex flex-shrink-0">
              <CategoriesSidebar
                locale={locale}
                categories={categories}
                trigger={
                  <button
                    type="button"
                    className="flex items-center gap-2 h-9 px-3.5 rounded-lg bg-white/10 hover:bg-white/20 border-0 text-white text-sm font-medium transition-colors"
                    aria-label="Ver categorías"
                  >
                    <Menu className="h-4 w-4 flex-shrink-0" />
                    <span>Categorías</span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-60 flex-shrink-0" />
                  </button>
                }
              />
            </div>

            {/* Search bar — oculto en mobile (< sm), visible en sm+ */}
            <form
              action={`/${locale}/buscar`}
              method="get"
              onSubmit={handleSearch}
              className="hidden sm:flex flex-1 min-w-0"
            >
              <div className="flex w-full rounded-lg overflow-hidden ring-1 ring-white/20 hover:ring-white/40 focus-within:ring-2 focus-within:ring-[#1A56DB] transition-all">
                <Input
                  type="search"
                  name="q"
                  placeholder="¿Qué estás buscando?"
                  className={cn(
                    'flex-1 min-w-0 h-10 pl-4 pr-3 rounded-l-lg rounded-r-none border-0',
                    'bg-white/10 text-white placeholder:text-white/50 text-sm',
                    'focus-visible:ring-0 focus-visible:ring-offset-0'
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Buscar productos"
                />
                <button
                  type="submit"
                  className="h-10 px-4 bg-amber-400 hover:bg-amber-300 text-[#171D4C] rounded-r-lg flex-shrink-0 font-semibold transition-colors"
                  aria-label="Buscar"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* ── Right actions (pegados a la derecha) ──────────────────────────── */}
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">

              {/* Lupa — solo mobile (< sm) */}
              <button
                type="button"
                className="sm:hidden flex items-center justify-center h-9 w-9 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Buscar"
                onClick={() => setMobileSearchOpen((v) => !v)}
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Chat con Sara */}
              <Link
                href={`/${locale}/cuenta/chat-sara`}
                className={cn(
                  'flex items-center gap-1.5 h-9 px-2.5 rounded-lg',
                  'bg-white/10 hover:bg-white/20 border-0',
                  'text-white text-xs font-medium transition-colors whitespace-nowrap'
                )}
                title="Chat con Sara"
              >
                <MessageCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="hidden lg:inline">Sara</span>
              </Link>

              {/* Moneda compacta — solo sm+ */}
              <Select value={currency} onValueChange={(v) => setCurrency(v as typeof currency)}>
                <SelectTrigger className={cn(
                  'hidden sm:flex items-center gap-1.5 h-9 px-2.5 w-auto rounded-lg',
                  'bg-white/10 hover:bg-white/20 border-0',
                  'text-white transition-colors [&>svg]:hidden'
                )}>
                  <SelectValue>
                    <span className="flex items-center gap-1.5">
                      <CurrencyFlag countryCode={getCountryCode(currency)} size="sm" className="shrink-0" />
                      <span className="text-xs font-medium">{currentCurrency?.simbolo ?? currency}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[min(70vh,380px)] min-w-[200px] p-1.5" align="end">
                  {availableCurrencies.map((m) => (
                    <SelectItemIndicatorRight
                      key={m.codigo}
                      value={m.codigo}
                      className="flex items-center gap-3 py-2 px-2.5 cursor-pointer rounded-md text-sm"
                    >
                      <CurrencyFlag countryCode={getCountryCode(m.codigo)} size="sm" className="shrink-0" />
                      <span className="flex-1 text-left">
                        {m.simbolo} <span className="text-muted-foreground text-xs ml-1">{m.codigo}</span>
                      </span>
                    </SelectItemIndicatorRight>
                  ))}
                </SelectContent>
              </Select>

              {/* Carrito */}
              <CartDrawer>
                <button
                  type="button"
                  className="relative flex items-center justify-center h-9 w-9 rounded-lg text-white bg-white/10 border-0 hover:bg-white/20 transition-colors"
                  aria-label="Ver carrito"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {itemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-amber-400 text-[#171D4C] text-[9px] font-bold flex items-center justify-center leading-none">
                      {itemsCount > 99 ? '99+' : itemsCount}
                    </span>
                  )}
                </button>
              </CartDrawer>

              {/* Perfil dropdown — desktop (sm+) */}
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        'flex items-center gap-1.5 h-9 px-2.5 rounded-lg outline-none',
                        'bg-white/10 hover:bg-white/20 border-0',
                        'text-white text-xs font-medium transition-colors'
                      )}
                      aria-label="Perfil"
                    >
                      <User className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="hidden lg:inline">Perfil</span>
                      <ChevronDown className="h-3 w-3 opacity-60 flex-shrink-0" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-56 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl"
                  >
                    <ProfileMenuItems />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Perfil dropdown — mobile */}
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center justify-center h-9 w-9 rounded-lg text-white bg-white/10 border-0 hover:bg-white/20 transition-colors outline-none"
                      aria-label="Perfil"
                    >
                      <User className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-52 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl"
                  >
                    <ProfileMenuItems />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            </div>
          </div>

          {/* Sheet content del menú hamburguesa */}
          <SheetContent side="left" className="w-full sm:max-w-sm bg-white dark:bg-slate-900 text-foreground p-0 flex flex-col min-h-0 h-full">
            <SheetHeader className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <SheetTitle className="text-left text-base font-semibold">Menú</SheetTitle>
            </SheetHeader>
            <div className="px-5 py-4 space-y-5 overflow-y-auto flex-1 min-h-0 overscroll-contain">

              {/* Moneda */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Moneda</p>
                <Select value={currency} onValueChange={(v) => setCurrency(v as typeof currency)}>
                  <SelectTrigger className="w-full h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm">
                    <SelectValue>
                      <span className="flex items-center gap-2.5">
                        <CurrencyFlag countryCode={getCountryCode(currency)} size="sm" />
                        <span className="truncate text-left text-sm">
                          {currentCurrency?.simbolo ?? currency} — {currentCurrency?.nombre ?? currency} ({currency})
                        </span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[60vh] min-w-[260px] p-1.5">
                    {availableCurrencies.map((m) => (
                      <SelectItemIndicatorRight key={m.codigo} value={m.codigo} className="flex items-center gap-3 py-2.5 rounded-md">
                        <CurrencyFlag countryCode={getCountryCode(m.codigo)} size="md" />
                        <span className="min-w-0 flex-1 text-left text-sm">
                          {m.nombre} ({m.simbolo}) — {m.codigo}
                        </span>
                      </SelectItemIndicatorRight>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Navegación */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Navegación</p>
                <nav className="flex flex-col gap-0.5">
                  <Link href={`/${locale}`} onClick={() => setMenuOpen(false)} className="flex items-center py-2.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors">
                    Inicio
                  </Link>
                  <CategoriesSidebar
                    locale={locale}
                    categories={categories}
                    trigger={
                      <button type="button" className="flex items-center w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors">
                        Categorías
                      </button>
                    }
                  />
                  <Link href={`/${locale}/nosotros`} onClick={() => setMenuOpen(false)} className="flex items-center py-2.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors">
                    Nosotros
                  </Link>
                  <Link href={`/${locale}/contacto`} onClick={() => setMenuOpen(false)} className="flex items-center py-2.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors">
                    Contacto
                  </Link>
                </nav>
              </div>

              {/* Info usuario si está logueado */}
              {isLoggedIn && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-0.5">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-[#171D4C] flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">Bienvenido</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {nombreMenu}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); handleLogout() }}
                    className="flex items-center gap-2.5 w-full text-left py-2.5 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-medium text-red-600 dark:text-red-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ── Barra de búsqueda expandida (solo mobile, < sm) ── */}
      {mobileSearchOpen && (
        <div className="sm:hidden bg-[#171D4C] border-t border-white/10 px-3 py-2.5">
          <form
            action={`/${locale}/buscar`}
            method="get"
            onSubmit={handleSearch}
            className="flex gap-2"
          >
            <Input
              type="search"
              name="q"
              placeholder="¿Qué estás buscando?"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'flex-1 h-10 rounded-lg border-0',
                'bg-white/15 text-white placeholder:text-white/50 text-sm',
                'focus-visible:ring-1 focus-visible:ring-[#1A56DB] focus-visible:ring-offset-0'
              )}
              aria-label="Buscar productos"
            />
            <button
              type="submit"
              className="h-10 px-4 bg-amber-400 hover:bg-amber-300 text-[#171D4C] rounded-lg flex-shrink-0 font-semibold transition-colors"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="h-10 px-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm"
              aria-label="Cerrar búsqueda"
            >
              ✕
            </button>
          </form>
        </div>
      )}
    </header>
  )
}