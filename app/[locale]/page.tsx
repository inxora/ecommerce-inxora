'use client'

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { getProductosDestacados, getCategorias, Producto, Categoria } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';

export default function HomePage({ params }: { params: { locale: string } }) {
  const { addItem } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Producto[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productosData, categoriasData] = await Promise.all([
          getProductosDestacados(4),
          getCategorias()
        ]);
        
        console.log('Productos destacados recibidos:', productosData);
        console.log('Categorías recibidas:', categoriasData);
        
        if (productosData.data) {
          console.log('Setting featured products:', productosData.data.length, 'productos');
          setFeaturedProducts(productosData.data as Producto[]);
        } else {
          console.log('No hay datos de productos destacados');
        }
        
        if (categoriasData.data) {
          // Tomar las primeras 6 categorías
          console.log('Setting categories:', categoriasData.data.length, 'categorías');
          setCategories(categoriasData.data.slice(0, 6));
        } else {
          console.log('No hay datos de categorías');
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (product: Producto) => {
    // Preparar el producto con precio_venta disponible
    const precioPrincipal = product.precios_por_moneda?.soles?.precio_venta || 
                           product.precios_por_moneda?.dolares?.precio_venta || 
                           product.precio_venta || 
                           0
    
    const productToAdd = {
      ...product,
      precio_venta: precioPrincipal
    }
    
    addItem(productToAdd, 1);
  };

  // Mapeo de imágenes para las categorías (mantener las imágenes actuales)
  const categoryImages: Record<number, string> = {
    1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBq3Q9ZZopE0QStHQqu5hACHd-hByecyEGM6CWtRZoc-wKmzt1IVulEm0VygZScgZMiZf8NP_d0_2Esr8c7nl2R_4Q_4hFymhKY6Ec2hMhVf-QhAGnCLCSUj9IuTGUp5e_N-h9s4hIbgUuQBu8AoO5wSR-_BQ74_X30gZycrhFvVGq8MixvoarjlVs0gBVfNFBXjk3cB2_aEX4nxwzhW0QpPPjEM0c40vSZNcL3MJEIQSLGW3HiGAuUj5PyHCaJJLTGjiHlLNirFt8',
    2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyTndwtiVCCoPgNlxgrhcHAC2ywYdqK0Px4DYQQoIbZnXk2GHeUqOgXKTdwBS-73JlS7uFS31Vsd0dJk-uN1eudA8NgdPCmlCyLV3hrtgPTdeUIT7qCTU2MC-Y_e8aikQ9GWLv8NKMPwIFJX2IL_tn9RfkpwxBTpVBo-o7oJFsorxutZOIhH0ub8S8xqLb9cX2UiMsO9ormJ757QctBz6WhqWhBT5tl-MysAINPVLUuhWihzBe3SKksawicGFfnhfVrDwKlBrnORU',
    3: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeFrVXbaJhl-boubfVopyd1vvDHDPJ6RRt8uEAYZjNBBEi4EbOLoHS5vWjTUz7I8RkK7lVJM86tP2RMAR9fmUoUy1hzzFwPO4KWt4uoiIoyHNoIayZf8QK9SfxRbW8x49az2czEI76NnPuOrd15BfMaFUJdRFc9GMlFdov4dz1glMDVt0hzsTAHhRDNAuN7jFqvw_dhbb-L7texnUDGjZwwQ2JkQWxTeDSZ-TMDSKtotHcH7Zfn6ksSxd5RM3bLQfA03dMVd5cc0Q',
    4: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm6ajuzSDT9UW8R3GdnuSsgU2pjGPSiAtldZFe_nRUNIFmidznnf-PT-ON9GjbrDKV_ogyL-a847KmEGljSQJrNoEtMNIaviU-CiIDWmRc3UVpRR1JNDqWLKz9l9WvSCVpELb49fghg72zZFCZtIpsR5iwMvI_tRVRPm3-1Haz3YkdsqmBV7dhJYf8gEKokP7sXT3OrkiYhc5ym-WQiCDS1cRLYI3SJuSXQsvmj9mWaLgeqrC9XycYSaLtBquVNTDcP0Qx8yK1Jis',
    5: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEv9F3-SftwgIELEqGFHG4Geir-8lOHbSokMv2WZMlD-HWDHhAzzziwv-S6voX978HvxgGMMiYOnoCgjosHL8xusKHB6AWfL8MgpWCyKjV1uJ3Fc5obC7CxyLsKi2YXXxh76_CVrRThQOtxsV2SO_ZR9g4xa9Up0tHfnriDdNbtJIwyI8UtAWgSC4K5atKz4OyFlBAz7dhIjJndW2EDuIgR_sfUwBgv63KieJNqMaXZaY8DI5g05Rv5GhxCSm5bW9oSmKZqocIy6o',
    6: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfk2-2IUQqkIyltA9GI2j8ncJEKA-Dg-ChxRCC9ySi0dlomtq1qfZgPDoEzOfnqCr_QipdIC8GVdhV7EFZ3aw_-gWgBBytimw2V-VedGLaSgM5qh050uST6zzVFlhRYZuKT84JREqSLFpJFuEu_5GB5Z8i8-SQiKhcKQ0Bqt17S06JoND-vQqqIZeGuPHs5oaGDJ-CPtqyjBzp-nSCB_lQPotn-kmxvIb5erZL10Wut7s7SlF7t35tRK1Lu9fpV-2kH5sFeWe2-Ao',
  };
  
  // Función para obtener la imagen de la categoría (mantener las imágenes actuales por índice)
  const getCategoryImage = (index: number) => {
    const imageKeys = [1, 2, 3, 4, 5, 6];
    const imageKey = imageKeys[index % imageKeys.length];
    return categoryImages[imageKey] || categoryImages[1];
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section 
        className="relative flex min-h-[60vh] items-center justify-center bg-cover bg-center py-20" 
        style={{
          backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1)), url("/suministros_industriales_inxora_ecommerce_2025_front_1_web.jpg")'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Suministros Industriales de Calidad
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-200">
            Encuentra todo lo que necesitas para tu negocio en un solo lugar. Explora nuestra amplia gama de productos y aprovecha nuestras ofertas exclusivas.
          </p>
          <div className="mt-10">
            <Link 
              href={`/${params.locale}/catalogo`}
              className="inline-block rounded-lg bg-primary px-8 py-3 text-base font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105"
            >
              Explorar Catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12 text-center">
            Productos Destacados
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const precioPrincipal = product.precios_por_moneda?.soles?.precio_venta || 
                                       product.precios_por_moneda?.dolares?.precio_venta || 
                                       product.precio_venta || 0;
                const moneda = product.precios_por_moneda?.soles?.moneda || 
                              product.precios_por_moneda?.dolares?.moneda || 
                              product.moneda;
                
                return (
                  <Link 
                    key={product.sku} 
                    href={`/${params.locale}/producto/${product.seo_slug}`}
                    className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <Image 
                        alt={product.nombre}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                        src={product.imagen_principal_url || '/placeholder-product.svg'}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {product.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {product.descripcion_corta || ''}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">
                          {precioPrincipal > 0 
                            ? `${moneda?.simbolo || 'S/'} ${precioPrincipal.toFixed(2)}`
                            : 'Consultar precio'
                          }
                        </span>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          className="flex items-center gap-1"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No hay productos destacados disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="bg-background-light dark:bg-background-dark py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12 text-center">
            Categorías Principales
          </h2>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-40 w-full bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 lg:gap-8">
              {categories.map((category, index) => (
                <Link 
                  key={category.id} 
                  href={`/${params.locale}/catalogo?categoria=${category.id}`} 
                  className="group block text-center"
                >
                  <div className="overflow-hidden rounded-xl">
                    <img 
                      alt={category.nombre} 
                      className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      src={getCategoryImage(index)}
                    />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                    {category.nombre}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No hay categorías disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Explora Nuestro Catálogo Completo
          </h2>
          <div className="mt-8">
            <Link 
              href={`/${params.locale}/catalogo`}
              className="inline-block rounded-lg bg-primary px-8 py-3 text-base font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105"
            >
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}