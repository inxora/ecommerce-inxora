"use client"

import { ProductCard } from '@/components/catalog/product-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Producto } from '@/lib/supabase'

interface RelatedProductsProps {
  products: Producto[]
  title?: string
}

export function RelatedProducts({ products, title }: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || 'Productos relacionados'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}