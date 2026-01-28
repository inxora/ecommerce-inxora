'use client'

import { useEffect } from 'react'
import Link from 'next/link'

// Nota: metadata no funciona en Client Components, pero esta página no necesita SEO (noindex)
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, Package, Heart } from 'lucide-react'
import { useCart } from '@/lib/hooks/use-cart'
import { formatPrice } from '@/lib/utils'

export default function CartPage({ params }: { params: { locale: string } }) {
  const { items, updateQuantity, removeItem, getTotalPrice, getItemsCount, updateTrigger } = useCart()
  
  // Forzar re-render cuando cambie el carrito
  useEffect(() => {
    // El updateTrigger ya maneja el re-render, pero lo incluimos en las dependencias
  }, [updateTrigger, items])

  const subtotal = getTotalPrice()
  const itemCount = getItemsCount()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Link
                href={`/${params.locale}/catalogo`}
                className="inline-flex items-center px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuar Comprando
              </Link>
              
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <Package className="h-5 w-5" />
                <span className="text-sm font-medium">{itemCount} {itemCount === 1 ? 'producto' : 'productos'}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Carrito de Compras
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Revisa tus productos antes de continuar
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {items.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="h-8 w-8 text-white" />
                <h3 className="text-2xl font-bold text-white">Carrito vacío</h3>
              </div>
            </div>
            <div className="p-12">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Tu carrito está vacío
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed max-w-md mx-auto">
                  Agrega algunos productos increíbles para comenzar tu compra.
                </p>
                <Link
                  href={`/${params.locale}/catalogo`}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Explorar Productos
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.product.sku} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-xl flex-shrink-0 overflow-hidden">
                        {item.product.imagen_principal_url && item.product.imagen_principal_url.trim() !== '' ? (
                          <Image
                            src={item.product.imagen_principal_url}
                            alt={item.product.nombre || 'Producto sin nombre'}
                            title={item.product.nombre || 'Producto sin nombre'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center p-2">
                            <p className="text-gray-600 dark:text-gray-300 text-xs text-center line-clamp-3 font-medium" aria-label={item.product.nombre || 'Producto sin imagen'}>
                              {item.product.nombre || 'Sin imagen'}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                          {item.product.nombre}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          SKU: {item.product.sku_producto || item.product.sku}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                            <span className="text-xl font-bold">
                              {item.product.precio_venta 
                                ? formatPrice(item.product.precio_venta)
                                : 'Consultar precio'
                              }
                            </span>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.product.sku, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
                            >
                              <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            <span className="w-8 text-center font-bold text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.sku, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
                            >
                              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        <button className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Heart className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.sku)}
                          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Item Total */}
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total del producto:</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {item.product.precio_venta 
                            ? formatPrice(item.product.precio_venta * item.quantity)
                            : 'Consultar precio'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl sticky top-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-2xl">
                  <h3 className="text-xl font-bold text-white">Resumen del Pedido</h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-400">Envío:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      Gratis
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <Link
                      href={`/${params.locale}/checkout`}
                      className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      Proceder al Checkout
                    </Link>
                    
                    <Link
                      href={`/${params.locale}/catalogo`}
                      className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-xl transition-all duration-200"
                    >
                      Seguir Comprando
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}