# 🔍 Guía para Verificar las Funciones de SEO

Esta guía te ayudará a verificar que todas las funciones de SEO están funcionando correctamente.

## 📋 Métodos de Verificación

### 1. **Script de Prueba Automático** ⚡

Ejecuta el script de prueba que simula un producto:

```bash
# Instalar tsx si no lo tienes
npm install -D tsx

# Ejecutar el script
npx tsx scripts/test-seo.ts
```

Este script te mostrará:
- ✅ Título SEO generado y su longitud
- ✅ Meta keywords con todas las palabras clave
- ✅ Descripción SEO optimizada
- ✅ URL canónica correcta
- ✅ JSON-LD Schema completo

---

### 2. **Verificar en el Navegador** 🌐

#### Opción A: Ver Código Fuente

1. Abre una página de producto en tu navegador (ej: `http://localhost:3000/es/producto/herramientas-maniobra/bahco/gato-hidraulico-tipo-carretilla-3-toneladas-bahco-bh-13000`)
2. Haz clic derecho → **"Ver código fuente de la página"** (o `Ctrl+U` / `Cmd+U`)
3. Busca en el `<head>`:
   - `<title>` - Debe tener formato: `[Nombre] | [Marca] | Inxora Perú`
   - `<meta name="description">` - No debe empezar con "✅ En INXORA..."
   - `<meta name="keywords">` - Debe incluir marca, categoría, SKU, etc.
   - `<link rel="canonical">` - Debe apuntar a `tienda.inxora.com` (NO `app.inxora.com` ni `api.inxora.com`)
   - `<script type="application/ld+json">` - Debe tener el schema de Product

#### Opción B: Herramientas de Desarrollo

1. Abre las **Herramientas de Desarrollador** (`F12`)
2. Ve a la pestaña **"Elements"** (o **"Elementos"**)
3. Expande el `<head>` y verifica los meta tags
4. Busca los scripts con `type="application/ld+json"` y verifica el contenido

#### Opción C: Extensiones del Navegador

Instala extensiones como:
- **SEO META in 1 CLICK** (Chrome)
- **Meta SEO Inspector** (Chrome/Firefox)

Estas extensiones te mostrarán todos los meta tags de forma visual.

---

### 3. **Verificar con Herramientas Online** 🛠️

#### Google Rich Results Test
1. Ve a: https://search.google.com/test/rich-results
2. Ingresa la URL de un producto
3. Verifica que detecte el JSON-LD de Product correctamente

#### Schema.org Validator
1. Ve a: https://validator.schema.org/
2. Ingresa la URL de un producto
3. Verifica que el schema sea válido

#### Open Graph Debugger (Facebook)
1. Ve a: https://developers.facebook.com/tools/debug/
2. Ingresa la URL de un producto
3. Verifica los meta tags de Open Graph

---

### 4. **Verificar en el Código (Logs)** 💻

Agrega logs temporales en `app/[locale]/producto/[...slug]/page.tsx`:

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const product = await getProduct(slug)

  if (!product) {
    return { /* ... */ }
  }

  const seoData = generateProductSeo(product, locale)
  
  // LOGS TEMPORALES PARA DEBUG
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 SEO DATA:', {
      title: seoData.seoTitle,
      description: seoData.seoDescription.substring(0, 100) + '...',
      keywords: seoData.seoKeywords.substring(0, 100) + '...',
      canonical: seoData.canonicalUrl,
    })
  }

  return {
    title: seoData.seoTitle,
    // ...
  }
}
```

Luego ejecuta el servidor de desarrollo y revisa la consola:

```bash
npm run dev
```

---

### 5. **Verificar con cURL** 🔧

Puedes obtener el HTML de una página y verificar los meta tags:

```bash
# Obtener el HTML
curl -s "http://localhost:3000/es/producto/herramientas-maniobra/bahco/gato-hidraulico-tipo-carretilla-3-toneladas-bahco-bh-13000" | grep -E "<title>|<meta name=\"(description|keywords)\"|<link rel=\"canonical\"" | head -5
```

---

## ✅ Checklist de Verificación

### Título SEO
- [ ] Formato: `[Nombre] | [Marca] | Inxora Perú`
- [ ] Máximo 60 caracteres
- [ ] Si es muy largo, acorta el nombre pero mantiene "| Inxora"
- [ ] Incluye la marca si existe

### Meta Keywords
- [ ] Incluye nombre de la marca
- [ ] Incluye categoría principal
- [ ] Incluye SKU o modelo
- [ ] Incluye palabras transaccionales: "precio", "venta", "Perú"
- [ ] Incluye "Inxora"
- [ ] Si hay stock: incluye "stock disponible"

### Meta Description
- [ ] NO empieza con "✅ En INXORA..."
- [ ] Empieza con "Compra [Producto]..." o nombre del producto
- [ ] Máximo 160 caracteres
- [ ] Incluye información de precio/disponibilidad
- [ ] Menciona "Inxora Perú"

### URL Canónica
- [ ] Usa dominio: `tienda.inxora.com` (NO `app.inxora.com` ni `api.inxora.com`)
- [ ] Formato: `/{locale}/producto/{categoria}/{marca}/{slug}`
- [ ] Todos los segmentos en minúsculas
- [ ] Sin espacios ni caracteres especiales

### JSON-LD Schema
- [ ] Tipo: `Product`
- [ ] Incluye `name`, `image`, `description`
- [ ] Incluye `brand` con nombre de marca
- [ ] Incluye `sku`
- [ ] Incluye `offers` con precio y moneda
- [ ] `availability` es `InStock` si `id_disponibilidad === 1`
- [ ] Incluye `category`

---

## 🐛 Solución de Problemas

### El título no se genera correctamente
- Verifica que el producto tenga `nombre` y `marca`
- Revisa los logs de la consola

### Las keywords están vacías
- Verifica que el producto tenga `categorias` y `marca`
- Revisa que `sku_producto` exista

### La descripción sigue empezando con "✅ En INXORA..."
- Verifica que la función `cleanSeoDescription` se esté llamando
- Revisa que el producto tenga `seo_description`

### La URL canónica apunta a `app.inxora.com` o `api.inxora.com`
- Verifica que NO estés usando `product.canonical_url` directamente
- Asegúrate de usar `generateCanonicalUrl()`

---

## 📝 Ejemplo de Resultado Esperado

Para el producto "Gato Hidráulico Tipo Carretilla 3 Toneladas BAHCO BH13000":

**Título:**
```html
<title>Gato Hidráulico Tipo Carretilla 3 Toneladas | BAHCO | Inxora Perú</title>
```

**Keywords:**
```html
<meta name="keywords" content="bahco, herramientas maniobra, inxherr353, bh13000, gato, hidráulico, tipo, carretilla, precio, venta, perú, inxora, herramientas profesionales, stock disponible, envío inmediato">
```

**Description:**
```html
<meta name="description" content="Compra Gato Hidráulico Tipo Carretilla 3 Toneladas BAHCO BH13000 al mejor precio en Inxora Perú. Contamos con stock inmediato y envíos a todo el país.">
```

**Canonical:**
```html
<link rel="canonical" href="https://tienda.inxora.com/es/producto/herramientas-maniobra/bahco/gato-hidraulico-tipo-carretilla-3-toneladas-bahco-bh-13000">
```

---

## 🚀 Próximos Pasos

Una vez verificado que todo funciona:

1. **Probar con múltiples productos** - Verifica que funcione con diferentes categorías y marcas
2. **Verificar en producción** - Despliega y prueba en el entorno real
3. **Monitorear en Google Search Console** - Verifica que Google esté indexando correctamente
4. **Validar con herramientas SEO** - Usa herramientas como Screaming Frog o Ahrefs
