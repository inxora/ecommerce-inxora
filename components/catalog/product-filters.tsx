"use client"

import { useState, useEffect } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Categoria, Marca } from "@/lib/supabase"

export interface FilterState {
  categoria?: string
  marca?: string
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
}

export function ProductFilters({ 
  categories, 
  brands, 
  filters, 
  onFiltersChange, 
  totalProducts 
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const sortOptions = [
    { value: 'nombre_asc', label: 'Nombre A-Z' },
    { value: 'nombre_desc', label: 'Nombre Z-A' },
    { value: 'precio_asc', label: 'Precio menor a mayor' },
    { value: 'precio_desc', label: 'Precio mayor a menor' },
    { value: 'destacado', label: 'Destacados' },
  ]

  const priceRanges = [
    { min: 0, max: 100, label: 'Menos de S/ 100' },
    { min: 100, max: 500, label: 'S/ 100 - S/ 500' },
    { min: 500, max: 1000, label: 'S/ 500 - S/ 1,000' },
    { min: 1000, max: 5000, label: 'S/ 1,000 - S/ 5,000' },
    { min: 5000, max: undefined, label: 'Más de S/ 5,000' },
  ]

  const updateFilter = (key: keyof FilterState, value: any) => {
    // Handle 'all' value by clearing the filter
    if (value === 'all') {
      const newFilters = { ...filters }
      delete newFilters[key]
      onFiltersChange(newFilters)
    } else {
      onFiltersChange({ ...filters, [key]: value })
    }
  }

  const clearFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => filters[key as keyof FilterState] !== undefined).length
  }

  const setPriceRange = (min: number, max?: number) => {
    onFiltersChange({ 
      ...filters, 
      precioMin: min, 
      precioMax: max 
    })
  }

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="font-semibold mb-3">Ordenar por</h3>
        <Select value={filters.ordenar || undefined} onValueChange={(value) => updateFilter('ordenar', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar orden" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categorías</h3>
        <Select value={filters.categoria || undefined} onValueChange={(value) => updateFilter('categoria', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3">Marcas</h3>
        <Select value={filters.marca || undefined} onValueChange={(value) => updateFilter('marca', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las marcas</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={String(brand.id)}>
                {brand.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Ranges */}
      <div>
        <h3 className="font-semibold mb-3">Rango de precio</h3>
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <Button
              key={index}
              variant={
                filters.precioMin === range.min && filters.precioMax === range.max
                  ? "default"
                  : "ghost"
              }
              className="w-full justify-start"
              onClick={() => setPriceRange(range.min, range.max)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {getActiveFiltersCount() > 0 && (
        <Button variant="outline" onClick={clearAllFilters} className="w-full">
          Limpiar filtros
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Filtros</span>
              <Badge variant="secondary">{totalProducts}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FiltersContent />
          </CardContent>
        </Card>
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
            {filters.categoria && (
              <Badge variant="outline" className="flex items-center gap-1">
                {categories.find(c => String(c.id) === filters.categoria)?.nombre}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => clearFilter('categoria')}
                />
              </Badge>
            )}
            {filters.marca && (
              <Badge variant="outline" className="flex items-center gap-1">
                {brands.find(b => String(b.id) === filters.marca)?.nombre}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => clearFilter('marca')}
                />
              </Badge>
            )}
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
                    clearFilter('precioMin')
                    clearFilter('precioMax')
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