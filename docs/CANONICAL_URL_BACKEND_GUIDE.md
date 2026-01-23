# Guía de Implementación: Generación de canonical_url

## Resumen

Este documento describe cómo implementar la generación automática del campo `canonical_url` en los Stored Procedures (SP) de creación y actualización de productos.

**Fecha:** Enero 2026  
**Versión:** 1.0  
**Autor:** Equipo Desarrollo INXORA

---

## 1. Estructura de URL Canónica

### Formato

```
https://tienda.inxora.com/{locale}/{categoria}/{subcategoria}/{marca}/{seo_slug}
```

### Componentes

| Componente | Descripción | Ejemplo |
|------------|-------------|---------|
| Base URL | Dominio del ecommerce | `https://tienda.inxora.com` |
| Locale | Idioma (es, en, pt) | `es` |
| Categoría | Slug normalizado de la categoría | `herramientas-y-equipos-de-trabajo` |
| Subcategoría | Slug normalizado de la subcategoría | `herramientas-electricas` |
| Marca | Slug normalizado de la marca | `makita` |
| SEO Slug | Slug único del producto | `taladro-percutor-inalambrico-40-v-xgt-makita-hp-001-gz` |

### Ejemplo Completo

```
https://tienda.inxora.com/es/herramientas-y-equipos-de-trabajo/herramientas-electricas/makita/taladro-percutor-inalambrico-40-v-xgt-makita-hp-001-gz
```

---

## 2. Funciones SQL Requeridas

### 2.1 Función de Normalización de Texto

Esta función convierte cualquier texto a un formato URL-friendly (slug).

```sql
-- Función para normalizar texto (quitar acentos, espacios, caracteres especiales)
CREATE OR REPLACE FUNCTION normalize_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    IF input_text IS NULL OR input_text = '' THEN
        RETURN NULL;
    END IF;
    
    RETURN LOWER(
        -- Eliminar guiones al inicio y final
        TRIM(BOTH '-' FROM
            -- Reemplazar guiones dobles por simples
            REGEXP_REPLACE(
                -- Eliminar caracteres no permitidos
                REGEXP_REPLACE(
                    -- Reemplazar espacios por guiones
                    REPLACE(
                        -- Quitar acentos
                        TRANSLATE(
                            TRIM(input_text), 
                            'ÁÉÍÓÚáéíóúÑñÜüÀÈÌÒÙàèìòùÂÊÎÔÛâêîôûÄËÏÖÜäëïöü×', 
                            'AEIOUaeiouNnUuAEIOUaeiouAEIOUaeiouAEIOUaeioux'
                        ), 
                        ' ', '-'
                    ),
                    '[^a-zA-Z0-9-]', '', 'g'
                ),
                '-+', '-', 'g'
            )
        )
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### 2.2 Función de Generación de canonical_url

```sql
-- Función para generar canonical_url completo
CREATE OR REPLACE FUNCTION generate_canonical_url(
    p_seo_slug TEXT,
    p_categoria_nombre TEXT,
    p_subcategoria_nombre TEXT,
    p_marca_nombre TEXT,
    p_locale TEXT DEFAULT 'es'
)
RETURNS TEXT AS $$
DECLARE
    v_base_url TEXT := 'https://tienda.inxora.com';
    v_categoria_slug TEXT;
    v_subcategoria_slug TEXT;
    v_marca_slug TEXT;
BEGIN
    -- Validar que todos los componentes existan
    IF p_seo_slug IS NULL OR p_seo_slug = '' THEN
        RAISE EXCEPTION 'seo_slug es requerido para generar canonical_url';
    END IF;
    
    IF p_categoria_nombre IS NULL OR p_categoria_nombre = '' THEN
        RAISE EXCEPTION 'categoria_nombre es requerido para generar canonical_url';
    END IF;
    
    IF p_subcategoria_nombre IS NULL OR p_subcategoria_nombre = '' THEN
        RAISE EXCEPTION 'subcategoria_nombre es requerido para generar canonical_url';
    END IF;
    
    IF p_marca_nombre IS NULL OR p_marca_nombre = '' THEN
        RAISE EXCEPTION 'marca_nombre es requerido para generar canonical_url';
    END IF;
    
    -- Normalizar cada componente
    v_categoria_slug := normalize_slug(p_categoria_nombre);
    v_subcategoria_slug := normalize_slug(p_subcategoria_nombre);
    v_marca_slug := normalize_slug(p_marca_nombre);
    
    -- Construir y retornar URL canónica
    -- Estructura: /{locale}/{categoria}/{subcategoria}/{marca}/{slug}
    RETURN v_base_url || '/' || p_locale || '/' || 
           v_categoria_slug || '/' || 
           v_subcategoria_slug || '/' || 
           v_marca_slug || '/' || 
           p_seo_slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

---

## 3. Integración en SP de Crear Producto (POST)

### Lógica a Implementar

Dentro del Stored Procedure de creación de producto, agregar la siguiente lógica **antes del INSERT**:

```sql
-- ============================================
-- GENERACIÓN DE SEO_SLUG Y CANONICAL_URL
-- ============================================

DECLARE
    v_categoria_nombre TEXT;
    v_subcategoria_nombre TEXT;
    v_marca_nombre TEXT;
    v_canonical_url TEXT;
    v_seo_slug TEXT;

-- 1. Obtener nombre de la categoría (a través de la subcategoría)
SELECT c.nombre INTO v_categoria_nombre
FROM categoria c
JOIN sub_categoria s ON s.categoria_id = c.id
WHERE s.id = p_id_subcategoria_principal;

-- 2. Obtener nombre de la subcategoría
SELECT nombre INTO v_subcategoria_nombre
FROM sub_categoria
WHERE id = p_id_subcategoria_principal;

-- 3. Obtener nombre de la marca
SELECT nombre INTO v_marca_nombre
FROM marca
WHERE id = p_id_marca;

-- 4. Generar seo_slug si no viene proporcionado
IF p_seo_slug IS NULL OR TRIM(p_seo_slug) = '' THEN
    -- Normalizar nombre del producto
    v_seo_slug := normalize_slug(p_nombre_producto);
    
    -- Agregar marca al final si no está incluida
    IF v_marca_nombre IS NOT NULL AND 
       v_seo_slug NOT LIKE '%' || normalize_slug(v_marca_nombre) THEN
        v_seo_slug := v_seo_slug || '-' || normalize_slug(v_marca_nombre);
    END IF;
ELSE
    -- Usar el seo_slug proporcionado (ya debe venir normalizado)
    v_seo_slug := normalize_slug(p_seo_slug);
END IF;

-- 5. Generar canonical_url
v_canonical_url := generate_canonical_url(
    v_seo_slug,
    v_categoria_nombre,
    v_subcategoria_nombre,
    v_marca_nombre,
    'es'  -- locale por defecto
);

-- 6. INSERT del producto incluyendo seo_slug y canonical_url
INSERT INTO producto (
    nombre,
    seo_slug,
    canonical_url,
    id_marca,
    -- ... otros campos
)
VALUES (
    p_nombre_producto,
    v_seo_slug,
    v_canonical_url,
    p_id_marca,
    -- ... otros valores
)
RETURNING sku INTO v_nuevo_sku;
```

---

## 4. Integración en SP de Actualizar Producto (PUT)

### Lógica a Implementar

Solo regenerar `canonical_url` si cambian campos que afectan la URL:

```sql
-- ============================================
-- REGENERACIÓN DE CANONICAL_URL (SI APLICA)
-- ============================================

DECLARE
    v_regenerar_url BOOLEAN := FALSE;
    v_nombre_actual TEXT;
    v_subcategoria_actual INTEGER;
    v_marca_actual INTEGER;
    v_seo_slug_actual TEXT;
    v_categoria_nombre TEXT;
    v_subcategoria_nombre TEXT;
    v_marca_nombre TEXT;
    v_canonical_url TEXT;
    v_seo_slug TEXT;

-- 1. Obtener valores actuales del producto
SELECT nombre, id_subcategoria_principal, id_marca, seo_slug
INTO v_nombre_actual, v_subcategoria_actual, v_marca_actual, v_seo_slug_actual
FROM producto
WHERE sku = p_sku;

-- 2. Verificar si hay cambios que afectan la URL
IF (p_nombre_producto IS NOT NULL AND p_nombre_producto != v_nombre_actual) OR
   (p_id_subcategoria_principal IS NOT NULL AND p_id_subcategoria_principal != v_subcategoria_actual) OR
   (p_id_marca IS NOT NULL AND p_id_marca != v_marca_actual) OR
   (p_seo_slug IS NOT NULL AND p_seo_slug != v_seo_slug_actual) THEN
    v_regenerar_url := TRUE;
END IF;

-- 3. Regenerar URL si es necesario
IF v_regenerar_url THEN
    -- Obtener nombres actualizados
    SELECT c.nombre INTO v_categoria_nombre
    FROM categoria c
    JOIN sub_categoria s ON s.categoria_id = c.id
    WHERE s.id = COALESCE(p_id_subcategoria_principal, v_subcategoria_actual);

    SELECT nombre INTO v_subcategoria_nombre
    FROM sub_categoria
    WHERE id = COALESCE(p_id_subcategoria_principal, v_subcategoria_actual);

    SELECT nombre INTO v_marca_nombre
    FROM marca
    WHERE id = COALESCE(p_id_marca, v_marca_actual);

    -- Determinar seo_slug a usar
    IF p_seo_slug IS NOT NULL THEN
        v_seo_slug := normalize_slug(p_seo_slug);
    ELSIF p_nombre_producto IS NOT NULL AND p_nombre_producto != v_nombre_actual THEN
        -- Regenerar slug si cambió el nombre
        v_seo_slug := normalize_slug(p_nombre_producto);
        IF v_marca_nombre IS NOT NULL THEN
            v_seo_slug := v_seo_slug || '-' || normalize_slug(v_marca_nombre);
        END IF;
    ELSE
        v_seo_slug := v_seo_slug_actual;
    END IF;

    -- Generar nuevo canonical_url
    v_canonical_url := generate_canonical_url(
        v_seo_slug,
        v_categoria_nombre,
        v_subcategoria_nombre,
        v_marca_nombre,
        'es'
    );

    -- Actualizar producto con nuevos valores
    UPDATE producto
    SET seo_slug = v_seo_slug,
        canonical_url = v_canonical_url,
        nombre = COALESCE(p_nombre_producto, nombre),
        id_marca = COALESCE(p_id_marca, id_marca),
        -- ... otros campos
        fecha_actualizacion = NOW()
    WHERE sku = p_sku;
ELSE
    -- Actualizar sin regenerar URL
    UPDATE producto
    SET nombre = COALESCE(p_nombre_producto, nombre),
        id_marca = COALESCE(p_id_marca, id_marca),
        -- ... otros campos
        fecha_actualizacion = NOW()
    WHERE sku = p_sku;
END IF;
```

---

## 5. Reglas de Normalización

### Transformaciones Aplicadas

1. **Convertir a minúsculas**: `LOWER()`
2. **Quitar acentos**: 
   - á, à, ä, â → a
   - é, è, ë, ê → e
   - í, ì, ï, î → i
   - ó, ò, ö, ô → o
   - ú, ù, ü, û → u
   - ñ → n
3. **Espacios a guiones**: ` ` → `-`
4. **Eliminar caracteres especiales**: Solo permitir `a-z`, `0-9`, `-`
5. **Evitar guiones dobles**: `--` → `-`
6. **Eliminar guiones al inicio/final**

### Ejemplos de Normalización

| Entrada | Salida |
|---------|--------|
| `Herramientas Eléctricas` | `herramientas-electricas` |
| `MAKITA Power Tools` | `makita-power-tools` |
| `Taladro 40V XGT (Brushless)` | `taladro-40v-xgt-brushless` |
| `Válvula 3/4" PVC` | `valvula-34-pvc` |

---

## 6. Validaciones Importantes

### Antes de Generar canonical_url

- [ ] `seo_slug` no es NULL ni vacío
- [ ] `categoria_nombre` no es NULL ni vacío
- [ ] `subcategoria_nombre` no es NULL ni vacío
- [ ] `marca_nombre` no es NULL ni vacío

### Unicidad

- El `seo_slug` **debe ser único** por producto
- Si ya existe un producto con el mismo `seo_slug`, agregar un sufijo numérico:
  - `taladro-makita-hp-001` → `taladro-makita-hp-001-2`

### Manejo de Errores

```sql
-- Ejemplo de manejo de errores
BEGIN
    v_canonical_url := generate_canonical_url(...);
EXCEPTION
    WHEN OTHERS THEN
        -- Registrar error pero no fallar la operación completa
        RAISE WARNING 'No se pudo generar canonical_url: %', SQLERRM;
        v_canonical_url := NULL;
END;
```

---

## 7. Consideraciones de Rendimiento

### Por qué en el SP (no en el endpoint)

| Aspecto | En SP | En Endpoint |
|---------|-------|-------------|
| **Rendimiento** | Óptimo (todo en BD) | Requiere queries adicionales |
| **Atomicidad** | Garantizada | Manual |
| **Consistencia** | 100% | Riesgo en múltiples entradas |
| **Latencia** | Mínima | Mayor |

### Índices Recomendados

```sql
-- Índice para búsqueda por seo_slug
CREATE INDEX IF NOT EXISTS idx_producto_seo_slug 
ON producto(seo_slug);

-- Índice para verificar unicidad
CREATE UNIQUE INDEX IF NOT EXISTS idx_producto_seo_slug_unique 
ON producto(seo_slug) 
WHERE seo_slug IS NOT NULL;
```

---

## 8. Testing

### Casos de Prueba

```sql
-- Test 1: Normalización básica
SELECT normalize_slug('Herramientas Eléctricas');
-- Esperado: 'herramientas-electricas'

-- Test 2: Caracteres especiales
SELECT normalize_slug('Válvula 3/4" PVC (Alta Presión)');
-- Esperado: 'valvula-34-pvc-alta-presion'

-- Test 3: Generación de URL completa
SELECT generate_canonical_url(
    'taladro-percutor-makita-hp-001',
    'Herramientas y Equipos de Trabajo',
    'Herramientas Eléctricas',
    'Makita',
    'es'
);
-- Esperado: 'https://tienda.inxora.com/es/herramientas-y-equipos-de-trabajo/herramientas-electricas/makita/taladro-percutor-makita-hp-001'
```

---

## 9. Migración de Datos Existentes

Si necesitan actualizar productos existentes que no tienen `canonical_url`:

```sql
-- Actualizar canonical_url de productos existentes
UPDATE producto
SET canonical_url = 
    'https://tienda.inxora.com/es/' || 
    normalize_slug(c.nombre) || '/' ||
    normalize_slug(s.nombre) || '/' ||
    normalize_slug(m.nombre) || '/' ||
    producto.seo_slug
FROM producto_sub_categoria psc,
     sub_categoria s,
     categoria c,
     marca m
WHERE producto.sku = psc.sku
  AND psc.id_sub_categoria = s.id
  AND s.categoria_id = c.id
  AND producto.id_marca = m.id
  AND producto.seo_slug IS NOT NULL
  AND c.nombre IS NOT NULL
  AND s.nombre IS NOT NULL
  AND m.nombre IS NOT NULL
  AND psc.es_subcategoria_principal = true
  AND (producto.canonical_url IS NULL OR producto.canonical_url = '');
```

---

## 10. Contacto

Para dudas sobre la implementación, contactar al equipo de desarrollo frontend/ecommerce.

---

**Última actualización:** Enero 2026
