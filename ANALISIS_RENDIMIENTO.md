# Análisis de Rendimiento - E-commerce INXORA

## 🔍 Problemas Identificados

### 1. **Consultas SQL Muy Pesadas**
Las consultas a Supabase están trayendo **demasiadas relaciones anidadas** en una sola query:

```typescript
.select(`
  sku, sku_producto, nombre, ...
  categorias:producto_categoria(id_categoria, categoria:categoria(id, nombre)),
  marca:id_marca(id, nombre, logo_url),
  unidad:id_unidad(id, nombre, simbolo),
  disponibilidad:id_disponibilidad(id, nombre, descripcion),
  precios:producto_precio_moneda(
    id, precio_venta, margen_aplicado, ...
    moneda:id_moneda(id, codigo, nombre, simbolo)
  )
`)
```

**Problema**: Esto genera JOINs complejos que pueden tardar mucho tiempo, especialmente con muchos productos.

### 2. **Procesamiento Excesivo en JavaScript**
Después de obtener los datos, se procesan **todos los productos** en JavaScript:
- Normalización de categorías (pueden venir como arrays)
- Filtrado de precios vigentes
- Separación de precios por moneda (soles/dólares)
- Procesamiento de URLs de imágenes
- Construcción de galerías de imágenes

**Problema**: Si hay 50 productos por página, se procesan 50 productos en cada request.

### 3. **Consultas Adicionales Innecesarias**
En `app/[locale]/categoria/[slug]/page.tsx` (líneas 104-113):
```typescript
const allProductsData = await getProducts({
  page: 1,
  limit: 500, // ⚠️ Consulta 500 productos solo para obtener marcas
  categoria: allCategoriaIds,
  ...
})
```

**Problema**: Se consultan 500 productos adicionales solo para extraer las marcas relacionadas, duplicando el trabajo.

### 4. **Sin Caché**
Todas las páginas tienen:
```typescript
export const dynamic = 'force-dynamic'
export const revalidate = 0
```

**Problema**: Cada request hace consultas completas a la BD, sin aprovechar caché.

### 5. **Error de Imágenes 400**
El error muestra:
```
⨯ upstream image response failed for https://keeussaqlshdsegerqob.supabase.co/storage/v1/object/public/productos-images/INXHERR353/... 400
```

**Problema**: Next.js Image Optimization intenta optimizar imágenes que no existen, causando que el servidor se cierre.

## 📊 Flujo Actual de Obtención de Productos

1. **Request llega a la página** (`/catalogo` o `/categoria/[slug]`)
2. **Se ejecutan consultas en paralelo**:
   - `getProducts()` - Consulta compleja con múltiples JOINs
   - `getCategorias()` - Consulta simple
   - `getMarcas()` - Consulta simple
3. **Si es página de categoría**: Consulta adicional de 500 productos para marcas
4. **Procesamiento en JavaScript**:
   - Normalización de datos
   - Filtrado de precios
   - Procesamiento de imágenes
5. **Renderizado del componente**

**Tiempo estimado**: 2-5 segundos por request (dependiendo de la cantidad de productos)

## 🚀 Soluciones Propuestas

### Solución 1: Optimizar Consultas SQL
- Reducir campos innecesarios en el SELECT
- Separar consultas de precios si es necesario
- Usar índices en la BD para categorías y marcas

### Solución 2: Implementar Caché
- Usar `revalidate: 60` (1 minuto) en lugar de `0`
- Implementar ISR (Incremental Static Regeneration)
- Cachear consultas frecuentes

### Solución 3: Optimizar Consulta de Marcas
- Crear una función específica `getBrandsByCategory()` que consulte directamente la tabla de relaciones
- Evitar consultar 500 productos solo para obtener marcas

### Solución 4: Manejo de Errores de Imágenes
- Validar URLs de imágenes antes de pasarlas a Next.js Image
- Usar imágenes placeholder cuando falten
- Configurar `unoptimized: true` temporalmente si es necesario

### Solución 5: Paginación y Lazy Loading
- Reducir el límite inicial de productos
- Implementar infinite scroll o carga progresiva
- Usar React Suspense para cargar componentes de forma asíncrona

## ✅ Optimizaciones Implementadas

### 1. **Función Optimizada para Obtener Marcas por Categoría** ✅
- **Archivo**: `lib/supabase.ts` - Función `getMarcasByCategoria()`
- **Cambio**: En lugar de consultar 500 productos completos solo para extraer marcas, ahora se consulta directamente:
  1. Tabla `producto_categoria` para obtener SKUs únicos
  2. Tabla `producto` solo para obtener `id_marca` (sin relaciones pesadas)
  3. Tabla `marca` con los IDs únicos
- **Impacto**: Reduce significativamente el tiempo de carga y la carga en la BD

### 2. **Implementación de Caché** ✅
- **Archivos**: 
  - `app/[locale]/catalogo/page.tsx`
  - `app/[locale]/categoria/[slug]/page.tsx`
- **Cambio**: `revalidate: 0` → `revalidate: 60` (caché de 60 segundos)
- **Impacto**: Las páginas se cachean durante 1 minuto, reduciendo consultas a la BD

### 3. **Validación Mejorada de URLs de Imágenes** ✅
- **Archivo**: `lib/supabase.ts` - Función `buildProductImageUrl()`
- **Cambios**:
  - Validación de caracteres peligrosos (`..`, `//`, `<script`)
  - Validación de que URLs externas sean solo de Supabase
  - Validación de paths vacíos
- **Impacto**: Previene errores 400 de Next.js Image Optimization

### 4. **Configuración Mejorada de Next.js Image** ✅
- **Archivo**: `next.config.js`
- **Cambios**: Mejor configuración para manejar errores de imágenes
- **Impacto**: El servidor no se cierra cuando hay imágenes faltantes

## 📈 Impacto Esperado

- **Reducción de tiempo de carga**: De 2-5s a 0.5-1.5s (con caché activo)
- **Menor carga en BD**: 
  - Eliminada consulta de 500 productos para marcas
  - Caché reduce consultas repetidas
- **Mejor experiencia de usuario**: Páginas más rápidas y estables
- **Estabilidad del servidor**: Validación de imágenes previene crashes

## 🔄 Próximas Optimizaciones Recomendadas

1. **Optimizar Consultas SQL**: Reducir campos innecesarios en SELECT
2. **Implementar Lazy Loading**: Cargar imágenes de forma progresiva
3. **Agregar Índices en BD**: Para campos frecuentemente consultados (categorías, marcas)
4. **Implementar ISR**: Para páginas estáticas que cambian poco
