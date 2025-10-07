"use client"
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AlertCircle, Home, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function OrderNotFound() {
  const t = useTranslations()
  const pathname = usePathname()
  const locale = (pathname?.split('/')?.[1] || 'es')

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardContent className="p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold mb-4">
              {t('order.notFound.title')}
            </h1>
            
            <p className="text-muted-foreground mb-8">
              {t('order.notFound.description')}
            </p>
            
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href={`/${locale}/catalogo`}>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {t('order.notFound.viewCatalog')}
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href={`/${locale}`}>
                  <Home className="w-4 h-4 mr-2" />
                  {t('order.notFound.backHome')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}