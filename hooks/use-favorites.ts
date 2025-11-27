'use client'

import React, { useState, useEffect } from 'react'
import { Product } from '@/lib/supabase'
import { favoritesUtils, FavoriteItem } from '@/lib/utils'
import { useToast } from './use-toast'

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const { toast } = useToast()

  // Cargar favoritos desde localStorage al montar el componente
  useEffect(() => {
    const loadFavorites = () => {
      const savedFavorites = favoritesUtils.getFavorites()
      setFavorites(savedFavorites.items)
      setIsLoaded(true)
    }
    
    loadFavorites()
    
    // Escuchar cambios en localStorage desde otras pestañas/ventanas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'inxora-favorites') {
        loadFavorites()
        setUpdateTrigger(prev => prev + 1)
      }
    }
    
    // Escuchar eventos personalizados de cambios en favoritos
    const handleFavoritesUpdated = () => {
      loadFavorites()
      setUpdateTrigger(prev => prev + 1)
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('favorites-updated', handleFavoritesUpdated)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('favorites-updated', handleFavoritesUpdated)
    }
  }, [])

  const addFavorite = (product: Product) => {
    // Obtener el precio
    let precioPrincipal = 0
    
    if (product.precios && product.precios.length > 0) {
      const hoy = new Date().toISOString().split('T')[0]
      const preciosVigentes = product.precios.filter(precio => {
        if (!precio.activo) return false
        const fechaDesde = precio.fecha_vigencia_desde
        const fechaHasta = precio.fecha_vigencia_hasta
        if (fechaDesde && fechaDesde > hoy) return false
        if (fechaHasta && fechaHasta < hoy) return false
        return true
      })
      
      const precioSoles = preciosVigentes.find(p => 
        p.moneda && typeof p.moneda === 'object' && 'codigo' in p.moneda && p.moneda.codigo === 'PEN'
      )
      const precioDolares = preciosVigentes.find(p => 
        p.moneda && typeof p.moneda === 'object' && 'codigo' in p.moneda && p.moneda.codigo === 'USD'
      )
      const precioSeleccionado = precioSoles || precioDolares || preciosVigentes[0]
      precioPrincipal = precioSeleccionado?.precio_venta || 0
    } else {
      precioPrincipal = product.precios_por_moneda?.soles?.precio_venta || 
                       product.precios_por_moneda?.dolares?.precio_venta || 
                       product.precio_venta || 
                       0
    }

    const favoriteItem: FavoriteItem = {
      sku: product.sku,
      nombre: product.nombre,
      precio_venta: precioPrincipal,
      imagen: product.imagen_principal_url || '',
      slug: product.seo_slug || '',
      sku_producto: product.sku_producto,
      cod_producto_marca: product.cod_producto_marca
    }

    favoritesUtils.addFavorite(favoriteItem)
    const updatedFavorites = favoritesUtils.getFavorites()
    setFavorites(updatedFavorites.items)
    setUpdateTrigger(prev => prev + 1)

    toast({
      title: "Agregado a favoritos",
      description: `${product.nombre} se agregó a tus favoritos`,
      variant: "success",
    })
  }

  const removeFavorite = (sku: number) => {
    favoritesUtils.removeFavorite(sku)
    const updatedFavorites = favoritesUtils.getFavorites()
    setFavorites(updatedFavorites.items)
    setUpdateTrigger(prev => prev + 1)

    toast({
      title: "Eliminado de favoritos",
      description: "El producto se eliminó de tus favoritos",
      variant: "default",
    })
  }

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.sku)) {
      removeFavorite(product.sku)
    } else {
      addFavorite(product)
    }
  }

  const isFavorite = (sku: number): boolean => {
    return favoritesUtils.isFavorite(sku)
  }

  const getFavoritesCount = (): number => {
    return favorites.length
  }

  const clearFavorites = () => {
    favoritesUtils.clearFavorites()
    setFavorites([])
    setUpdateTrigger(prev => prev + 1)
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoritesCount,
    clearFavorites,
    updateTrigger,
    isLoaded
  }
}

