"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Filter, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DualRangeSlider } from "@/components/ui/dual-range-slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Categoria, Marca } from "@/lib/supabase"

export interface FilterState {
  categoria?: string | string[]
  marca?: string | string[]
  precioMin?: number
  precioMax?: number
  ordenar?: string
}

interface ProductFiltersProps {
  categories: Categoria[]
  brands: Marca[]
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  totalProducts: number
  categoryName?: string
  categoryDescription?: string
  currentCategoryId?: number
}

export function ProductFilters({ 
  categories, 
  brands, 
  filters, 
  onFiltersChange, 
  totalProducts,
  categoryName,
  categoryDescription,
  currentCategoryId
}: ProductFiltersProps) {
  // Filtrar la categoría "DESPACHO DE PRODUCTOS" (categoría oculta para trabajadores)
  const filteredCategories = categories.filter(
    (cat) => cat.nombre.toUpperCase() !== 'DESPACHO DE PRODUCTOS'
  )
  
  const [isOpen, setIsOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.precioMin || 0,
    filters.precioMax || 10000
  ])
  
  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  const brandDropdownRef = useRef<HTMLDivElement>(null)

  const sortOptions = [
    { value: "nombre_asc", label: "Nombre A-Z" },
    { value: "nombre_desc", label: "Nombre Z-A" },
    { value: "precio_asc", label: "Precio menor a mayor" },
    { value: "precio_desc", label: "Precio mayor a menor" },
    { value: "destacado", label: "Destacados" },
  ]

  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    if (value === "all") {
      const newFilters = { ...filters }
      delete newFilters[key]
      onFiltersChange(newFilters)
      return
    }

    if (key === "categoria") {
      const valueStr = String(value)

      // Cerrar dropdown después de seleccionar
      setTimeout(() => setCategoryDropdownOpen(false), 50)
      
      if (currentCategoryId && valueStr === String(currentCategoryId)) {
        return
      }
      
      onFiltersChange({ ...filters, [key]: [valueStr] })
      
    } else if (key === "marca") {
      const currentValue = filters[key]
      let newValue: string[]
      
      const currentArray = Array.isArray(currentValue) 
        ? currentValue 
        : currentValue !== undefined 
          ? [String(currentValue)] 
          : []
      
      const valueStr = String(value)
      
      if (currentArray.includes(valueStr)) {
        newValue = currentArray.filter(v => v !== valueStr)
      } else {
        newValue = [...currentArray, valueStr]
      }
      
      if (newValue.length === 0) {
        const newFilters = { ...filters }
        delete newFilters[key]
        onFiltersChange(newFilters)
      } else {
        onFiltersChange({ ...filters, [key]: newValue })
      }
    } else {
      onFiltersChange({ ...filters, [key]: value })
    }
  }, [filters, currentCategoryId, onFiltersChange])

  const clearFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const getActiveFiltersCount = () => {
    let count = 0
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof FilterState]
      if (value !== undefined) {
        if (Array.isArray(value)) {
          count += value.length
        } else {
          count += 1
        }
      }
    })
    return count
  }

  const isSelected = (key: "categoria" | "marca", value: string) => {
    const filterValue = filters[key]
    const valueStr = String(value)
    
    if (key === "categoria" && currentCategoryId && valueStr === String(currentCategoryId)) {
      return true
    }
    
    if (Array.isArray(filterValue)) {
      return filterValue.includes(valueStr)
    }
    if (filterValue !== undefined) {
      return String(filterValue) === valueStr
    }
    return false
  }

  useEffect(() => {
    setPriceRange([
      filters.precioMin || 0,
      filters.precioMax || 10000
    ])
  }, [filters.precioMin, filters.precioMax])

  // 👉 Manejo de click afuera simplificado, compatible con Next (client component)
  useEffect(() => {
    if (!categoryDropdownOpen && !brandDropdownOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      if (
        categoryDropdownOpen &&
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(target)
      ) {
        setCategoryDropdownOpen(false)
      }
      
      if (
        brandDropdownOpen &&
        brandDropdownRef.current &&
        !brandDropdownRef.current.contains(target)
      ) {
        setBrandDropdownOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [categoryDropdownOpen, brandDropdownOpen])

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range)
    onFiltersChange({ 
      ...filters, 
      precioMin: range[0] > 0 ? range[0] : undefined, 
      precioMax: range[1] < 10000 ? range[1] : undefined 
    })
  }

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Category Name and Description */}
      {categoryName && (
        <div className="py-4 pb-6 border-b border-inxora-light-blue/30 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-semibold text-inxora-blue dark:text-inxora-light-blue mb-2 px-1">
            {categoryName}
          </h2>
          {categoryDescription && (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-1 leading-relaxed">
              {categoryDescription}
            </p>
          )}
        </div>
      )}
      
      {/* Results Count */}
      <div className="pb-4 border-b border-inxora-light-blue/30 dark:border-gray-700">
        <p className="text-sm font-semibold text-inxora-dark-blue dark:text-white">
          Resultados ({totalProducts})
        </p>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-semibold mb-3 text-inxora-dark-blue dark:text-white">Ordenar por</h3>
        <Select 
          value={filters.ordenar || undefined} 
          onValueChange={(value) => updateFilter("ordenar", value)}
        >
          <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Seleccionar orden" />
          </SelectTrigger>
          <SelectContent className="z-[100]">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categorías */}
      {filteredCategories.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-inxora-dark-blue dark:text-white">Categoría</h3>
          <div className="relative" ref={categoryDropdownRef}>
            <Button
              variant="outline"
              className="w-full justify-between text-sm"
              onClick={() => setCategoryDropdownOpen(prev => !prev)}
              type="button"
            >
              <span className="truncate">
                {/* Aquí puedes mostrar el recuento real si quieres */}
                1 seleccionada
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  categoryDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
            
            {categoryDropdownOpen && (
              <div 
                className="absolute z-[60] w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto"
              >
                <div className="p-2 space-y-1">
                  {filteredCategories.map((category) => {
                    const categoryId = String(category.id)
                    const selected = isSelected("categoria", categoryId)
                    return (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-inxora-light-blue/10 cursor-pointer transition-colors"
                        onClick={() => {
                          updateFilter("categoria", categoryId)
                        }}
                      >
                        <Checkbox 
                          checked={selected} 
                          onCheckedChange={() => {}}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                          {category.nombre}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Marcas */}
      {brands.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-inxora-dark-blue dark:text-white">Marca</h3>
          <div className="relative" ref={brandDropdownRef}>
            <Button
              variant="outline"
              className="w-full justify-between text-sm"
              onClick={() => setBrandDropdownOpen(prev => !prev)}
              type="button"
            >
              <span className="truncate">
                {Array.isArray(filters.marca) && filters.marca.length > 0
                  ? `${filters.marca.length} seleccionada${filters.marca.length > 1 ? "s" : ""}`
                  : "Seleccionar marcas"}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  brandDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
            
            {brandDropdownOpen && (
              <div 
                className="absolute z-[60] w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto"
              >
                <div className="p-2 space-y-1">
                  {brands.map((brand) => {
                    const brandId = String(brand.id)
                    const selected = isSelected("marca", brandId)
                    return (
                      <div
                        key={brand.id}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-inxora-light-blue/10 cursor-pointer transition-colors"
                        onClick={() => {
                          updateFilter("marca", brandId)
                        }}
                      >
                        <Checkbox 
                          checked={selected} 
                          onCheckedChange={() => {}}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                          {brand.nombre}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Price Range Slider */}
      <div>
        <h3 className="font-semibold mb-3 text-inxora-dark-blue dark:text-white">Rango de precio</h3>
        <div className="space-y-4">
          <DualRangeSlider
            min={0}
            max={10000}
            step={50}
            value={priceRange}
            onChange={handlePriceRangeChange}
          />
          
          {(filters.precioMin !== undefined || filters.precioMax !== undefined) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPriceRange([0, 10000])
                clearFilter("precioMin")
                clearFilter("precioMax")
              }}
              className="w-full text-xs border-inxora-wine text-inxora-wine hover:bg-inxora-wine/10"
            >
              Limpiar rango
            </Button>
          )}
        </div>
      </div>

      {/* Clear Filters */}
      {getActiveFiltersCount() > 0 && (
        <Button 
          variant="outline" 
          onClick={clearAllFilters} 
          className="w-full border-inxora-wine text-inxora-wine hover:bg-inxora-wine/10 dark:border-inxora-wine dark:text-inxora-wine dark:hover:bg-inxora-wine/20"
        >
          Limpiar filtros
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-lg border border-inxora-light-blue/30 dark:border-gray-700 p-4 sm:p-5 shadow-sm">
        <FiltersContent />
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                  {getActiveFiltersCount() > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <Badge variant="secondary">
            {totalProducts} productos encontrados
          </Badge>
        </div>

        {/* Active Filters */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.isArray(filters.categoria) ? (
              filters.categoria.map((catId) => {
                const category = filteredCategories.find(c => String(c.id) === catId)
                return category ? (
                  <Badge key={catId} variant="outline" className="flex items-center gap-1">
                    {category.nombre}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilter("categoria", catId)}
                    />
                  </Badge>
                ) : null
              })
            ) : filters.categoria ? (
              (() => {
                const category = filteredCategories.find(c => String(c.id) === filters.categoria)
                return category ? (
                  <Badge key={filters.categoria} variant="outline" className="flex items-center gap-1">
                    {category.nombre}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => clearFilter("categoria")}
                    />
                  </Badge>
                ) : null
              })()
            ) : null}
            {Array.isArray(filters.marca) ? (
              filters.marca.map((brandId) => {
                const brand = brands.find(b => String(b.id) === brandId)
                return brand ? (
                  <Badge key={brandId} variant="outline" className="flex items-center gap-1">
                    {brand.nombre}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilter("marca", brandId)}
                    />
                  </Badge>
                ) : null
              })
            ) : filters.marca ? (
              (() => {
                const brand = brands.find(b => String(b.id) === filters.marca)
                return brand ? (
                  <Badge key={filters.marca} variant="outline" className="flex items-center gap-1">
                    {brand.nombre}
                    <X 
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => clearFilter("marca")}
                    />
                  </Badge>
                ) : null
              })()
            ) : null}
            {(filters.precioMin !== undefined || filters.precioMax !== undefined) && (
              <Badge variant="outline" className="flex items-center gap-1">
                {filters.precioMin && filters.precioMax 
                  ? `S/ ${filters.precioMin} - S/ ${filters.precioMax}`
                  : filters.precioMin 
                    ? `Desde S/ ${filters.precioMin}`
                    : `Hasta S/ ${filters.precioMax}`
                }
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    clearFilter("precioMin")
                    clearFilter("precioMax")
                  }}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </>
  )
}
