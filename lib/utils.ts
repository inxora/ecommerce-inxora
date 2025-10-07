import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatear precio en soles peruanos
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(price)
}

// Generar ID único para pedidos
export function generateOrderId(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `ORD-${year}${month}${day}-${random}`
}

// Validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validar RUC peruano (opcional)
export function isValidRUC(ruc: string): boolean {
  if (!ruc || ruc.length !== 11) return false
  return /^\d{11}$/.test(ruc)
}

// Validar teléfono peruano
export function isValidPhone(phone: string): boolean {
  // Acepta formatos: +51987654321, 987654321, 51987654321
  const phoneRegex = /^(\+?51)?[9][0-9]{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Formatear teléfono para WhatsApp
export function formatPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('51')) {
    return `+${cleaned}`
  }
  if (cleaned.startsWith('9') && cleaned.length === 9) {
    return `+51${cleaned}`
  }
  return `+${cleaned}`
}

// Crear URL de WhatsApp con mensaje
export function createWhatsAppUrl(phone: string, message: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone)
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${formattedPhone.replace('+', '')}?text=${encodedMessage}`
}

// Truncar texto
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Slugify texto para URLs
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9 -]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Remover guiones múltiples
    .trim()
}

// Tipos para el carrito
export interface CartItem {
  sku: number
  nombre: string
  precio_venta: number
  cantidad: number
  imagen: string
  slug: string
}

export interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

// Funciones del carrito (localStorage)
export const cartUtils = {
  getEmptyCart: (): CartState => {
    return { items: [], total: 0, itemCount: 0 }
  },

  getCart: (): CartState => {
    if (typeof window === 'undefined') {
      return { items: [], total: 0, itemCount: 0 }
    }
    
    try {
      const cart = localStorage.getItem('inxora-cart')
      if (!cart) {
        return { items: [], total: 0, itemCount: 0 }
      }
      
      const parsed = JSON.parse(cart)
      return {
        items: parsed.items || [],
        total: parsed.total || 0,
        itemCount: parsed.itemCount || 0
      }
    } catch {
      return { items: [], total: 0, itemCount: 0 }
    }
  },

  saveCart: (cart: CartState): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('inxora-cart', JSON.stringify(cart))
  },

  addItem: (item: Omit<CartItem, 'cantidad'>, cantidad = 1): CartState => {
    const cart = cartUtils.getCart()
    const existingIndex = cart.items.findIndex(i => i.sku === item.sku)
    
    if (existingIndex >= 0) {
      cart.items[existingIndex].cantidad += cantidad
    } else {
      cart.items.push({ ...item, cantidad })
    }
    
    cart.total = cart.items.reduce((sum, i) => sum + (i.precio_venta * i.cantidad), 0)
    cart.itemCount = cart.items.reduce((sum, i) => sum + i.cantidad, 0)
    
    cartUtils.saveCart(cart)
    return cart
  },

  updateQuantity: (sku: number, cantidad: number): CartState => {
    const cart = cartUtils.getCart()
    const itemIndex = cart.items.findIndex(i => i.sku === sku)
    
    if (itemIndex >= 0) {
      if (cantidad <= 0) {
        cart.items.splice(itemIndex, 1)
      } else {
        cart.items[itemIndex].cantidad = cantidad
      }
    }
    
    cart.total = cart.items.reduce((sum, i) => sum + (i.precio_venta * i.cantidad), 0)
    cart.itemCount = cart.items.reduce((sum, i) => sum + i.cantidad, 0)
    
    cartUtils.saveCart(cart)
    return cart
  },

  removeItem: (sku: number): CartState => {
    const cart = cartUtils.getCart()
    cart.items = cart.items.filter(i => i.sku !== sku)
    
    cart.total = cart.items.reduce((sum, i) => sum + (i.precio_venta * i.cantidad), 0)
    cart.itemCount = cart.items.reduce((sum, i) => sum + i.cantidad, 0)
    
    cartUtils.saveCart(cart)
    return cart
  },

  clearCart: (): CartState => {
    const emptyCart = { items: [], total: 0, itemCount: 0 }
    cartUtils.saveCart(emptyCart)
    return emptyCart
  }
}