'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { buildBrandLogoUrl } from '@/lib/supabase'
import { CategoriesService, MarcaNavegacion, SubcategoriaNavegacion, CategoriaNavegacion } from '@/lib/services/categories.service'
import { buildCategoryUrlFromObject, buildCategoryUrl, buildCategorySubcategoriaUrl, buildCategorySubcategoriaMarcaUrl } from '@/lib/product-url'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { createPortal } from 'react-dom'

// Componente para mostrar el logo de la marca con manejo de errores
function BrandLogo({ brand }: { brand: MarcaNavegacion }) {
  const [imageError, setImageError] = useState(false)
  const logoUrl = brand.logo_url ? buildBrandLogoUrl(brand.logo_url) : null
  const brandName = brand.nombre.trim()
  
  if (logoUrl && !imageError) {
    return (
      <div className="w-8 h-8 flex-shrink-0 rounded bg-white dark:bg-slate-600 p-1 border border-gray-200 dark:border-gray-600">
        <Image
          src={logoUrl}
          alt={brandName}
          width={32}
          height={32}
          className="object-contain w-full h-full"
          loading="lazy"
          unoptimized={true}
          onError={() => setImageError(true)}
        />
      </div>
    )
  }
  
  return (
    <div className="w-8 h-8 flex-shrink-0 rounded bg-gray-200 dark:bg-slate-600 flex items-center justify-center">
      <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">
        {brandName.substring(0, 2).toUpperCase()}
      </span>
    </div>
  )
}

// Componente para mostrar el logo de la marca en el panel de desktop
function BrandLogoDesktop({ brand }: { brand: MarcaNavegacion }) {
  const [imageError, setImageError] = useState(false)
  const logoUrl = brand.logo_url ? buildBrandLogoUrl(brand.logo_url) : null
  const brandName = brand.nombre.trim()
  
  if (logoUrl && !imageError) {
    return (
      <div className="w-10 h-10 flex-shrink-0 rounded bg-gray-50 dark:bg-slate-700 p-1.5 flex items-center justify-center border border-gray-200 dark:border-gray-600 group-hover:border-[#139ED4] dark:group-hover:border-[#88D4E4] transition-colors">
        <Image
          src={logoUrl}
          alt={brandName}
          width={40}
          height={40}
          className="object-contain w-full h-full"
          loading="lazy"
          unoptimized={true}
          onError={() => setImageError(true)}
        />
      </div>
    )
  }
  
  return (
    <div className="w-10 h-10 flex-shrink-0 rounded bg-gray-200 dark:bg-slate-600 flex items-center justify-center border border-gray-300 dark:border-gray-500">
      <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">
        {brandName.substring(0, 2).toUpperCase()}
      </span>
    </div>
  )
}

interface CategoriesSidebarProps {
  locale: string
  trigger?: React.ReactNode
  categories?: CategoriaNavegacion[] // Categorías cargadas desde el servidor (opcional)
}

export function CategoriesSidebar({ locale, trigger, categories: serverCategories = [] }: CategoriesSidebarProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoriaNavegacion[]>(serverCategories)
  const [loadingCategories, setLoadingCategories] = useState(serverCategories.length === 0)
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)
  const [expandedCategoryMobile, setExpandedCategoryMobile] = useState<number | null>(null)
  const [categorySubcategorias, setCategorySubcategorias] = useState<Record<number, SubcategoriaNavegacion[]>>({})
  const [loadingSubcategorias, setLoadingSubcategorias] = useState<Record<number, boolean>>({})
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isMouseOverBrandsPanel, setIsMouseOverBrandsPanel] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [panelKey, setPanelKey] = useState(0) // Key única para forzar re-render del panel
  const [panelLeft, setPanelLeft] = useState(384) // Posición del panel (inicial: ancho del sidebar md:w-96 = 384px)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const brandsPanelRef = useRef<HTMLDivElement>(null)
  const sheetContentRef = useRef<HTMLDivElement | null>(null)

  // Cargar categorías desde el endpoint solo si no se proporcionaron desde el servidor
  useEffect(() => {
    // Si ya tenemos categorías del servidor, no necesitamos cargarlas
    if (serverCategories.length > 0) {
      setCategories(serverCategories)
      setLoadingCategories(false)
      return
    }

    // Solo cargar desde el cliente si no se proporcionaron categorías del servidor (fallback)
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        const categorias = await CategoriesService.getCategorias()
        // Filtrar la categoría "DESPACHO DE PRODUCTOS" (categoría oculta para trabajadores)
        const filteredCategories = categorias.filter(
          (cat) => cat.nombre.toUpperCase() !== 'DESPACHO DE PRODUCTOS'
        )
        setCategories(filteredCategories)
      } catch (error) {
        console.error('Error loading categories from arbol-navegacion:', error)
        setCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }
    loadCategories()
  }, [serverCategories])

  // Limpiar estado cuando se cierra el sheet
  useEffect(() => {
    if (!isSheetOpen) {
      setHoveredCategory(null)
      setExpandedCategoryMobile(null)
    }
  }, [isSheetOpen])

  // Detectar tamaÃ±o de pantalla para mostrar panel solo en desktop
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024) // lg breakpoint
    }

    // Verificar estado inicial
    checkIsDesktop()

    // Escuchar cambios de tamaÃ±o de ventana
    window.addEventListener('resize', checkIsDesktop)
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  // Cargar subcategorías con marcas cuando se hace hover sobre una categorÃ­a (desktop) o se expande (mobile)
  useEffect(() => {
    const categoryToLoad = isDesktop ? hoveredCategory : expandedCategoryMobile
    
    if (categoryToLoad && !categorySubcategorias[categoryToLoad] && !loadingSubcategorias[categoryToLoad]) {
      setLoadingSubcategorias(prev => ({ ...prev, [categoryToLoad]: true }))
      CategoriesService.getSubcategoriasConMarcas(categoryToLoad, 6)
        .then((subcategorias) => {
          setCategorySubcategorias(prev => ({ ...prev, [categoryToLoad]: subcategorias }))
          setLoadingSubcategorias(prev => ({ ...prev, [categoryToLoad]: false }))
        })
        .catch((error) => {
          console.error('Error loading subcategories:', error)
          setLoadingSubcategorias(prev => ({ ...prev, [categoryToLoad]: false }))
        })
    }
  }, [hoveredCategory, expandedCategoryMobile, categorySubcategorias, loadingSubcategorias, isDesktop])

  // Limpiar paneles de marcas antiguos del DOM cuando cambia la categoría
  useEffect(() => {
    // Buscar todos los paneles de marcas en el DOM
    const allPanels = document.querySelectorAll('[data-brand-panel]')

    // Si hay más de un panel (solapamiento), eliminar los antiguos
    if (allPanels.length > 1) {
      // Mantener solo el último panel (el más reciente)
      for (let i = 0; i < allPanels.length - 1; i++) {
        allPanels[i].parentElement?.remove()
      }
    }
  }, [hoveredCategory, panelKey])

  const handleCategoryHover = (categoryId: number) => {
    // Solo activar hover en desktop
    if (!isDesktop) return

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    // Si cambia la categoría, incrementar la key para forzar re-render
    if (hoveredCategory !== categoryId) {
      setPanelKey(prev => prev + 1)
    }

    setHoveredCategory(categoryId)
  }

  const handleCategoryLeave = () => {
    // Solo cerrar si el mouse no estÃ¡ sobre el panel de marcas
    // Si el panel estÃ¡ visible, no cerrar la categorÃ­a
    if (isMouseOverBrandsPanel || hoveredCategory) {
      return // No cerrar si el mouse estÃ¡ sobre el panel o hay una categorÃ­a activa
    }

    // Solo cerrar si realmente no hay hover activo
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isMouseOverBrandsPanel && !hoveredCategory) {
        setHoveredCategory(null)
      }
      hoverTimeoutRef.current = null
    }, 300)
  }

  const handleBrandsPanelEnter = () => {
    setIsMouseOverBrandsPanel(true)
    // Cancelar cualquier timeout pendiente cuando el mouse entra al panel
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    // Asegurar que la categorÃ­a sigue activa
    if (hoveredCategory) {
      setHoveredCategory(hoveredCategory)
    }
  }

  const handleBrandsPanelLeave = () => {
    // No cerrar si se estÃ¡ haciendo clic
    if (isClicking) {
      return
    }
    
    setIsMouseOverBrandsPanel(false)
    // Cerrar el panel cuando el mouse sale completamente del Ã¡rea del panel
    // Pero dar mÃ¡s tiempo para permitir clics
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      // Verificar que el mouse realmente saliÃ³ y no estÃ¡ volviendo, y que no se estÃ¡ haciendo clic
      if (!isMouseOverBrandsPanel && !isClicking) {
        setHoveredCategory(null)
      }
      hoverTimeoutRef.current = null
    }, 500) // Delay aumentado para permitir clics
  }

  // Handler para click en categoría en mobile/tablet
  const handleCategoryClickMobile = (categoryId: number, e: React.MouseEvent) => {
    // Solo en mobile/tablet
    if (isDesktop) return
    
    // Prevenir navegación por defecto en mobile cuando hacemos click
    e.preventDefault()
    
    // Toggle: si ya está expandida, colapsar; si no, expandir
    if (expandedCategoryMobile === categoryId) {
      setExpandedCategoryMobile(null)
    } else {
      setExpandedCategoryMobile(categoryId)
    }
  }

  const currentSubcategorias = hoveredCategory ? categorySubcategorias[hoveredCategory] || [] : []
  const isLoading = hoveredCategory ? loadingSubcategorias[hoveredCategory] || false : false
  const hoveredCategoryData = categories.find(c => c.id === hoveredCategory)

  // Calcular la posición del panel de marcas dinámicamente
  const calculatePanelPosition = () => {
    if (typeof window === 'undefined' || !isDesktop) return 0

    const sheetElement = document.querySelector('[data-state="open"]')
    if (sheetElement) {
      const rect = sheetElement.getBoundingClientRect()
      // Posicionar justo después del sidebar
      return Math.ceil(rect.right)
    }

    // Fallback: ancho típico del sidebar en desktop (md:w-96 = 384px)
    return 384
  }

  const defaultTrigger = (
    <Button
      variant="ghost"
      className="flex items-center gap-2 h-10 px-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Abrir menú de categorías"
    >
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Categorías</span>
      <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
    </Button>
  )

  // Limpiar hover en desktop cuando cambia a mobile, y viceversa
  useEffect(() => {
    if (!isDesktop) {
      setHoveredCategory(null)
      setIsMouseOverBrandsPanel(false)
    } else {
      setExpandedCategoryMobile(null)
    }
  }, [isDesktop])

  // Actualizar posición del panel de marcas dinámicamente
  useEffect(() => {
    if (!isSheetOpen || !isDesktop || !hoveredCategory) {
      // No resetear a 0, mantener la última posición calculada
      return
    }

    const updatePosition = () => {
      // Buscar el sheet usando múltiples selectores para asegurar que lo encontremos
      // Priorizar el ref si está disponible, luego buscar en el DOM
      let sheetElement: HTMLElement | null = sheetContentRef.current

      if (!sheetElement) {
        // Buscar el elemento del sheet que está abierto
        const foundElement = document.querySelector('[data-state="open"][data-radix-dialog-content]') ||
          document.querySelector('[data-radix-dialog-content]') ||
          document.querySelector('[data-state="open"]')
        if (foundElement) {
          sheetElement = foundElement as HTMLElement
        }
      }

      if (sheetElement) {
        const rect = sheetElement.getBoundingClientRect()

        // Verificar que el rect sea válido y tenga dimensiones
        if (rect.width > 0 && rect.right > 0 && rect.left >= 0) {
          // Posicionar el panel justo después del sidebar (rect.right es donde termina el sidebar)
          // No agregar margen, el panel debe empezar exactamente donde termina el sidebar
          const calculatedLeft = Math.ceil(rect.right)

          // Asegurar que el panel no se salga de la pantalla
          const panelWidth = 320 // w-80 = 320px
          const maxLeft = window.innerWidth - panelWidth
          const finalLeft = Math.min(calculatedLeft, maxLeft)

          // Asegurar que el panel esté al menos donde termina el sidebar (sin solapamiento)
          // Si calculatedLeft es menor que rect.right, usar rect.right para evitar solapamiento
          const safeLeft = Math.max(finalLeft, rect.right)

          // Debug: verificar que la posición sea correcta
          // El panel debe estar a la derecha del sidebar, no en la misma posición
          if (safeLeft <= rect.left) {
            // Si por alguna razón safeLeft es menor o igual a rect.left, usar rect.right
            setPanelLeft(Math.ceil(rect.right))
          } else {
            // Solo actualizar si la posición es diferente y válida
            if (safeLeft !== panelLeft && safeLeft > 0) {
              setPanelLeft(safeLeft)
            }
          }

          // Actualizar CSS variable para la zona de conexión
          document.documentElement.style.setProperty('--sheet-width', `${rect.width}px`)
          document.documentElement.style.setProperty('--panel-left', `${safeLeft}px`)
        }
      }
    }

    // Usar múltiples intentos para asegurar que el DOM esté listo
    const rafId = requestAnimationFrame(() => {
      updatePosition()
      // Actualizar después de delays progresivos para asegurar que las animaciones del sheet hayan terminado
      setTimeout(updatePosition, 50)
      setTimeout(updatePosition, 150)
      setTimeout(updatePosition, 300)
    })

    // Actualizar en resize y scroll
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [hoveredCategory, isSheetOpen, isDesktop])

  // Función para cerrar el sheet
  const closeSheet = () => {
    console.log('[CategoriesSidebar] closeSheet called')
    setHoveredCategory(null)
    setExpandedCategoryMobile(null)
    setIsSheetOpen(false)
  }

  // Función para navegar y cerrar el sheet
  const handleNavigate = (url: string) => {
    console.log('[CategoriesSidebar] handleNavigate called with URL:', url)
    console.log('[CategoriesSidebar] Current state:', { isSheetOpen, isDesktop, hoveredCategory })
    
    closeSheet()
    
    // Pequeño delay para que la animación de cierre se vea suave
    setTimeout(() => {
      console.log('[CategoriesSidebar] Navigating to:', url)
      router.push(url)
    }, 100)
  }

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} modal={false}>
        <SheetTrigger asChild>
          {trigger || defaultTrigger}
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-full sm:w-80 md:w-96 p-0 flex flex-col bg-white dark:bg-slate-900"
          ref={sheetContentRef}
          disableOverlayPointerEvents={isDesktop && hoveredCategory !== null}
        >
          <div className="flex flex-col min-h-0 flex-1">
            <SheetHeader className="px-6 py-4 border-b flex-shrink-0">
              <SheetTitle className="text-xl font-bold text-inxora-dark-blue dark:text-white">
                Categorías
              </SheetTitle>
              <SheetDescription className="sr-only">
                Navegación de categorías y marcas de productos
              </SheetDescription>
            </SheetHeader>

            {/* SecciÃ³n de CategorÃ­as */}
            <div className="flex-1 overflow-y-auto">
              {/* Lista de categorÃ­as con scroll */}
              <div className="px-4 py-4">
                  {loadingCategories ? (
                    <div className="px-4 py-12 text-center">
                      <div className="text-sm text-muted-foreground">
                        <p>Cargando categorías...</p>
                      </div>
                    </div>
                  ) : categories && categories.length > 0 ? (
                    <div className="space-y-1">
                      {categories.map((category) => {
                        const isActive = hoveredCategory === category.id
                        const isExpandedMobile = expandedCategoryMobile === category.id
                        const categorySubcategoriasData = categorySubcategorias[category.id] || []
                        const isLoadingData = loadingSubcategorias[category.id] || false
                        
                        return (
                          <div
                            key={category.id}
                            className={cn(
                              "relative",
                              isActive && "z-10" // Asegurar que la categorÃ­a activa estÃ© por encima
                            )}
                            onMouseEnter={() => {
                              handleCategoryHover(category.id)
                              setIsMouseOverBrandsPanel(false) // Reset cuando se entra a una categorÃ­a
                            }}
                            onMouseLeave={(e) => {
                              // Si la categorÃ­a estÃ¡ activa y el panel estÃ¡ visible, NO cerrar
                              // El panel se cerrarÃ¡ solo cuando el mouse salga del panel mismo
                              if (isActive && hoveredCategory) {
                                // No hacer nada, dejar que el panel maneje su propio cierre
                                return
                              }
                              // Solo cerrar si la categorÃ­a no estÃ¡ activa
                              handleCategoryLeave()
                            }}
                          >
                            <Link
                              href={buildCategoryUrlFromObject(category, locale)}
                              onClick={(e) => handleCategoryClickMobile(category.id, e)}
                              className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-lg",
                                "text-sm font-medium text-gray-700 dark:text-gray-300",
                                "hover:bg-[#88D4E4]/20 hover:text-[#139ED4]",
                                "dark:hover:bg-[#88D4E4]/10 dark:hover:text-[#88D4E4]",
                                "transition-all duration-200",
                                "group cursor-pointer",
                                "active:scale-[0.98]",
                                hoveredCategory === category.id && "bg-[#88D4E4]/20 dark:bg-[#88D4E4]/10",
                                isExpandedMobile && "bg-[#88D4E4]/20 dark:bg-[#88D4E4]/10"
                              )}
                            >
                              <span className="flex-1 truncate pr-2">{category.nombre}</span>
                              {/* En desktop: mostrar ChevronRight, en mobile: mostrar ChevronDown con rotación */}
                              <ChevronRight className={cn(
                                "h-4 w-4 text-muted-foreground group-hover:text-[#139ED4] dark:group-hover:text-[#88D4E4] transition-all duration-200 flex-shrink-0",
                                isDesktop ? "opacity-0 group-hover:opacity-100 group-hover:translate-x-1" : "opacity-100",
                                !isDesktop && isExpandedMobile && "rotate-90"
                              )} />
                            </Link>
                            
                            {/* Subcategorías con marcas inline en mobile/tablet */}
                            {!isDesktop && isExpandedMobile && (
                              <div className="px-2 py-3 bg-gray-50 dark:bg-slate-800/50 rounded-b-lg mt-1 max-h-96 overflow-y-auto">
                                {isLoadingData ? (
                                  <div className="flex items-center justify-center py-6">
                                    <div className="text-xs text-muted-foreground">Cargando...</div>
                                  </div>
                                ) : categorySubcategoriasData.length > 0 ? (
                                  <div className="space-y-4">
                                    <SheetClose asChild>
                                      <Link
                                        href={buildCategoryUrlFromObject(category, locale)}
                                        className="block px-3 py-2 text-xs font-semibold text-[#139ED4] dark:text-[#88D4E4] hover:underline"
                                      >
                                        Ver todo →
                                      </Link>
                                    </SheetClose>
                                    {categorySubcategoriasData.map((subcategoria) => (
                                      <div key={subcategoria.id} className="space-y-1">
                                        <div className="px-3 py-1">
                                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                                            {subcategoria.nombre}
                                          </h4>
                                        </div>
                                        {/* Link a la subcategoría */}
                                        <SheetClose asChild>
                                          <Link
                                            href={buildCategorySubcategoriaUrl(category, subcategoria, locale)}
                                            className="block px-3 py-2 rounded-md hover:bg-white dark:hover:bg-slate-700 transition-colors mb-2"
                                          >
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                              Ver productos de {subcategoria.nombre}
                                            </span>
                                          </Link>
                                        </SheetClose>
                                        {/* Links a marcas individuales */}
                                        {subcategoria.marcas && subcategoria.marcas.length > 0 && (
                                          <div className="space-y-1">
                                            {subcategoria.marcas.map((brand) => (
                                              <SheetClose asChild key={brand.id}>
                                                <Link
                                                  href={buildCategorySubcategoriaMarcaUrl(category, subcategoria, brand, locale)}
                                                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white dark:hover:bg-slate-700 transition-colors"
                                                >
                                                  <BrandLogo brand={brand} />
                                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                    {brand.nombre}
                                                  </span>
                                                </Link>
                                              </SheetClose>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-6">
                                    <p className="text-xs text-muted-foreground">
                                      No hay subcategorías disponibles
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-12 text-center">
                      <div className="text-sm text-muted-foreground">
                        <p>No hay categorÃ­as disponibles</p>
                      </div>
                    </div>
                  )}
                </div>
            </div>

            {/* Footer con contador */}
            <div className="px-6 py-4 border-t bg-muted/50 flex-shrink-0">
              <p className="text-xs text-muted-foreground text-center">
                {categories?.length || 0} {(categories?.length || 0) === 1 ? 'categorÃ­a' : 'categorÃ­as'}
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Panel de marcas renderizado como portal - SOLO EN DESKTOP */}
      {hoveredCategory && isSheetOpen && isDesktop && typeof window !== 'undefined' && createPortal(
        <div key={`brand-panel-${hoveredCategory}-${panelKey}`}>
          {/* Zona de conexión REMOVIDA temporalmente para testing - podría estar bloqueando eventos */}

          <div
            ref={brandsPanelRef}
            data-brand-panel
            className="fixed top-0 h-screen bg-white dark:bg-slate-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 overflow-y-auto"
            style={{
              width: '320px',
              left: `${panelLeft}px`,
              zIndex: 99999, // Z-index muy alto
              pointerEvents: 'auto',
              cursor: 'auto',
              opacity: hoveredCategory ? 1 : 0,
              visibility: hoveredCategory ? 'visible' : 'hidden',
              transition: 'opacity 0.2s ease-in-out, left 0.1s ease-out',
              transform: 'translateZ(0)',
              isolation: 'isolate' // Crear nuevo contexto de stacking
            }}
            onClick={(e) => {
              console.log('[CategoriesSidebar] Panel container clicked!', e.target)
            }}
            onMouseEnter={handleBrandsPanelEnter}
            onMouseLeave={(e) => {
              // No cerrar si se está haciendo clic en algún elemento del panel
              if (isClicking) {
                return
              }

              // Verificar si el elemento relacionado es clickeable o está dentro del panel
              const relatedTarget = e.relatedTarget
              // Verificar que relatedTarget sea un Element (tiene el método closest)
              if (relatedTarget && relatedTarget instanceof Element && (
                relatedTarget.closest('[data-brand-panel]') ||
                relatedTarget.closest('a') ||
                relatedTarget.closest('button')
              )) {
                return
              }

              handleBrandsPanelLeave()
            }}
          >
            <div className="p-6">
              {/* Header del panel de marcas */}
              <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-inxora-dark-blue dark:text-white mb-2">
                  {hoveredCategoryData?.nombre}
                </h3>
                <button
                  onClick={(e) => {
                    console.log('[CategoriesSidebar] "Ver todo" clicked', { hoveredCategoryData, locale })
                    e.preventDefault()
                    e.stopPropagation()
                    if (hoveredCategoryData) {
                      const url = buildCategoryUrlFromObject(hoveredCategoryData, locale)
                      console.log('[CategoriesSidebar] Built URL:', url)
                      handleNavigate(url)
                    }
                  }}
                  className="text-sm text-[#139ED4] hover:text-[#88D4E4] dark:text-[#88D4E4] dark:hover:text-[#139ED4] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Ver todo
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Lista de subcategorías con marcas */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-sm text-muted-foreground">Cargando...</div>
                </div>
              ) : currentSubcategorias.length > 0 ? (
                <div className="space-y-6">
                  {currentSubcategorias.map((subcategoria) => (
                    <div key={subcategoria.id} className="space-y-3">
                      {/* Título de la subcategoría */}
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                        {subcategoria.nombre}
                      </h4>
                      
                      {/* Marcas de la subcategoría */}
                      {subcategoria.marcas && subcategoria.marcas.length > 0 ? (
                        <div className="space-y-2">
                          {/* Header de la subcategoría con link */}
                          <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                            <button
                              onClick={(e) => {
                                console.log('[CategoriesSidebar] Subcategoria clicked:', subcategoria.nombre)
                                e.preventDefault()
                                e.stopPropagation()
                                if (hoveredCategoryData) {
                                  const url = buildCategorySubcategoriaUrl(hoveredCategoryData, subcategoria, locale)
                                  console.log('[CategoriesSidebar] Subcategoria URL:', url)
                                  handleNavigate(url)
                                }
                              }}
                              className="flex items-center justify-between w-full hover:text-[#139ED4] transition-colors cursor-pointer"
                            >
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {subcategoria.nombre}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Ver productos →
                              </span>
                            </button>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {subcategoria.marcas.slice(0, 6).map((brand) => (
                                <button
                                  key={brand.id}
                                  onClick={(e) => {
                                    console.log('[CategoriesSidebar] Brand clicked:', brand.nombre)
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (hoveredCategoryData) {
                                      const url = buildCategorySubcategoriaMarcaUrl(hoveredCategoryData, subcategoria, brand, locale)
                                      console.log('[CategoriesSidebar] Brand URL:', url)
                                      handleNavigate(url)
                                    }
                                  }}
                                  className="flex items-center gap-1.5 p-1.5 rounded hover:bg-[#88D4E4]/20 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                >
                                  <BrandLogoDesktop brand={brand} />
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {brand.nombre}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                          </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          No hay marcas disponibles
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">
                    No hay subcategorías disponibles para esta categoría
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        , document.body)}
    </>
  )
}