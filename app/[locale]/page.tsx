'use client'

import React, { Suspense } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';

export default function HomePage({ params }: { params: { locale: string } }) {
  const { addItem } = useCart();

  // Productos de ejemplo para la página de inicio
  const featuredProducts = [
    {
      id: '1',
      nombre: 'Taladro Industrial HD-2000',
      precio_venta: 299.99,
      imagen_principal_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfbr7g696_ppomf7OH1lsTTofxzkqV-3uW6pJx9uokMFrEaxzZYytg2LG3xLtBdnIzsIxJ0UlEO1-yF0OK_KN8oWQ675gnEeMT92IxvFaQfgZadM-FDJO0u_xfZMPQWlNI-euLYNia1RXzdKYEdGqDzouaamzDaIPmPSgQ43TIkjPD34rrGefyyeG07fIgO3qRw1hyTqVI9fTIQRWDBQai1CiC3KYsGn45SXCCnaN1RzD1IPFQRELanQmcjJZPgP07zEUVA5zGwcU',
      seo_slug: 'taladro-industrial-hd-2000',
      descripcion: 'Taladro industrial de alta potencia para trabajos pesados.'
    },
    {
      id: '2',
      nombre: 'Casco de Seguridad Pro',
      precio_venta: 45.99,
      imagen_principal_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSrHDArvmEWRrEG0kO9pecY0Phek89g6ad8Qrq-1L38bdvr0RuB9EOpjVFDDEqysFX9kmtZwduzhBrTI-JN5eIDJnbhsOOwj0d76wxZvoVK4AJJdoOdNGj7ZsZEv0F6u5Q7ew3f49N7PJE7os3jtHHQ6IrlprAyjCraNQ5ZsfPpJEL20fu7OHNHPLx_UZd7tKo3QP3wGrTvAdplVv6b94NCZU5M3hQU7kxd4yeyPCYDf6zZHNU5hi7bh7t5CevUJwT_0urEvwqwG8',
      seo_slug: 'casco-seguridad-pro',
      descripcion: 'Casco de seguridad certificado para máxima protección.'
    },
    {
      id: '3',
      nombre: 'Sierra Circular Eléctrica',
      precio_venta: 189.99,
      imagen_principal_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcYuHQ8rclA4Wj1FlQSbBCtgStN8owjnJzgsOSjOmsbo3dWfHXSSy5Blx0hjwYBMXsXI6ZRyq6ha1SCRT1VbXYEhn4hkBeKsoedK54Nk2Nn5z8HdMLaM1WR_caTPBeHg-zu42gXp3o-VG-e4deqpIRVl73e-nvA8TPSMbYBM7gy8xtGRTK630o0Mr-gyzKlyG-JxE5LPrCn1ynNmuJAd2UqGWo2iP1PKhDyNpRJ4JLhsBYwr1derih4-0WlfSsP0XVhIm4vipoalc',
      seo_slug: 'sierra-circular-electrica',
      descripcion: 'Sierra circular eléctrica de precisión para cortes profesionales.'
    },
    {
      id: '4',
      nombre: 'Kit Herramientas Manuales',
      precio_venta: 79.99,
      imagen_principal_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwwWuqWLZk7eC5CZ2orufWKYGykz5iY7MlX9Nlu13VsaNhxZdQXhjDM_fF7IqzV0WVArpYEtYF9w6TWu9D4mvptq5eMrLANzG7lOBEdVwB396xZfpZRpNX2KrwfmUV7umefXsNI-oDW_79R6RVwt2QDzQcDywwe0dPC75p02HGoZWPrU73Ian7xLtMTdJ0ltQE5bnQGa3ZJyBLolHhdiUImyPXzS0Aqw2J7oXtEGGydgG0yqlp4b9mgDH3dlo4Kw6Z4C7VJ1_EWT4',
      seo_slug: 'kit-herramientas-manuales',
      descripcion: 'Kit completo de herramientas manuales para todo tipo de trabajos.'
    }
  ];

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-square overflow-hidden">
                  <img 
                    alt={product.nombre}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src={product.imagen_principal_url}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {product.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {product.descripcion}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(product.precio_venta)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-1"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="bg-background-light dark:bg-background-dark py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12 text-center">
            Categorías Principales
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 lg:gap-8">
            <Link href={`/${params.locale}/categoria/herramientas`} className="group block text-center">
              <div className="overflow-hidden rounded-xl">
                <img 
                  alt="Herramientas" 
                  className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq3Q9ZZopE0QStHQqu5hACHd-hByecyEGM6CWtRZoc-wKmzt1IVulEm0VygZScgZMiZf8NP_d0_2Esr8c7nl2R_4Q_4hFymhKY6Ec2hMhVf-QhAGnCLCSUj9IuTGUp5e_N-h9s4hIbgUuQBu8AoO5wSR-_BQ74_X30gZycrhFvVGq8MixvoarjlVs0gBVfNFBXjk3cB2_aEX4nxwzhW0QpPPjEM0c40vSZNcL3MJEIQSLGW3HiGAuUj5PyHCaJJLTGjiHlLNirFt8"
                />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">Herramientas</h3>
            </Link>
            <Link href={`/${params.locale}/categoria/seguridad`} className="group block text-center">
              <div className="overflow-hidden rounded-xl">
                <img 
                  alt="Seguridad" 
                  className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyTndwtiVCCoPgNlxgrhcHAC2ywYdqK0Px4DYQQoIbZnXk2GHeUqOgXKTdwBS-73JlS7uFS31Vsd0dJk-uN1eudA8NgdPCmlCyLV3hrtgPTdeUIT7qCTU2MC-Y_e8aikQ9GWLv8NKMPwIFJX2IL_tn9RfkpwxBTpVBo-o7oJFsorxutZOIhH0ub8S8xqLb9cX2UiMsO9ormJ757QctBz6WhqWhBT5tl-MysAINPVLUuhWihzBe3SKksawicGFfnhfVrDwKlBrnORU"
                />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">Seguridad</h3>
            </Link>
            <Link href={`/${params.locale}/categoria/mantenimiento`} className="group block text-center">
              <div className="overflow-hidden rounded-xl">
                <img 
                  alt="Mantenimiento" 
                  className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeFrVXbaJhl-boubfVopyd1vvDHDPJ6RRt8uEAYZjNBBEi4EbOLoHS5vWjTUz7I8RkK7lVJM86tP2RMAR9fmUoUy1hzzFwPO4KWt4uoiIoyHNoIayZf8QK9SfxRbW8x49az2czEI76NnPuOrd15BfMaFUJdRFc9GMlFdov4dz1glMDVt0hzsTAHhRDNAuN7jFqvw_dhbb-L7texnUDGjZwwQ2JkQWxTeDSZ-TMDSKtotHcH7Zfn6ksSxd5RM3bLQfA03dMVd5cc0Q"
                />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">Mantenimiento</h3>
            </Link>
            <Link href={`/${params.locale}/categoria/almacenamiento`} className="group block text-center">
              <div className="overflow-hidden rounded-xl">
                <img 
                  alt="Almacenamiento" 
                  className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm6ajuzSDT9UW8R3GdnuSsgU2pjGPSiAtldZFe_nRUNIFmidznnf-PT-ON9GjbrDKV_ogyL-a847KmEGljSQJrNoEtMNIaviU-CiIDWmRc3UVpRR1JNDqWLKz9l9WvSCVpELb49fghg72zZFCZtIpsR5iwMvI_tRVRPm3-1Haz3YkdsqmBV7dhJYf8gEKokP7sXT3OrkiYhc5ym-WQiCDS1cRLYI3SJuSXQsvmj9mWaLgeqrC9XycYSaLtBquVNTDcP0Qx8yK1Jis"
                />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">Almacenamiento</h3>
            </Link>
            <Link href={`/${params.locale}/categoria/soldadura`} className="group block text-center">
              <div className="overflow-hidden rounded-xl">
                <img 
                  alt="Soldadura" 
                  className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEv9F3-SftwgIELEqGFHG4Geir-8lOHbSokMv2WZMlD-HWDHhAzzziwv-S6voX978HvxgGMMiYOnoCgjosHL8xusKHB6AWfL8MgpWCyKjV1uJ3Fc5obC7CxyLsKi2YXXxh76_CVrRThQOtxsV2SO_ZR9g4xa9Up0tHfnriDdNbtJIwyI8UtAWgSC4K5atKz4OyFlBAz7dhIjJndW2EDuIgR_sfUwBgv63KieJNqMaXZaY8DI5g05Rv5GhxCSm5bW9oSmKZqocIy6o"
                />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">Soldadura</h3>
            </Link>
            <Link href={`/${params.locale}/categoria/fijacion`} className="group block text-center">
              <div className="overflow-hidden rounded-xl">
                <img 
                  alt="Fijación" 
                  className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfk2-2IUQqkIyltA9GI2j8ncJEKA-Dg-ChxRCC9ySi0dlomtq1qfZgPDoEzOfnqCr_QipdIC8GVdhV7EFZ3aw_-gWgBBytimw2V-VedGLaSgM5qh050uST6zzVFlhRYZuKT84JREqSLFpJFuEu_5GB5Z8i8-SQiKhcKQ0Bqt17S06JoND-vQqqIZeGuPHs5oaGDJ-CPtqyjBzp-nSCB_lQPotn-kmxvIb5erZL10Wut7s7SlF7t35tRK1Lu9fpV-2kH5sFeWe2-Ao"
                />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">Fijación</h3>
            </Link>
          </div>
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