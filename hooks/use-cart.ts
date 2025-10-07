'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/supabase'
import { cartUtils } from '@/lib/utils'
import { useToast } from './use-toast'

export function useCart() {
  const [cart, setCart] = useState({ items: [] })
  const [isLoaded, setIsLoaded] = useState(false)
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const { toast } = useToast()

  // Cargar carrito desde localStorage al montar el componente
  useEffect(() => {
    const savedCart = cartUtils.getCart()
    console.log('Loading cart from localStorage:', savedCart)
    
    setCart({ 
      items: savedCart.items.map(item => ({
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
    })
    setIsLoaded(true)
  }, [])

  // Guardar carrito en localStorage cuando cambie (solo después de cargar)
  useEffect(() => {
    if (!isLoaded) return
    
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

    console.log('Saving cart to localStorage:', cartState)
    cartUtils.saveCart(cartState)
  }, [cart, isLoaded])

  const addItem = (product: Product, quantity: number = 1, selectedSize?: string) => {
    console.log('=== ADD ITEM DEBUG ===')
    console.log('Product received:', product)
    console.log('Quantity:', quantity)
    console.log('Selected size:', selectedSize)
    
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

    console.log('Using product SKU as ID:', product.sku)

    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.product.sku === product.sku && item.selectedSize === selectedSize
      )

      let newItems
      if (existingItemIndex > -1) {
        console.log('Updating existing item quantity')
        newItems = [...prevCart.items]
        newItems[existingItemIndex].quantity += quantity
      } else {
        console.log('Adding new item to cart')
        newItems = [...prevCart.items, { product, quantity, selectedSize }]
      }

      console.log('New cart items:', newItems)
      return { items: newItems }
    })

    // Force re-render
    const newTrigger = updateTrigger + 1
    console.log('Setting updateTrigger to:', newTrigger)
    setUpdateTrigger(newTrigger)

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
    console.log('getItemsCount called, returning:', count)
    return count
  }

  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => total + (item.product.precio_venta * item.quantity), 0)
  }

  const getCartItems = () => {
    return cart.items
  }

  console.log('Header render - updateTrigger:', updateTrigger, 'itemsCount:', getItemsCount())

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