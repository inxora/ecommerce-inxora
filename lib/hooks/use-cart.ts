'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Product } from '@/lib/supabase'
import { cartUtils } from '@/lib/utils'
import { useToast } from './use-toast'

export function useCart() {
  const [cart, setCart] = useState({ items: [] })
  const [isLoaded, setIsLoaded] = useState(false)
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const { toast } = useToast()
  const isUpdatingFromEvent = useRef(false)
  const prevCartRef = useRef<string>('')

  // Cargar carrito desde localStorage al montar el componente
  useEffect(() => {
    const loadCart = () => {
      const savedCart = cartUtils.getCart()
      
      const newCartItems = savedCart.items.map(item => ({
        product: {
          sku: item.sku,
          nombre: item.nombre,
          precio_venta: item.precio_venta,
          imagen_principal_url: item.imagen,
          seo_slug: item.slug
        },
        quantity: item.cantidad,
        selectedSize: undefined
      }))
      
      // Actualizar referencia para evitar guardar inmediatamente
      prevCartRef.current = JSON.stringify(newCartItems.map(item => ({
        sku: item.product.sku,
        quantity: item.quantity
      })))
      
      setCart({ items: newCartItems })
      setIsLoaded(true)
    }
    
    loadCart()
    
    // Escuchar cambios en localStorage desde otras pestañas/ventanas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'inxora-cart') {
        isUpdatingFromEvent.current = true
        loadCart()
        setUpdateTrigger(prev => prev + 1)
        setTimeout(() => {
          isUpdatingFromEvent.current = false
        }, 100)
      }
    }
    
    // Escuchar eventos personalizados de cambios en el carrito (solo de otras pestañas)
    // NO escuchamos nuestros propios eventos para evitar ciclos
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])
  
  // Guardar carrito en localStorage cuando cambie (solo después de cargar)
  useEffect(() => {
    if (!isLoaded || isUpdatingFromEvent.current) return
    
    // Serializar el carrito para comparar si realmente cambió
    const cartSerialized = JSON.stringify(cart.items.map(item => ({
      sku: item.product.sku,
      quantity: item.quantity
    })))
    
    // Si no cambió, no hacer nada
    if (prevCartRef.current === cartSerialized) return
    
    prevCartRef.current = cartSerialized
    
    const cartState = {
      items: cart.items.map(item => ({
        sku: item.product.sku,
        nombre: item.product.nombre,
        precio_venta: item.product.precio_venta,
        cantidad: item.quantity,
        imagen: item.product.imagen_principal_url || '',
        slug: item.product.seo_slug || ''
      })),
      total: cart.items.reduce((total, item) => total + (item.product.precio_venta * item.quantity), 0),
      itemCount: cart.items.reduce((total, item) => total + item.quantity, 0)
    }

    cartUtils.saveCart(cartState)
    
    // Disparar evento personalizado para sincronizar otros componentes en la misma ventana
    // Usar setTimeout para evitar disparar en el mismo ciclo de render
    setTimeout(() => {
      if (!isUpdatingFromEvent.current) {
        window.dispatchEvent(new CustomEvent('cart-updated'))
      }
    }, 0)
  }, [cart, isLoaded])

  const addItem = (product: Product, quantity: number = 1, selectedSize?: string) => {
    // Ensure product has a valid SKU
    if (!product.sku) {
      console.error('Product missing SKU:', product)
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito (SKU faltante)",
        variant: "destructive",
      })
      return
    }

    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.product.sku === product.sku && item.selectedSize === selectedSize
      )

      let newItems
      if (existingItemIndex > -1) {
        newItems = [...prevCart.items]
        newItems[existingItemIndex].quantity += quantity
      } else {
        newItems = [...prevCart.items, { product, quantity, selectedSize }]
      }

      return { items: newItems }
    })

    // Force re-render
    setUpdateTrigger(prev => prev + 1)

    toast({
      title: "Producto agregado",
      description: `${product.nombre} se agregó al carrito`,
      variant: "success",
    })
  }

  const removeItem = (productSku: number, selectedSize?: string) => {
    setCart(prevCart => ({
      items: prevCart.items.filter(
        item => !(item.product.sku === productSku && item.selectedSize === selectedSize)
      )
    }))
    
    setUpdateTrigger(prev => prev + 1)
  }

  const updateQuantity = (productSku: number, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeItem(productSku, selectedSize)
      return
    }

    setCart(prevCart => ({
      items: prevCart.items.map(item =>
        item.product.sku === productSku && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    }))
    
    setUpdateTrigger(prev => prev + 1)
  }

  const clearCart = () => {
    setCart({ items: [] })
    setUpdateTrigger(prev => prev + 1)
  }

  const getItemsCount = () => {
    const count = cart.items.reduce((total, item) => total + item.quantity, 0)
    return count
  }

  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => total + (item.product.precio_venta * item.quantity), 0)
  }

  const getCartItems = () => {
    return cart.items
  }

  return {
    items: cart.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemsCount,
    getTotalPrice,
    getCartItems,
    updateTrigger,
    isLoaded
  }
}