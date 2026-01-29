# Verificación Cloudinary y SEO – Endpoints

Resumen de la revisión de los payloads de **arbol-navegacion** y **productos/ecommerce** (enero 2026).

---

## 1. URLs de Cloudinary

### Formato correcto

Todas las URLs de imágenes que devuelve el API siguen el formato esperado de Cloudinary:

- **Categorías:**  
  `https://res.cloudinary.com/dxnw5ewnx/image/upload/v1769613528/<nombre_archivo>.png`  
  Ejemplo: `Bombas_Motores_y_Ventilacion_inll7l.png`, `Electricidad_y_Componentes_Electricos_tikrx7.png`.

- **Marcas:**  
  `https://res.cloudinary.com/dxnw5ewnx/image/upload/v1769615987/<archivo>.png`  
  Ejemplo: `soldexa_vyy20x.png`, `Logo-3M_cthii2.png`.  
  Algunas marcas tienen `logo_url: null` (ej. PRUEBA, SCHNEIDER_ELECTRIC, ZUPPER); el front ya maneja el fallback (iniciales o placeholder).

- **Productos:**  
  `https://res.cloudinary.com/dxnw5ewnx/image/upload/v1769619244/productos/<SKU>/<nombre>.jpg`  
  Ejemplo: `productos/INXHERR521/sacabocado-hidraulico-a-bateria-portatil-con-matrices-pz-6al-inxora-principal.jpg`.  
  Las galerías usan el mismo dominio y path (`.../galeria-1.jpg`, etc.).

El front tiene:

- `res.cloudinary.com` en `next.config.mjs` → `images.remotePatterns`.
- `buildProductImageUrl` y `buildBrandLogoUrl` aceptan URLs completas (Cloudinary o Supabase) y las devuelven tal cual.

**Conclusión:** Los enlaces de Cloudinary en categorías, marcas y productos son correctos y compatibles con el front actual.

### Imágenes de producto: carga directa (unoptimized)

Las URLs en BD son correctas (ej. `https://res.cloudinary.com/dxnw5ewnx/image/upload/v.../productos/<SKU>/<nombre>.jpg`). Para evitar fallos del optimizador de Vercel (proxy/timeout), las imágenes de producto se cargan **directamente desde Cloudinary** (sin pasar por `/_next/image`).

- **Componente centralizado:** `components/ui/product-image.tsx` — envuelve `next/image` con `unoptimized`. Usar `<ProductImage>` en lugar de `<Image>` donde se muestren imágenes de producto o catálogo.
- **Dónde usarlo:** tarjetas de producto (ProductCard), ficha de producto (ProductImageZoom), carrito, home destacados, etc.
- **Por qué:** grandes e-commerce (Falabella, Amazon, Tailey) sirven imágenes desde su CDN directamente; no usan un proxy de optimización por imagen. Cloudinary ya actúa como CDN; el navegador pide la URL y Cloudinary responde. Mantener `unoptimized` en un solo componente facilita cambiar el comportamiento en el futuro si hace falta.

---

## 2. SEO en productos (BD / API)

### Campos que ya envía el API (suficientes para un buen posicionamiento)

| Campo            | Uso en SEO / front                         | Estado en payload      |
|------------------|--------------------------------------------|------------------------|
| `seo_title`      | `<title>`, Open Graph, Twitter             | ✅ Presente y descriptivo |
| `seo_keywords`   | `<meta name="keywords">`                   | ✅ Presente             |
| `seo_slug`       | URL canónica y rutas                       | ✅ Presente             |
| `meta_robots`    | `index,follow` / noindex                   | ✅ `index,follow`       |
| `canonical_url`  | URL canónica absoluta                      | ✅ Ej. `https://tienda.inxora.com/es/...` |
| `nombre`         | H1, alt de imagen principal, schema       | ✅ Presente             |
| `imagen_principal_url` | OG image, JSON-LD `image`          | ✅ URL Cloudinary       |
| `galeria_imagenes_urls` | Galería e imágenes adicionales     | ✅ Array (o null)       |

En el front, las imágenes usan **alt** y **title** derivados del nombre del producto (o “Categoría X”, “Marca Y”), lo que es adecuado para accesibilidad y SEO de imagen.

### `seo_description` vs `descripcion_detallada`

**No son lo mismo:**

| Campo | Uso | Formato | Longitud |
|-------|-----|---------|----------|
| **`descripcion_detallada`** | Contenido visible en la ficha del producto (cuerpo de la página) | HTML (párrafos, listas, enlaces) | Sin límite práctico |
| **`seo_description`** | Meta description (`<meta name="description">`), Open Graph, Twitter, snippet en buscadores | Texto plano, sin HTML | ~150–160 caracteres |

El endpoint trae `descripcion_detallada` en HTML; **está bien** para el contenido de la página. Para la meta description los buscadores esperan un **texto corto y legible**. Opciones:

1. **Columna `seo_description` en BD** (recomendado): Texto redactado a mano o generado (≈155 caracteres). El API la expone y el front la usa en `<meta name="description">`. Control total del snippet.
2. **Fallback sin columna nueva:** En el front (o en un middleware), quitar el HTML de `descripcion_detallada` (strip tags), recortar a ~155 caracteres y usar ese valor como meta description. Funciona pero el snippet puede quedar menos pulido (frases cortadas, etc.).

Si el API no envía `seo_description`, el front ya puede usar un fallback (p. ej. `cleanSeoDescription` a partir de `descripcion_detallada` o del nombre).

### `structured_data` (JSON-LD)

**Qué es:** Datos estructurados en formato [Schema.org](https://schema.org/) (normalmente JSON-LD) que los buscadores usan para **rich results** (precio, disponibilidad, valoraciones, etc. en el resultado de búsqueda).

**Cómo generarlo:**

- **En el front (recomendado):** A partir del objeto `product` que ya tienes (nombre, imagen, precio, disponibilidad, URL). El front puede tener una función tipo `generateProductJsonLd(product)` que devuelva el script JSON-LD e inyectarlo en `<script type="application/ld+json">`. No hace falta guardar nada en BD.
- **En el backend:** Rellenar una columna `structured_data` (JSON) en BD con el mismo objeto y que el API lo devuelva; el front solo lo incluye en la página. Útil si quieres que el contenido del schema lo mantenga el backend.

No es obligatorio para un buen posicionamiento; es una mejora opcional para rich snippets.

### Recomendaciones opcionales (BD / API)

1. **`seo_description`**  
   Si la BD tiene el campo, que el API lo incluya y el front lo use en `<meta name="description">` y en Open Graph/Twitter. Si no existe, usar fallback desde `descripcion_detallada` (texto sin HTML, truncado a ~155 caracteres) o valorar añadir la columna.

2. **`structured_data`**  
   Puede generarse en el front a partir del producto (p. ej. `generateProductJsonLd`). Opcional guardarlo en BD; no es necesario para que funcione.

3. **Títulos cortados**  
   Algún producto tiene `seo_title` truncado (ej. “Prensa hidráulica manual integral para terminales eléctrico”). Revisar longitud en BD (≈50–60 caracteres recomendado) para que no se corte en resultados de búsqueda.

### Imágenes y SEO

- **Alt/title:** Todas las `<Image>` e `<img>` del proyecto tienen `alt` y, donde aplica, `title` (nombre del producto, categoría o marca). Es suficiente para metadata y accesibilidad.
- **URLs:** Al ser URLs fijas de Cloudinary, son indexables y estables; no hace falta cambio en el front para “links correctos” de imágenes.

---

## 3. Sitemap y páginas de marca

- **Sitemap:** El sitemap (`app/sitemap.ts`) se regenera automáticamente (revalidate 3600 s). Incluye:
  - Páginas estáticas (inicio, catálogo, contacto, nosotros).
  - Categorías y combinaciones categoría/subcategoría/marca.
  - **Páginas de marca** (`/[locale]/marca/[slug]`): se generan a partir de `getMarcas()`; cada marca tiene una entrada con su slug normalizado. No hace falta “volver a subir” nada: al desplegar, el sitemap se genera con las marcas actuales.
- **SEO de marcas:** Tener URLs dedicadas por marca (`/es/marca/mitutoyo`, etc.) y mostrarlas en el árbol de categorías (sección “Marcas”) mejora el SEO porque:
  - Los buscadores indexan páginas de colección por marca (más palabras clave y contenido estructurado).
  - El sitemap incluye esas URLs, lo que facilita el rastreo.
  - Cada página de marca tiene título, descripción y breadcrumbs propios (JSON-LD y meta tags).

---

## 4. Resumen

| Tema              | Conclusión                                                                 |
|-------------------|----------------------------------------------------------------------------|
| Links Cloudinary  | Correctos en categorías, marcas y productos; front ya los soporta.          |
| SEO de productos  | Campos actuales (title, slug, canonical, robots, keywords, nombre, imagen) son suficientes para un buen posicionamiento. |
| SEO de imágenes   | Alt/title implementados; URLs Cloudinary adecuadas.                        |
| Sitemap           | Incluye estáticas, categorías, categoría/subcategoria/marca y **páginas de marca** (`/marca/[slug]`); se regenera solo. |
| Mejoras opcionales | Añadir/usar `seo_description`, revisar longitud de `seo_title`, considerar `structured_data` o JSON-LD generado en front. |

Con la migración a Cloudinary y los datos de SEO que ya expone el API, la base para un buen posicionamiento está cubierta; las mejoras anteriores son opcionales y graduales.
