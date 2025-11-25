# 📊 Recomendaciones SEO para URLs de Productos

## 🎯 Resumen Ejecutivo

**Mejor estructura de URL para SEO:** `/es/producto/[marca]/[slug-producto]`

**Ejemplo:** `/es/producto/tto/tto-38-x-50-x-7-mm-reten-radial`

---

## ✅ ¿Por qué la URL con marca es mejor para SEO?

### 1. **Mayor Descriptividad**
- Las URLs con marca proporcionan contexto adicional tanto a los motores de búsqueda como a los usuarios
- Facilita la comprensión del contenido de la página antes de hacer clic
- Mejora la relevancia en búsquedas relacionadas con la marca

### 2. **Jerarquía Clara**
- Estructura más organizada: `/producto/[marca]/[producto]`
- Facilita la navegación y comprensión del sitio
- Mejor para la arquitectura de información

### 3. **SEO de Marca**
- Fortalece la asociación entre productos y marcas
- Mejora el posicionamiento en búsquedas de marca + producto
- Beneficia el reconocimiento de marca

### 4. **Experiencia de Usuario**
- URLs más intuitivas y fáciles de recordar
- Los usuarios pueden identificar rápidamente la marca del producto
- Mejor para compartir en redes sociales

---

## 📋 Configuración Actual vs Recomendada

### ❌ Configuración Actual en Base de Datos
```sql
canonical_url: '/productos/tto-38-x-50-x-7-mm-reten-radial'
```
**Problemas:**
- No incluye el segmento de marca
- Usa `/productos` en lugar de `/producto`
- No coincide con la estructura de URLs que se está usando en el código

### ✅ Configuración Recomendada
```sql
canonical_url: '/es/producto/tto/tto-38-x-50-x-7-mm-reten-radial'
```
**Ventajas:**
- Incluye el segmento de marca
- Coincide con la estructura de URLs del código
- Incluye el locale para internacionalización

---

## 🔧 Implementación Recomendada

### 1. **Actualizar canonical_url en Base de Datos**

Para cada producto, actualizar el `canonical_url` usando esta fórmula:

```sql
UPDATE producto 
SET canonical_url = CONCAT(
  '/es/producto/',
  LOWER(REPLACE(m.nombre, ' ', '-')),
  '/',
  seo_slug
)
FROM marca m
WHERE producto.id_marca = m.id 
  AND producto.canonical_url IS NOT NULL;
```

### 2. **Estructura de URL Canónica**

La URL canónica debe seguir este patrón:
```
/{locale}/producto/{marca-slug}/{producto-slug}
```

Donde:
- `{locale}`: código de idioma (es, en, pt)
- `{marca-slug}`: nombre de la marca en formato slug (minúsculas, guiones)
- `{producto-slug}`: slug del producto desde `seo_slug`

### 3. **Manejo de Productos sin Marca**

Si un producto no tiene marca asignada, usar:
```
/{locale}/producto/{producto-slug}
```

---

## 🚀 Beneficios de la Implementación

1. **Mejor Indexación:** Los motores de búsqueda entenderán mejor la estructura del sitio
2. **Evitar Contenido Duplicado:** El canonical URL asegura que solo una versión se indexe
3. **Mejor CTR:** URLs más descriptivas mejoran el click-through rate en resultados de búsqueda
4. **Consistencia:** Todas las URLs siguen el mismo patrón, facilitando el mantenimiento

---

## 📝 Notas Técnicas

### Código Actual
El código ya está configurado para usar la estructura con marca:
- `components/catalog/product-card.tsx`: Construye URLs con marca
- `app/[locale]/page.tsx`: Construye URLs con marca para productos destacados
- `app/[locale]/producto/[...slug]/page.tsx`: Maneja ambas estructuras (con y sin marca)

### Próximos Pasos
1. ✅ Actualizar código para usar estructura con marca (COMPLETADO)
2. ⏳ Actualizar `canonical_url` en base de datos
3. ⏳ Implementar redirecciones 301 para URLs antiguas (si existen)
4. ⏳ Verificar que los meta tags se generen correctamente

---

## 🔍 Referencias

- [Google: Diseño de estructura de URL para sitios de comercio electrónico](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites)
- [Google: URLs canónicas](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

---

**Última actualización:** 2025-01-XX
**Estado:** Recomendaciones implementadas en código, pendiente actualización de BD

