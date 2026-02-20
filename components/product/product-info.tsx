'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPrice, formatPriceWithThousands, createWhatsAppUrl } from '@/lib/utils'
import { buildProductUrl } from '@/lib/product-seo'
import { getDisplaySymbol } from '@/lib/constants/currencies'
import { Product } from '@/lib/supabase'
import { useCart } from '@/lib/hooks/use-cart'
import { useToast } from '@/lib/hooks/use-toast'
import { useCurrency } from '@/lib/hooks/use-currency'
import { Shield, Truck, Star, Heart, MessageCircle, Info } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useFavorites } from '@/lib/hooks/use-favorites'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()
  const { currency } = useCurrency()
  const { toggleFavorite, isFavorite } = useFavorites()
  const params = useParams() as { locale?: string }
  const locale = typeof params?.locale === 'string' ? params.locale : 'es'
  
  const isFavorited = isFavorite(product.sku)

  // Exponer nombre del producto para que el widget flotante de WhatsApp lo use
  useEffect(() => {
    if (typeof document !== 'undefined' && product?.nombre) {
      document.body.dataset.productName = product.nombre
      return () => {
        delete document.body.dataset.productName
      }
    }
  }, [product?.nombre])

  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51946885531'
  const skuDisplay = product.sku_producto || product.sku || ''
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tienda.inxora.com'
  const productUrl = `${baseUrl}${buildProductUrl(product, locale)}`
  const whatsappMessage = `Hola Sara Xora, me interesa consultar sobre:\n• Producto: ${product.nombre}\n• SKU: ${skuDisplay}\n• Link: ${productUrl}`
  const whatsappUrl = createWhatsAppUrl(WHATSAPP_NUMBER, whatsappMessage)

  const handleWhatsAppClick = () => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'whatsapp_click',
        whatsapp_click_page: 'producto',
        whatsapp_click_source: 'product_detail',
        whatsapp_click_sku: skuDisplay,
      })
    }
  }

  const handleAddToCart = () => {
    console.log('ProductInfo - Adding to cart:', product, 'quantity:', quantity)
    
    // Obtener el precio del producto - priorizar precio_mostrar del API (moneda_usuario)
    let precioPrincipal = 0
    if (product.precio_mostrar != null) {
      const parsed = parseFloat(String(product.precio_mostrar))
      if (!Number.isNaN(parsed)) precioPrincipal = parsed
    }
    
    if (precioPrincipal === 0 && product.precios && product.precios.length > 0) {
      // Filtrar precios activos y vigentes
      const hoy = new Date().toISOString().split('T')[0]
      const preciosVigentes = product.precios.filter(precio => {
        if (!precio.activo) return false
        
        const fechaDesde = precio.fecha_vigencia_desde
        const fechaHasta = precio.fecha_vigencia_hasta
        
        if (fechaDesde && fechaDesde > hoy) return false
        if (fechaHasta && fechaHasta < hoy) return false
        
        return true
      })
      
      // Buscar precio en soles primero, luego dólares
      const precioSoles = preciosVigentes.find(p => 
        p.moneda && typeof p.moneda === 'object' && 'codigo' in p.moneda && p.moneda.codigo === 'PEN'
      )
      const precioDolares = preciosVigentes.find(p => 
        p.moneda && typeof p.moneda === 'object' && 'codigo' in p.moneda && p.moneda.codigo === 'USD'
      )
      
      // Priorizar soles, luego dólares, luego el primero disponible
      const precioSeleccionado = precioSoles || precioDolares || preciosVigentes[0]
      precioPrincipal = precioSeleccionado?.precio_venta || 0
    }
    if (precioPrincipal === 0) {
      // Fallback a precios_por_moneda si no hay precios directos
      precioPrincipal = product.precios_por_moneda?.soles?.precio_venta || 
                       product.precios_por_moneda?.dolares?.precio_venta || 
                       product.precio_venta || 
                       0
    }
    
    const productToAdd = {
      ...product,
      precio_venta: precioPrincipal
    }
    
    console.log('Product prepared for cart:', productToAdd)
    addItem(productToAdd, quantity)
  }

  // Producto no incluye tallas actualmente; se omite selección de talla

  return (
    <div className="space-y-6">
      {/* Marca arriba del título - esquina superior izquierda */}
      <div className="flex items-start justify-between">
        <div>
          {product.marca && (
            <Badge variant="outline" className="text-xs sm:text-sm">
              {typeof product.marca === 'string' ? product.marca : product.marca.nombre}
            </Badge>
          )}
        </div>
        {/* SKU y código de marca - esquina superior derecha */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {product.sku_producto && (
            <span className="font-mono">SKU: {product.sku_producto}</span>
          )}
          {product.cod_producto_marca && 
           product.cod_producto_marca.trim() !== '' && (
            <span className="font-mono">| {product.cod_producto_marca}</span>
          )}
        </div>
      </div>
      
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-inxora-dark-blue dark:text-white mb-4">{product.nombre}</h1>
      </div>

      {product.descripcion_corta && (
        <div>
          <div 
            className="text-gray-600 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert
              prose-p:mb-3 prose-p:leading-relaxed prose-p:text-gray-600 dark:prose-p:text-gray-300
              prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
              prose-ul:my-4 prose-ul:space-y-2 prose-ul:pl-6
              prose-ol:my-4 prose-ol:space-y-2 prose-ol:pl-6
              prose-li:marker:text-blue-600 dark:prose-li:marker:text-blue-400
              prose-li:ml-4 prose-li:leading-relaxed
              prose-h2:text-lg prose-h2:font-bold prose-h2:mt-4 prose-h2:mb-3 prose-h2:text-gray-900 dark:prose-h2:text-white
              prose-h3:text-base prose-h3:font-semibold prose-h3:mt-3 prose-h3:mb-2 prose-h3:text-gray-800 dark:prose-h3:text-gray-200
              [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
              [&>p]:mb-3 [&>p]:leading-6
              [&>ul>li]:mb-2 [&>ol>li]:mb-2
              [&>h2]:mt-4 [&>h2]:mb-3
              [&>h3]:mt-3 [&>h3]:mb-2"
            dangerouslySetInnerHTML={{ __html: product.descripcion_corta }}
          />
        </div>
      )}

      {/* Precio debajo de la descripción - priorizar precio_simbolo + precio_mostrar; si API envía código, usar símbolo */}
      <div className="pt-2 flex items-center gap-2 flex-wrap">
        <div>
          {product.precio_simbolo != null && product.precio_mostrar != null ? (
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-inxora-blue">
              {getDisplaySymbol(product.precio_simbolo)}{formatPriceWithThousands(product.precio_mostrar)}
            </p>
          ) : currency === 'PEN' && product.precios_por_moneda?.soles ? (
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-inxora-blue">
              {product.precios_por_moneda.soles.moneda.simbolo} {product.precios_por_moneda.soles.precio_venta.toFixed(2)}
            </p>
          ) : currency === 'USD' && product.precios_por_moneda?.dolares ? (
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-inxora-blue">
              {product.precios_por_moneda.dolares.moneda.simbolo} {product.precios_por_moneda.dolares.precio_venta.toFixed(2)}
            </p>
          ) : (
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-inxora-blue">Consultar precio</p>
          )}
        </div>
        {product.condicion_precio_venta != null && product.condicion_precio_venta.trim() !== '' && (
          <span
            className="relative group inline-flex flex-shrink-0"
            title={product.condicion_precio_venta}
          >
            <Info
              className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400 cursor-help hover:text-inxora-blue dark:hover:text-inxora-light-blue transition-colors"
              aria-label={`Condición de precio: ${product.condicion_precio_venta}`}
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-10 whitespace-normal max-w-[260px] text-center">
              {product.condicion_precio_venta}
            </span>
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cantidad
          </label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="px-4 py-2 border rounded-md text-center min-w-[60px]">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto] gap-2 sm:gap-3 min-w-0">
          <Button
            onClick={handleAddToCart}
            className="col-span-2 sm:col-span-1 min-w-0 bg-inxora-blue hover:bg-inxora-blue/90 text-white py-3 sm:py-4 text-xs sm:text-sm md:text-base"
            size="lg"
          >
            <span className="hidden sm:inline truncate">Agregar al carrito</span>
            <span className="sm:hidden truncate">Agregar</span>
          </Button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="col-span-2 sm:col-span-1 min-w-0"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full min-w-0 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366] py-3 sm:py-4 text-xs sm:text-sm md:text-base inline-flex items-center justify-center"
            >
              <MessageCircle className="h-4 w-4 flex-shrink-0 mr-1.5 sm:mr-2" />
              <span className="hidden md:inline truncate min-w-0">Consultar por WhatsApp</span>
              <span className="md:hidden truncate min-w-0">WhatsApp</span>
            </Button>
          </a>
          <Button
            onClick={() => toggleFavorite(product)}
            variant={isFavorited ? "default" : "outline"}
            size="lg"
            className="px-2 min-w-0 shrink-0 py-3 sm:py-4"
            aria-label={isFavorited ? "Eliminar de favoritos" : "Agregar a favoritos"}
          >
            <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {(() => {
          // Usar primera categoría del array categorias, o categoria como fallback
          const categoria = product?.categorias && product.categorias.length > 0
            ? product.categorias[0]
            : product?.categoria
          
          return categoria ? (
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Categoría: </span>
              <Badge variant="secondary">{typeof categoria === 'string' ? categoria : categoria.nombre}</Badge>
            </div>
          ) : null
        })()}
      </div>

      {/* Trust Badges - 3 Cards dentro del card de información */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-inxora-light-blue/10 dark:bg-slate-700 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-inxora-light-blue/20 dark:border-gray-600">
          <Shield className="h-8 w-8 text-inxora-blue mx-auto mb-2" />
          <p className="text-sm font-semibold text-inxora-dark-blue dark:text-white mb-1">Garantía</p>
          <Link 
            href={`/${locale}/terminos`}
            className="text-xs text-inxora-blue hover:text-inxora-dark-blue hover:underline"
          >
            Ver condiciones
          </Link>
        </div>
        <div className="bg-inxora-light-blue/10 dark:bg-slate-700 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-inxora-light-blue/20 dark:border-gray-600">
          <Truck className="h-8 w-8 text-inxora-light-blue mx-auto mb-2" />
          <p className="text-sm font-bold text-inxora-dark-blue dark:text-white mb-1">
            Envío Gratis
          </p>
          <Link 
            href={`/${locale}/envios`}
            className="text-xs text-inxora-blue hover:text-inxora-dark-blue hover:underline"
          >
            Ver condiciones
          </Link>
        </div>
        <div className="bg-inxora-light-blue/10 dark:bg-slate-700 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-inxora-light-blue/20 dark:border-gray-600">
          <Star className="h-8 w-8 text-inxora-fuchsia mx-auto mb-2" />
          <p className="text-sm font-semibold text-inxora-dark-blue dark:text-white mb-1">
            Descuentos especiales
          </p>
          <Link 
            href={`/${locale}/terminos`}
            className="text-xs text-inxora-blue hover:text-inxora-dark-blue hover:underline"
          >
            Ver condiciones
          </Link>
        </div>
      </div>
    </div>
  )
}
