# 🔍 Guía para Verificar JSON-LD con Google

## 🎯 Herramientas Oficiales de Google

### 1. **Google Rich Results Test** (RECOMENDADO)
**URL:** https://search.google.com/test/rich-results

**Pasos:**
1. Ingresa la URL completa de un producto
   - Ejemplo: `http://localhost:3001/es/producto/herramientas-maniobra/bahco/gato-hidraulico-tipo-carretilla-3-toneladas-bahco-bh-13000`
2. O pega el HTML completo de la página
3. Haz clic en "Probar URL"

**Resultado esperado:**
- ✅ **Product** schema detectado
- ✅ **BreadcrumbList** schema detectado
- ✅ Vista previa de cómo aparecería en Google
- ✅ Sin errores críticos

**Qué verificar:**
- [ ] El schema Product está presente
- [ ] El schema BreadcrumbList está presente
- [ ] Todos los campos requeridos están presentes (name, image, offers, etc.)
- [ ] No hay errores de validación
- [ ] La vista previa muestra el producto correctamente

---

### 2. **Schema.org Validator**
**URL:** https://validator.schema.org/

**Pasos:**
1. Ingresa la URL o pega el HTML
2. Haz clic en "Run Test"

**Resultado esperado:**
- ✅ Schema válido
- ✅ Todos los campos requeridos presentes
- ✅ Sin errores de sintaxis

---

## 🔧 Verificación Manual en el Navegador

### Método 1: Ver Código Fuente

1. Abre la página del producto en el navegador
2. Clic derecho → **"Ver código fuente de la página"** (Ctrl+U / Cmd+U)
3. Busca: `<script type="application/ld+json">`
4. Deberías ver **dos bloques JSON-LD**:
   - **BreadcrumbList** (para navegación)
   - **Product** (para el producto)

**Ejemplo de lo que deberías ver:**
```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[...]}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Product","name":"...","image":"...","offers":{...}}
</script>
```

### Método 2: Consola del Navegador

1. Abre DevTools (F12)
2. Ve a la pestaña **Console**
3. Ejecuta este código:

```javascript
// Buscar todos los scripts JSON-LD
const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
console.log(`✅ Encontrados ${jsonLdScripts.length} scripts JSON-LD`);

jsonLdScripts.forEach((script, index) => {
  try {
    const data = JSON.parse(script.textContent);
    console.log(`\n📋 Script ${index + 1}:`, {
      type: data['@type'],
      context: data['@context'],
      data: data
    });
  } catch(e) {
    console.error(`❌ Error en script ${index + 1}:`, e);
  }
});

// Verificar específicamente el schema Product
const productSchema = Array.from(jsonLdScripts).find(script => {
  try {
    const data = JSON.parse(script.textContent);
    return data['@type'] === 'Product';
  } catch(e) {
    return false;
  }
});

if (productSchema) {
  const product = JSON.parse(productSchema.textContent);
  console.log('\n🛍️ Schema Product encontrado:', {
    name: product.name,
    sku: product.sku,
    brand: product.brand?.name,
    price: product.offers?.price,
    currency: product.offers?.priceCurrency,
    availability: product.offers?.availability
  });
} else {
  console.error('❌ No se encontró schema Product');
}
```

---

## 📊 Verificación con Herramientas de Desarrollo

### Chrome DevTools

1. Abre DevTools (F12)
2. Ve a **Elements** (Elementos)
3. Busca en el `<head>` o `<body>`:
   - `<script type="application/ld+json">`
4. Expande el script y verifica el contenido JSON

### Extensiones Útiles

**Schema.org Structured Data Sniffer**
- Chrome: https://chrome.google.com/webstore/detail/schemaorg-structured-dat/bfmdlcnjcmjfnjdnjdnjdnjdnjdnjdnj
- Muestra visualmente todos los schemas en la página

**Structured Data Testing Tool**
- Muestra los datos estructurados de forma visual

---

## 🌐 Verificación en Producción

### Google Search Console

1. Ve a: https://search.google.com/search-console
2. Selecciona tu propiedad (tienda.inxora.com)
3. Ve a **"Mejoras"** → **"Datos estructurados"**
4. Verifica:
   - ✅ **Product** schemas detectados
   - ✅ **BreadcrumbList** schemas detectados
   - ⚠️ Errores o advertencias (si los hay)

### Verificar en Google

1. Busca en Google: `site:tienda.inxora.com "nombre del producto"`
2. Si el producto aparece con:
   - Precio visible
   - Imagen destacada
   - Breadcrumbs
   - Estrella de valoración (si aplica)

   Entonces el JSON-LD está funcionando correctamente.

---

## ✅ Checklist de Verificación

### Schema Product
- [ ] `@context`: `https://schema.org`
- [ ] `@type`: `Product`
- [ ] `name`: Nombre del producto
- [ ] `image`: URL de imagen (absoluta)
- [ ] `description`: Descripción del producto
- [ ] `sku`: SKU del producto
- [ ] `brand`: Objeto Brand con nombre
- [ ] `offers`: Objeto Offer con:
  - [ ] `@type`: `Offer`
  - [ ] `price`: Precio (string)
  - [ ] `priceCurrency`: Código de moneda (PEN/USD)
  - [ ] `availability`: `https://schema.org/InStock` o `OutOfStock`
  - [ ] `url`: URL canónica
  - [ ] `seller`: Objeto Organization

### Schema BreadcrumbList
- [ ] `@context`: `https://schema.org`
- [ ] `@type`: `BreadcrumbList`
- [ ] `itemListElement`: Array con al menos:
  - [ ] Inicio
  - [ ] Categoría (si existe)
  - [ ] Producto

---

## 🐛 Solución de Problemas

### El JSON-LD no aparece en Google Rich Results Test

**Posibles causas:**
1. La URL no es accesible públicamente (localhost)
   - **Solución:** Usa la opción "Pegar HTML" en lugar de URL
2. El JSON tiene errores de sintaxis
   - **Solución:** Valida el JSON con un validador JSON
3. Faltan campos requeridos
   - **Solución:** Verifica que todos los campos requeridos estén presentes

### El JSON-LD aparece pero con errores

**Errores comunes:**
- `Missing required field`: Agrega el campo faltante
- `Invalid value`: Verifica que el valor sea del tipo correcto
- `Invalid URL`: Asegúrate de que las URLs sean absolutas

---

## 📝 Ejemplo de JSON-LD Esperado

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Gato Hidráulico Tipo Carretilla 3 Toneladas BAHCO BH13000",
  "image": "https://keeussaqlshdsegerqob.supabase.co/storage/v1/object/public/productos-images/...",
  "description": "Capacidad máxima de elevación: 3 toneladas (3000 kg)...",
  "sku": "INXHERR353",
  "brand": {
    "@type": "Brand",
    "name": "BAHCO"
  },
  "category": "HERRAMIENTAS MANIOBRA",
  "offers": {
    "@type": "Offer",
    "price": "1677.31",
    "priceCurrency": "PEN",
    "availability": "https://schema.org/InStock",
    "url": "https://tienda.inxora.com/es/producto/herramientas-maniobra/bahco/gato-hidraulico-tipo-carretilla-3-toneladas-bahco-bh-13000",
    "seller": {
      "@type": "Organization",
      "name": "INXORA",
      "url": "https://tienda.inxora.com"
    },
    "priceValidUntil": "2027-01-15"
  },
  "url": "https://tienda.inxora.com/es/producto/herramientas-maniobra/bahco/gato-hidraulico-tipo-carretilla-3-toneladas-bahco-bh-13000"
}
```

---

## 🚀 Próximos Pasos

Una vez verificado que el JSON-LD funciona:

1. **Monitorear en Google Search Console** - Revisa regularmente los datos estructurados
2. **Verificar en búsquedas reales** - Busca tus productos en Google
3. **Optimizar según feedback** - Ajusta según las recomendaciones de Google
