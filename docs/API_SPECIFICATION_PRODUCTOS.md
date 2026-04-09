# 📋 Especificación API - Endpoint de Productos para E-commerce

## Resumen Ejecutivo

Este documento define la especificación del endpoint de productos optimizado para un e-commerce de alto rendimiento con base de datos de gran escala.

---

## 🎯 Endpoint Principal

```
GET /api/test/productos/ecommerce
```

### Parámetros de Query (Query Params)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id_subcategoria` | `number` | No | **NUEVO** - Filtra por ID de subcategoría |
| `categoria_id` | `number` o `number[]` | No | Filtra por ID de categoría (legacy) |
| `id_marca` | `number` o `number[]` | No | Filtra por ID de marca |
| `search` | `string` | No | Búsqueda por nombre, SKU o slug |
| `activo` | `boolean` | No | Filtrar por estado activo |
| `visible_web` | `boolean` | No | Filtrar productos visibles en web |
| `precio_min` | `number` | No | Precio mínimo |
| `precio_max` | `number` | No | Precio máximo |
| `ordenar` | `string` | No | Campo de ordenamiento |
| `orden` | `asc` \| `desc` | No | Dirección del ordenamiento |
| `cursor` | `string` | No | **NUEVO** - Cursor para paginación (Base64) |
| `limit` | `number` | No | Límite de resultados (default: 24, max: 100) |
| `page` | `number` | No | Número de página (legacy, usar `cursor` preferentemente) |

---

## 🔧 Filtros Prioritarios a Implementar

### 1. `id_subcategoria` (CRÍTICO - Prioridad Alta)

```sql
-- Query SQL recomendado
SELECT p.* 
FROM producto p
WHERE p.id_subcategoria = :id_subcategoria
  AND p.visible_web = true
  AND p.activo = true
ORDER BY p.fecha_creacion DESC
LIMIT :limit;
```

**Uso en Frontend:**
```
GET /api/test/productos/ecommerce?id_subcategoria=12&limit=24
```

**Índice recomendado:**
```sql
CREATE INDEX idx_producto_subcategoria_web 
ON producto(id_subcategoria, visible_web, activo, fecha_creacion DESC);
```

---

### 2. `id_subcategoria` + `id_marca` (Combinado)

```sql
-- Query SQL recomendado
SELECT p.* 
FROM producto p
WHERE p.id_subcategoria = :id_subcategoria
  AND p.id_marca = :id_marca
  AND p.visible_web = true
  AND p.activo = true
ORDER BY p.fecha_creacion DESC
LIMIT :limit;
```

**Uso en Frontend:**
```
GET /api/test/productos/ecommerce?id_subcategoria=12&id_marca=5&limit=24
```

**Índice recomendado:**
```sql
CREATE INDEX idx_producto_subcat_marca_web 
ON producto(id_subcategoria, id_marca, visible_web, activo, fecha_creacion DESC);
```

---

### 3. `categoria_id` (Todos los productos de una categoría)

Cuando el usuario hace clic en una categoría, se deben mostrar todos los productos de **todas las subcategorías** de esa categoría.

```sql
-- Query SQL recomendado
SELECT p.* 
FROM producto p
JOIN subcategoria s ON p.id_subcategoria = s.id
WHERE s.categoria_id = :categoria_id
  AND p.visible_web = true
  AND p.activo = true
ORDER BY p.fecha_creacion DESC
LIMIT :limit;
```

**Uso en Frontend:**
```
GET /api/test/productos/ecommerce?categoria_id=3&limit=24
```

---

## 📊 Estructura de Respuesta

### Respuesta Actual (Mantener compatibilidad)

```json
{
  "success": true,
  "data": {
    "productos": [
      {
        "sku": 409,
        "nombre": "Pistola Neumática de Impacto 1\" BAHCO BP901",
        "cod_producto_marca": "BP901",
        "descripcion_corta": "...",
        "descripcion_detallada": "...",
        "categoria_id": 3,
        "id_marca": 15,
        "id_disponibilidad": 1,
        "id_unidad": 1,
        "activo": true,
        "visible_web": true,
        "imagen_principal_url": "...",
        "galeria_imagenes_urls": ["..."],
        "seo_slug": "pistola-neumatica-impacto-1-bahco-bp901",
        "unidad": { "id": 1, "nombre": "Unidad", "simbolo": "UND" },
        "categoria": { "id": 3, "nombre": "Herramientas y Equipos de Trabajo" },
        "subcategoria_principal": {
          "id": 12,
          "nombre": "Herramientas Neumáticas",
          "codigo": "HN",
          "categoria_id": 3,
          "categoria_nombre": "Herramientas y Equipos de Trabajo"
        },
        "marca": { "id": 15, "nombre": "BAHCO" },
        "proveedores": [...]
      }
    ],
    "total": 1520
  },
  "message": "Productos obtenidos correctamente",
  "metadata": {
    "limit": 24,
    "offset": 0,
    "count": 24,
    "total": 1520,
    "pages": 64,
    "current_page": 1,
    "has_more": true
  },
  "timestamp": "2026-01-22T10:30:00.000Z",
  "status_code": 200
}
```

### Respuesta Mejorada (Con Cursor - Opcional pero Recomendado)

```json
{
  "success": true,
  "data": {
    "productos": [...],
    "total": 1520,
    "pagination": {
      "cursor": {
        "next": "eyJpZCI6MTAwLCJmZWNoYSI6IjIwMjYtMDEtMjIifQ==",
        "prev": null
      },
      "has_more": true,
      "total_estimado": 1520
    },
    "filtros_aplicados": {
      "id_subcategoria": 12,
      "id_marca": null,
      "visible_web": true
    }
  },
  "metadata": {...},
  "timestamp": "...",
  "status_code": 200
}
```

---

## 🚀 Paginación Cursor-Based (Recomendado para BD Grande)

### ¿Por qué Cursor en lugar de Offset?

| Volumen de Datos | Offset (`LIMIT 24 OFFSET 50000`) | Cursor |
|------------------|----------------------------------|--------|
| 1,000 productos | ~5ms | ~2ms |
| 100,000 productos | ~500ms | ~2ms |
| 1,000,000 productos | ~5000ms ❌ | ~2ms ✅ |

### Implementación del Cursor

El cursor es un objeto JSON codificado en Base64 que contiene:

```json
{
  "id": 1234,           // Último ID visto
  "fecha": "2026-01-22" // Última fecha vista (si ordena por fecha)
}
```

**Query SQL con Cursor:**
```sql
-- Decodificar cursor: {"id": 1234, "fecha": "2026-01-22"}
SELECT p.* 
FROM producto p
WHERE p.id_subcategoria = :id_subcategoria
  AND p.visible_web = true
  AND (
    p.fecha_creacion < :cursor_fecha 
    OR (p.fecha_creacion = :cursor_fecha AND p.sku < :cursor_id)
  )
ORDER BY p.fecha_creacion DESC, p.sku DESC
LIMIT :limit;
```

**Generar nuevo cursor:**
```javascript
const lastProduct = productos[productos.length - 1]
const nextCursor = btoa(JSON.stringify({
  id: lastProduct.sku,
  fecha: lastProduct.fecha_creacion
}))
```

---

## 📐 Índices de Base de Datos Recomendados

```sql
-- Índice principal para filtro por subcategoría (MÁS USADO)
CREATE INDEX idx_producto_subcategoria_fecha 
ON producto(id_subcategoria, visible_web, activo, fecha_creacion DESC, sku DESC);

-- Índice para filtro por subcategoría + marca
CREATE INDEX idx_producto_subcat_marca 
ON producto(id_subcategoria, id_marca, visible_web, activo, fecha_creacion DESC);

-- Índice para filtro por categoría (a través de subcategoría)
CREATE INDEX idx_subcategoria_categoria 
ON subcategoria(categoria_id, activo);

-- Índice para búsqueda por texto (si no usan full-text search)
CREATE INDEX idx_producto_nombre_trgm 
ON producto USING gin(nombre gin_trgm_ops);

-- Índice para filtro por precio
CREATE INDEX idx_producto_precio 
ON producto(id_subcategoria, visible_web) 
INCLUDE (sku, nombre, imagen_principal_url);
```

---

## 🔄 Ordenamiento

| Valor de `ordenar` | Descripción | Query |
|--------------------|-------------|-------|
| `relevancia` | Por relevancia de búsqueda (default) | Score de búsqueda |
| `precio_asc` | Precio menor a mayor | `ORDER BY precio_venta ASC` |
| `precio_desc` | Precio mayor a menor | `ORDER BY precio_venta DESC` |
| `nuevo` | Más recientes primero | `ORDER BY fecha_creacion DESC` |
| `mas_vistos` | Más visualizaciones primero (para Productos Destacados) | `ORDER BY visualizaciones DESC` (o equivalente) |
| `nombre_asc` | Alfabético A-Z | `ORDER BY nombre ASC` |
| `nombre_desc` | Alfabético Z-A | `ORDER BY nombre DESC` |

---

## 📝 Ejemplos de Uso en Frontend

### 1. Página de Categoría
```javascript
// Usuario hace clic en "Herramientas y Equipos de Trabajo"
GET /api/test/productos/ecommerce?categoria_id=3&limit=24&ordenar=nuevo
```

### 2. Página de Subcategoría
```javascript
// Usuario hace clic en "Herramientas Neumáticas"
GET /api/test/productos/ecommerce?id_subcategoria=12&limit=24
```

### 3. Página de Subcategoría + Marca
```javascript
// Usuario filtra por marca "BAHCO" dentro de "Herramientas Neumáticas"
GET /api/test/productos/ecommerce?id_subcategoria=12&id_marca=15&limit=24
```

### 4. Scroll Infinito (Con Cursor)
```javascript
// Primera página
GET /api/test/productos/ecommerce?id_subcategoria=12&limit=24

// Segunda página (con cursor de la respuesta anterior)
GET /api/test/productos/ecommerce?id_subcategoria=12&limit=24&cursor=eyJpZCI6MTAwfQ==
```

---

## ⚡ Prioridades de Implementación

| Prioridad | Feature | Impacto |
|-----------|---------|---------|
| 🔴 **P0** | Filtro `id_subcategoria` | Crítico - Sin esto las páginas de subcategoría no funcionan |
| 🔴 **P0** | Filtro `categoria_id` (JOIN con subcategoría) | Crítico - Páginas de categoría |
| 🟠 **P1** | Combinación `id_subcategoria` + `id_marca` | Alto - Filtrado por marca |
| 🟡 **P2** | Ordenamiento (`ordenar` param) | Medio - UX mejorado |
| 🟢 **P3** | Paginación cursor-based | Para escalar a millones |
| 🟢 **P3** | Filtros de precio | Para futuro |

---

## 🧪 Testing

### Verificar que funcione el filtro por subcategoría:
```bash
curl "https://api.inxora.com/api/test/productos/ecommerce?id_subcategoria=12&limit=5"
```

### Verificar que funcione el filtro combinado:
```bash
curl "https://api.inxora.com/api/test/productos/ecommerce?id_subcategoria=12&id_marca=15&limit=5"
```

### Verificar que funcione el filtro por categoría:
```bash
curl "https://api.inxora.com/api/test/productos/ecommerce?categoria_id=3&limit=5"
```

---

## 📌 Notas Importantes

1. **Relación actual**: `producto → subcategoria_principal → categoria`
2. **El campo `categoria_id` en producto** puede estar vacío o no actualizado. Usar siempre `subcategoria_principal.categoria_id` como fuente de verdad.
3. **Índices compuestos** son esenciales para el rendimiento. Sin ellos, las queries serán lentas con volúmenes grandes.
4. **El cursor-based pagination** es opcional ahora pero será necesario cuando tengan más de 10,000 productos.

---

## ✅ Estado de Implementación

| Feature | Backend | Frontend | Estado |
|---------|---------|----------|--------|
| `seo_slug` (búsqueda O(1)) | ✅ Implementado | ✅ Implementado | 🟢 Listo |
| `id_subcategoria` | ✅ Implementado | ✅ Implementado | 🟢 Listo |
| `categoria_id` (JOIN subcategoría) | ✅ Implementado | ✅ Implementado | 🟢 Listo |
| `id_marca` | ✅ Implementado | ✅ Implementado | 🟢 Listo |
| `ordenar` | ✅ Implementado | ✅ Implementado | 🟢 Listo |
| `precio_min` / `precio_max` | ✅ Implementado | ✅ Implementado | 🟢 Listo |
| Cursor pagination | ✅ Implementado | 🔄 Pendiente | 🟡 Backend listo |

---

*Documento generado el 2026-01-22*
*Última actualización: 2026-01-22*
*Versión: 1.1*
