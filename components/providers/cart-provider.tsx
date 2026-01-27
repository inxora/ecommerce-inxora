'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Product } from '@/lib/supabase'
import { cartUtils } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'

/** Minimal product shape used in cart (persisted in storage and in-memory). Accepts full Product when adding. */
export type CartProduct = Pick<Product, 'sku' | 'nombre' | 'imagen_principal_url' | 'seo_slug'> & {
  precio_venta?: number
  sku_producto?: string
}

type CartItemInternal = {
  product: CartProduct
  quantity: number
  selectedSize?: string
}

type CartContextValue = {
  items: CartItemInternal[]
  addItem: (product: Product & { precio_venta?: number; sku_producto?: string }, quantity?: number, selectedSize?: string) => void
  removeItem: (productSku: number, selectedSize?: string) => void
  updateQuantity: (productSku: number, quantity: number, selectedSize?: string) => void
  clearCart: () => void
  getItemsCount: () => number
  getTotalPrice: () => number
  getCartItems: () => CartItemInternal[]
  updateTrigger: number
  isLoaded: boolean
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<{ items: CartItemInternal[] }>({ items: [] })
  const [isLoaded, setIsLoaded] = useState(false)
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const { toast } = useToast()
  const isUpdatingFromEvent = useRef(false)
  const prevCartRef = useRef<string>('')

  const loadCart = useCallback(() => {
    const savedCart = cartUtils.getCart()
    const newCartItems: CartItemInternal[] = (savedCart.items || []).map((item: { sku: number; nombre: string; precio_venta: number; cantidad: number; imagen?: string; slug?: string; sku_producto?: string }) => ({
      product: {
        sku: item.sku,
        nombre: item.nombre,
        precio_venta: item.precio_venta,
        imagen_principal_url: item.imagen || '',
        seo_slug: item.slug || '',
        sku_producto: item.sku_producto,
      },
      quantity: item.cantidad,
      selectedSize: undefined,
    }))
    prevCartRef.current = JSON.stringify(newCartItems.map((i) => ({ sku: i.product.sku, q: i.quantity })))
    setCart({ items: newCartItems })
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    loadCart()
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'inxora-cart') {
        isUpdatingFromEvent.current = true
        loadCart()
        setUpdateTrigger((t) => t + 1)
        setTimeout(() => { isUpdatingFromEvent.current = false }, 100)
      }
    }
    const handleCartUpdated = () => {
      const saved = cartUtils.getCart()
      setCart({
        items: (saved.items || []).map((item: { sku: number; nombre: string; precio_venta: number; cantidad: number; imagen?: string; slug?: string; sku_producto?: string }) => ({
          product: {
            sku: item.sku,
            nombre: item.nombre,
            precio_venta: item.precio_venta,
            imagen_principal_url: item.imagen || '',
            seo_slug: item.slug || '',
            sku_producto: item.sku_producto,
          },
          quantity: item.cantidad,
          selectedSize: undefined,
        })),
      })
      setUpdateTrigger((t) => t + 1)
    }
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cart-updated', handleCartUpdated)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cart-updated', handleCartUpdated)
    }
  }, [loadCart])

  useEffect(() => {
    if (!isLoaded || isUpdatingFromEvent.current) return
    const cartSerialized = JSON.stringify(cart.items.map((i) => ({ sku: i.product.sku, q: i.quantity })))
    if (prevCartRef.current === cartSerialized) return
    prevCartRef.current = cartSerialized

    const cartState = {
      items: cart.items.map((i) => ({
        sku: i.product.sku,
        nombre: i.product.nombre,
        precio_venta: i.product.precio_venta ?? 0,
        cantidad: i.quantity,
        imagen: i.product.imagen_principal_url || '',
        slug: i.product.seo_slug || '',
        sku_producto: (i.product as { sku_producto?: string }).sku_producto,
      })),
      total: cart.items.reduce((s, i) => s + (i.product.precio_venta ?? 0) * i.quantity, 0),
      itemCount: cart.items.reduce((s, i) => s + i.quantity, 0),
    }
    cartUtils.saveCart(cartState)
    setTimeout(() => {
      if (!isUpdatingFromEvent.current) window.dispatchEvent(new CustomEvent('cart-updated'))
    }, 0)
  }, [cart, isLoaded])

  const addItem = useCallback((product: Product & { precio_venta?: number; sku_producto?: string }, quantity = 1, selectedSize?: string) => {
    if (!product.sku) {
      toast({ title: 'Error', description: 'No se pudo agregar (SKU faltante)', variant: 'destructive' })
      return
    }
    setCart((prev) => {
      const idx = prev.items.findIndex((i) => i.product.sku === product.sku && i.selectedSize === selectedSize)
      let newItems
      if (idx >= 0) {
        newItems = [...prev.items]
        newItems[idx].quantity += quantity
      } else {
        newItems = [...prev.items, { product, quantity, selectedSize }]
      }
      return { items: newItems }
    })
    setUpdateTrigger((t) => t + 1)
    toast({ title: 'Producto agregado', description: `${product.nombre} se agregó al carrito`, variant: 'success' })
  }, [toast])

  const removeItem = useCallback((productSku: number, selectedSize?: string) => {
    setCart((prev) => ({
      items: prev.items.filter((i) => !(i.product.sku === productSku && i.selectedSize === selectedSize)),
    }))
    setUpdateTrigger((t) => t + 1)
  }, [])

  const updateQuantity = useCallback((productSku: number, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeItem(productSku, selectedSize)
      return
    }
    setCart((prev) => ({
      items: prev.items.map((i) =>
        i.product.sku === productSku && i.selectedSize === selectedSize ? { ...i, quantity } : i
      ),
    }))
    setUpdateTrigger((t) => t + 1)
  }, [removeItem])

  const clearCart = useCallback(() => {
    setCart({ items: [] })
    setUpdateTrigger((t) => t + 1)
  }, [])

  const getItemsCount = useCallback(() => cart.items.reduce((s, i) => s + i.quantity, 0), [cart.items])
  const getTotalPrice = useCallback(
    () => cart.items.reduce((s, i) => s + (i.product.precio_venta ?? 0) * i.quantity, 0),
    [cart.items]
  )
  const getCartItems = useCallback(() => cart.items, [cart.items])

  const value: CartContextValue = {
    items: cart.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemsCount,
    getTotalPrice,
    getCartItems,
    updateTrigger,
    isLoaded,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext must be used within CartProvider')
  return ctx
}
