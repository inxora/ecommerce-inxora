# 🔧 Prompt para Corregir URLs Canónicas en Base de Datos

## 📚 Diferencia entre `seo_slug` y `canonical_url`

### `seo_slug` (Slug del Producto)
- **Qué es:** Identificador único del producto en formato URL-friendly
- **Formato:** Solo el nombre del producto sin rutas ni marcas
- **Ejemplo:** `tto-38-x-50-x-7-mm-reten-radial`
- **Uso:** Se usa para buscar el producto en la base de datos
- **Características:**
  - Es único por producto
  - No incluye información de marca o ruta completa
  - Se genera a partir del nombre del producto

### `canonical_url` (URL Canónica)
- **Qué es:** La URL completa y oficial que debe indexar Google
- **Formato:** Ruta completa incluyendo locale, marca y slug
- **Ejemplo:** `/es/producto/tto/tto-38-x-50-x-7-mm-reten-radial`
- **Uso:** Se usa en el tag `<link rel="canonical">` para SEO
- **Características:**
  - Incluye la estructura completa de la URL
  - Incluye el locale (es, en, pt)
  - Incluye el segmento de marca cuando existe
  - Es la URL "preferida" que Google debe indexar

### 📊 Comparación Visual

| Campo | Ejemplo | Propósito |
|-------|---------|-----------|
| `seo_slug` | `tto-38-x-50-x-7-mm-reten-radial` | Identificador único del producto |
| `canonical_url` | `/es/producto/tto/tto-38-x-50-x-7-mm-reten-radial` | URL completa para SEO |

---

## 🎯 Situación Actual vs Objetivo

### ❌ Estado Actual en Base de Datos
```sql
seo_slug: 'tto-38-x-50-x-7-mm-reten-radial'
canonical_url: '/productos/tto-38-x-50-x-7-mm-reten-radial'
```

**Problemas:**
- `canonical_url` usa `/productos` en lugar de `/producto`
- `canonical_url` no incluye el locale (`/es`)
- `canonical_url` no incluye el segmento de marca (`/tto`)
- No coincide con la estructura de URLs que usa el código

### ✅ Estado Objetivo
```sql
seo_slug: 'tto-38-x-50-x-7-mm-reten-radial'  (sin cambios)
canonical_url: '/es/producto/tto/tto-38-x-50-x-7-mm-reten-radial'
```

**Ventajas:**
- Coincide con la estructura de URLs del código
- Incluye locale para internacionalización
- Incluye marca para mejor SEO
- Estructura consistente y jerárquica

---

## 🔧 Query SQL para Corregir URLs

### Opción 1: Actualizar productos CON marca (Recomendado)

```sql
-- Actualizar canonical_url para productos que tienen marca asignada
UPDATE producto p
SET canonical_url = CONCAT(
  '/es/producto/',
  LOWER(REPLACE(REPLACE(REPLACE(m.nombre, ' ', '-'), 'á', 'a'), 'é', 'e')),
  '/',
  p.seo_slug
),
fecha_actualizacion = NOW()
FROM marca m
WHERE p.id_marca = m.id 
  AND p.activo = true
  AND p.visible_web = true
  AND m.activo = true
  AND (
    -- Actualizar solo si la URL actual es incorrecta
    p.canonical_url IS NULL 
    OR p.canonical_url NOT LIKE '/es/producto/%'
    OR p.canonical_url LIKE '/productos/%'
  );
```

### Opción 2: Actualizar productos SIN marca

```sql
-- Actualizar canonical_url para productos que NO tienen marca
UPDATE producto p
SET canonical_url = CONCAT('/es/producto/', p.seo_slug),
fecha_actualizacion = NOW()
WHERE p.id_marca IS NULL
  AND p.activo = true
  AND p.visible_web = true
  AND (
    p.canonical_url IS NULL 
    OR p.canonical_url NOT LIKE '/es/producto/%'
    OR p.canonical_url LIKE '/productos/%'
  );
```

### Opción 3: Query Completa (Ambos casos)

```sql
-- ============================================
-- CORRECCIÓN MASIVA DE canonical_url
-- ============================================
-- Este script actualiza todas las canonical_url
-- para que coincidan con la estructura actual del código

BEGIN;

-- 1. Actualizar productos CON marca
UPDATE producto p
SET canonical_url = CONCAT(
  '/es/producto/',
  LOWER(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(m.nombre, ' ', '-'),
            'á', 'a'), 'é', 'e'), 'í', 'i'), 
        'ó', 'o'), 'ú', 'u')
  ),
  '/',
  p.seo_slug
),
fecha_actualizacion = NOW()
FROM marca m
WHERE p.id_marca = m.id 
  AND p.activo = true
  AND p.visible_web = true
  AND m.activo = true
  AND (
    p.canonical_url IS NULL 
    OR p.canonical_url NOT LIKE '/es/producto/%'
    OR p.canonical_url LIKE '/productos/%'
  );

-- 2. Actualizar productos SIN marca
UPDATE producto p
SET canonical_url = CONCAT('/es/producto/', p.seo_slug),
fecha_actualizacion = NOW()
WHERE p.id_marca IS NULL
  AND p.activo = true
  AND p.visible_web = true
  AND (
    p.canonical_url IS NULL 
    OR p.canonical_url NOT LIKE '/es/producto/%'
    OR p.canonical_url LIKE '/productos/%'
  );

-- 3. Verificar resultados
SELECT 
  COUNT(*) as total_actualizados,
  COUNT(CASE WHEN canonical_url LIKE '/es/producto/%' THEN 1 END) as urls_correctas,
  COUNT(CASE WHEN canonical_url NOT LIKE '/es/producto/%' THEN 1 END) as urls_incorrectas
FROM producto
WHERE activo = true AND visible_web = true;

COMMIT;
```

---

## 📋 Query de Verificación (Antes de Ejecutar)

### Ver productos que se actualizarán

```sql
-- Ver productos CON marca que necesitan actualización
SELECT 
  p.sku,
  p.sku_producto,
  p.nombre,
  m.nombre as marca,
  p.seo_slug,
  p.canonical_url as url_actual,
  CONCAT(
    '/es/producto/',
    LOWER(REPLACE(m.nombre, ' ', '-')),
    '/',
    p.seo_slug
  ) as url_nueva
FROM producto p
JOIN marca m ON p.id_marca = m.id
WHERE p.activo = true
  AND p.visible_web = true
  AND m.activo = true
  AND (
    p.canonical_url IS NULL 
    OR p.canonical_url NOT LIKE '/es/producto/%'
    OR p.canonical_url LIKE '/productos/%'
  )
LIMIT 20;
```

### Ver productos SIN marca que necesitan actualización

```sql
-- Ver productos SIN marca que necesitan actualización
SELECT 
  p.sku,
  p.sku_producto,
  p.nombre,
  p.seo_slug,
  p.canonical_url as url_actual,
  CONCAT('/es/producto/', p.seo_slug) as url_nueva
FROM producto p
WHERE p.id_marca IS NULL
  AND p.activo = true
  AND p.visible_web = true
  AND (
    p.canonical_url IS NULL 
    OR p.canonical_url NOT LIKE '/es/producto/%'
    OR p.canonical_url LIKE '/productos/%'
  )
LIMIT 20;
```

---

## 🎯 Ejemplos de Transformación

### Ejemplo 1: Producto con Marca TTO

**Antes:**
```sql
seo_slug: 'tto-38-x-50-x-7-mm-reten-radial'
canonical_url: '/productos/tto-38-x-50-x-7-mm-reten-radial'
```

**Después:**
```sql
seo_slug: 'tto-38-x-50-x-7-mm-reten-radial'  (sin cambios)
canonical_url: '/es/producto/tto/tto-38-x-50-x-7-mm-reten-radial'
```

### Ejemplo 2: Producto con Marca WD-40

**Antes:**
```sql
seo_slug: 'lubricante-penetrante-wd-40'
canonical_url: '/productos/lubricante-penetrante-wd-40'
```

**Después:**
```sql
seo_slug: 'lubricante-penetrante-wd-40'  (sin cambios)
canonical_url: '/es/producto/wd-40/lubricante-penetrante-wd-40'
```

### Ejemplo 3: Producto sin Marca

**Antes:**
```sql
seo_slug: 'producto-generico-123'
canonical_url: '/productos/producto-generico-123'
```

**Después:**
```sql
seo_slug: 'producto-generico-123'  (sin cambios)
canonical_url: '/es/producto/producto-generico-123'
```

---

## ⚠️ Consideraciones Importantes

### 1. **Normalización de Nombres de Marca**
Si los nombres de marca tienen caracteres especiales o acentos, asegúrate de normalizarlos:

```sql
-- Ejemplo de normalización más completa
LOWER(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(m.nombre, ' ', '-'),
            'á', 'a'), 'é', 'e'), 'í', 'i'), 
        'ó', 'o'), 'ú', 'u'),
    'ñ', 'n')
)
```

### 2. **Backup Antes de Ejecutar**
```sql
-- Crear tabla de backup
CREATE TABLE producto_canonical_url_backup AS
SELECT sku, canonical_url, fecha_actualizacion
FROM producto
WHERE activo = true AND visible_web = true;
```

### 3. **Validación Post-Ejecución**
```sql
-- Verificar que todas las URLs siguen el patrón correcto
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN canonical_url LIKE '/es/producto/%' THEN 1 END) as correctas,
  COUNT(CASE WHEN canonical_url NOT LIKE '/es/producto/%' THEN 1 END) as incorrectas
FROM producto
WHERE activo = true AND visible_web = true;
```

---

## 🚀 Pasos Recomendados

1. **Ejecutar query de verificación** para ver qué se actualizará
2. **Crear backup** de las canonical_url actuales
3. **Ejecutar query de actualización** en modo transacción (BEGIN/COMMIT)
4. **Verificar resultados** con query de validación
5. **Probar en desarrollo** antes de aplicar en producción

---

## 📝 Notas Adicionales

- El `seo_slug` **NO debe cambiar**, solo se actualiza `canonical_url`
- La estructura de URL debe coincidir exactamente con la que usa el código
- Para otros locales (en, pt), se puede crear una query similar cambiando `/es/` por `/en/` o `/pt/`
- Si hay productos con marcas que tienen nombres muy largos o especiales, revisarlos manualmente

---

**Fecha de creación:** 2025-01-XX  
**Última actualización:** 2025-01-XX

