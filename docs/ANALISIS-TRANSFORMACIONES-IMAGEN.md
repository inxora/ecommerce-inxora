# Análisis: dónde se usan `/_next/image` y cuánto consumen

## Confirmación Cloudinary

En el plan Free de **Image and Video APIs**, **25 créditos = 25.000 transformaciones/mes** (o 25 GB almacenamiento, o 25 GB bandwidth). Aquí se asume que el límite relevante son las **25k transformaciones**.

---

## Dónde se generan llamadas a `/_next/image` (Vercel o Cloudinary)

Cada uso de `<Image>` de Next.js con **URL externa** (Supabase) pasa por el optimizador → 1 petición = 1 transformación. Las rutas locales con `unoptimized` **no** cuentan.

### Origen de las transformaciones por página / flujo

| Ubicación | Componente | Origen de la imagen | Transformaciones por vista |
|-----------|------------|---------------------|----------------------------|
| **Catálogo** | `ProductCard` | `product.imagen_principal_url` (Supabase) | **50** (itemsPerPage = 50) |
| **Categoría / subcategoría / marca** | `ProductCard` | Igual | **50** por página |
| **Home – slider destacados** | `FeaturedProductsSlider` | `product.imagen_principal_url` | **20** |
| **Home – slider nuevos** | `FeaturedProductsSlider` | Igual | **10** |
| **Home – categorías** | `CategoriesCarousel` o sección categorías | `category.logo_url` (Supabase) | **~9** (tantas como categorías) |
| **Ficha de producto** | `ProductImageZoom` | Imagen principal del producto | **1** (las miniaturas usan `<img>`, no cuentan) |
| **Drawer del carrito** | `CartDrawer` | `product.imagen_principal_url` | **1 por ítem** (típico 1–10) |
| **Página carrito** | `carrito/page` | Igual | **1 por ítem** |
| **Página pedido** | `pedido/[id]/page` | `item.images[0]` | **1 por ítem** |
| **Sidebar categorías** | `CategoriesSidebar` → `BrandLogoDesktop` | `brand.logo_url` (Supabase) | **hasta 6** por subcategoría al hacer hover |
| **Carousel marcas** | `category-brands-carousel` | `brand.logo_url` | **N** (según marcas mostradas) |

### Qué no pasa por `/_next/image`

- **Header y footer**: logo con `unoptimized` → piden `/LOGO-30.png` directamente.
- **Miniaturas en ficha de producto**: usan `<img>`, no `<Image>`.

---

## Cálculo orientativo por sesión y por mes

### Sesión “normal” (1 usuario recorre la tienda)

Supuesto:

- 1 visita al **home** → 20 + 10 + 9 = **39**
- 2 vistas de **catálogo** o listados (50 productos cada una) → 2 × 50 = **100**
- 2 **fichas de producto** → 2 × 1 = **2**
- 1 vez **carrito** (p. ej. 3 ítems) → **3**
- Sidebar / marcas: pocas vistas → **~5** de media

Total por sesión: **~150 transformaciones** (rango típico **120–200**).

### ¿25.000 transformaciones alcanzan?

- 25.000 ÷ 150 ≈ **166 sesiones/mes**.
- Si consideras 200 por sesión: 25.000 ÷ 200 = **125 sesiones/mes**.

Es decir: **25.000 transformaciones suelen equivaler a ~125–165 “sesiones completas” al mes.**

Con **299 productos** y **50 productos por página**:

- 1 sola página de catálogo = 50 transformaciones.
- 10 usuarios que abren 2 páginas de catálogo cada uno = 10 × 2 × 50 = **1.000**.
- Home + fichas + carrito suman otras **~50–80** por usuario en ese mismo recorrido.

Por tanto:

- **Tráfico bajo** (p. ej. &lt; 150–200 visitas “útiles” al mes): 25.000 puede ser **suficiente**.
- **Tráfico medio** (500–1000 visitas, varias páginas por usuario): 25.000 se queda **corto** y notarás límite a mitad o antes de mes.
- **Tráfico alto**: 25.000 es **claramente insuficiente**.

---

## Conclusión

- **25.000 transformaciones** en Cloudinary Free **no** son “de sobra” para un ecommerce con 299 productos y 50 productos por página si el tráfico crece un poco.
- **Sí** pueden servir para:
  - Pruebas,
  - tráfico muy bajo,
  - o como respaldo mientras partes del sitio usan `unoptimized` y Supabase/Cloudflare para reducir consumo.

Recomendación práctica:

1. **Corto plazo (sin cambiar de plan):**  
   Poner `unoptimized` en los `<Image>` que más consumen (sobre todo **ProductCard** en catálogo/listados y, si quieres, sliders del home). Así dejas de gastar transformaciones en esas vistas y 25k te duran mucho más o dejas de depender de ese límite para la parte más pesada.

2. **Si adoptas Cloudinary:**  
   Usar el Free para validar. Cuando el uso se acerque a 25k/mes o necesites más calidad/formatos, valorar un plan superior o combinar Cloudinary (solo donde aporte valor) con `unoptimized` en listados y miniaturas.

Este análisis se puede usar tanto para Vercel (Image Optimization) como para Cloudinary (misma idea: 1 solicitud de imagen transformada = 1 unidad de consumo).
