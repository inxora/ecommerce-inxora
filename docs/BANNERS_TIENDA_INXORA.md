# Banners — Contexto para tienda.inxora

**Documento de referencia para cargar y renderizar banners en la tienda**  
Versión 1.0 | Actualizado: 2026-02-05

Este documento describe la estructura completa de los banners que se crean en **app.inxora** (gestor) y que **tienda.inxora** debe consumir y renderizar correctamente.

---

## Índice

1. [Endpoint y consumo](#endpoint-y-consumo)
2. [Estructura del objeto Banner](#estructura-del-objeto-banner)
3. [Configuración de diseño (capas)](#configuración-de-diseño-capas)
4. [Lógica de renderizado](#lógica-de-renderizado)
5. [Posiciones (slots) y dimensiones](#posiciones-slots-y-dimensiones)
6. [Ejemplo de implementación](#ejemplo-de-implementación)

---

## Endpoint y consumo

### `GET /api/banners/public`

Obtiene los banners activos y vigentes para mostrar en la tienda.

| Parámetro | Valor |
|-----------|-------|
| **URL base** | `https://app.inxora.com/api/banners/public` |
| **Query opcional** | `posicion_slug` — Filtrar por slot: `home-hero`, `home-middle`, etc. |

**Ejemplos:**
```
GET /api/banners/public
GET /api/banners/public?posicion_slug=home-hero
```

**Filtros aplicados por el backend:**
- `activo = true`
- `fecha_inicio` y `fecha_fin` vigentes (si están definidas)

---

## Estructura del objeto Banner

Cada elemento del array devuelto tiene la siguiente estructura:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | number | ID único del banner |
| `nombre_interno` | string | Nombre interno (gestor), útil para debug |
| `posicion_slug` | string | Slot donde se muestra (ver tabla de slots) |
| `url_imagen_desktop` | string | URL de la imagen para desktop |
| `url_imagen_mobile` | string \| null | URL de la imagen para móvil. Si `null`, usar `url_imagen_desktop` |
| `focal_point` | string | Punto focal para `object-position` (desktop). Ver [mapeo a CSS](#mapeo-focal_point-a-css) |
| `focal_point_mobile` | string \| null | Punto focal para móvil. Si `null`, usar `focal_point` |
| `object_fit` | `'cover'` \| `'contain'` | Desktop: `cover` recorta para llenar; `contain` muestra imagen completa |
| `object_fit_mobile` | `'cover'` \| `'contain'` \| null | Móvil. Si `null`, usar `object_fit` |
| `configuracion_diseno` | BannerLayer[] | Capas de texto y botones superpuestas |
| `url_destino` | string | URL de destino. La API devuelve `"#"` si en BD es `null` (fallback para imagen clicable o botones sin `url`) |
| `orden` | number | Orden de visualización dentro del slot |
| `todo_clicable` | boolean | `true`: toda la imagen es un enlace; `false`: capas con botones |
| `promocion` | object \| null | Datos de promoción vinculada (opcional) |

### Mapeo `focal_point` a CSS

| Valor API | CSS `object-position` |
|-----------|------------------------|
| `center` | `center` |
| `north` | `top` |
| `south` | `bottom` |
| `east` | `right` |
| `west` | `left` |
| `top-left`, `top-right`, `bottom-left`, `bottom-right` | Igual |
| `"30% 70%"` | Personalizado (x% y%) — usar tal cual |

---

## Configuración de diseño (capas)

`configuracion_diseno` es un array de capas. Cada capa tiene:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | Identificador único |
| `tipo` | `'h1'` \| `'p'` \| `'button'` | Tipo de elemento |
| `contenido` | string | Texto a mostrar. Soporta **negrita** (`**texto**`) y __subrayado__ (`__texto__`) |
| `x` | number | Posición X en % (0–100) para desktop |
| `y` | number | Posición Y en % (0–100) para desktop |
| `x_mobile` | number \| undefined | Posición X en móvil. Si no existe, usar `x` |
| `y_mobile` | number \| undefined | Posición Y en móvil. Si no existe, usar `y` |
| `estilos` | object | Estilos CSS (ver tabla) |
| `url` | string \| undefined | Solo para `button`. URL de destino del botón. Si no existe, usar `banner.url_destino` |

### Estilos (`estilos`)

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `color` | string | Color del texto (ej: `#ffffff`) |
| `fontSize` | number | Tamaño en px |
| `fontFamily` | string | Fuente CSS (ej: `Oswald, sans-serif`) |
| `fontWeight` | `'normal'` \| `'bold'` \| number | Peso de la fuente |
| `fontStyle` | `'normal'` \| `'italic'` | Cursiva |
| `textDecoration` | `'none'` \| `'underline'` | Subrayado |
| `backgroundColor` | string | Solo botones (ej: `#D90E8C`) |
| `borderRadius` | number | Solo botones, en px |

### Sintaxis de texto en `contenido`

El campo `contenido` puede incluir formato inline:

| Sintaxis | Resultado |
|----------|-----------|
| `**palabra**` | **Negrita** |
| `__palabra__` | <u>Subrayado</u> |
| `*palabra*` o `_palabra_` | *Cursiva* |

Ejemplo: `"El **primer** marketplace __industrial__"` → El **primer** marketplace <u>industrial</u>

---

## Lógica de renderizado

### 1. Imagen de fondo

- **Desktop:** `url_imagen_desktop`
- **Mobile:** `url_imagen_mobile ?? url_imagen_desktop`
- **object-fit:** En móvil: `object_fit_mobile ?? object_fit` (default `'cover'`)
- **object-position:** En móvil: `focal_point_mobile ?? focal_point`

### 2. Modo `todo_clicable`

| `todo_clicable` | Comportamiento |
|-----------------|----------------|
| `true` | Toda la imagen es un enlace. Envolver en `<a href="{url_destino}">`. No mostrar capas de tipo `button`. Cursor `pointer` en toda el área. |
| `false` | Mostrar capas de `configuracion_diseno`. Cada botón enlaza a su `url` o a `url_destino` como fallback. |

### 3. Posicionamiento de capas

- Usar `left: x%`, `top: y%` con `transform: translate(-50%, -50%)` para centrar.
- En viewport móvil: usar `x_mobile ?? x` y `y_mobile ?? y`.

### 4. URL de botones

```
url = layer.url || banner.url_destino
```

Si `url` está vacío o no existe, usar `banner.url_destino` (la API devuelve `"#"` cuando es null en BD).

---

## Posiciones (slots) y dimensiones

| posicion_slug | Ubicación | Desktop | Mobile |
|---------------|------------|---------|--------|
| `home-hero` | Hero principal (LCP) | 1920×823 (21:9) | 750×562 (4:3) |
| `layout-header-strip` | Encima del header | 1920×80 (24:1) | 750×31 (24:1) |
| `home-below-hero` | Post-Hero | 1920×240 (8:1) | 750×188 (4:1) |
| `home-below-categories` | Entre categorías y destacados | 1920×400 (24:5) | 375×78 (24:5) |
| `home-right-destacados` | Lateral Productos Destacados (solo ≥1536px) | 400×600 (2:3) | — (oculto) |
| `home-middle` | Entre Destacados y Nuevos | 1920×400 (24:5) | 375×78 (24:5) |
| `home-right-nuevos` | Lateral Nuevos Productos (solo ≥1536px) | 400×600 (2:3) | — (oculto) |
| `home-between-sections` | Entre Nuevos y Categorías | 1920×300 (3:1) | 375×188 (2:1) |
| `home-pre-footer` | Pre-footer / CTA | 1920×300 (32:5) | 750×117 (32:5) |
| `layout-footer-strip` | Arriba del footer | 1920×80 (24:1) | 750×31 (24:1) |

**Nota:** Los slugs con guión bajo (`home_hero`) se normalizan a guiones (`home-hero`).

---

## Ejemplo de implementación

### TypeScript: interfaz Banner

```typescript
interface BannerLayer {
  id: string;
  tipo: 'h1' | 'p' | 'button';
  contenido: string;
  x: number;
  y: number;
  x_mobile?: number;
  y_mobile?: number;
  estilos?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold' | number;
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline';
    backgroundColor?: string;
    borderRadius?: number;
  };
  url?: string;
}

interface Banner {
  id: number;
  nombre_interno: string;
  posicion_slug: string;
  url_imagen_desktop: string;
  url_imagen_mobile: string | null;
  focal_point: string;
  focal_point_mobile?: string | null;
  object_fit?: 'cover' | 'contain';
  object_fit_mobile?: 'cover' | 'contain' | null;
  configuracion_diseno: BannerLayer[];
  url_destino: string;
  orden: number;
  todo_clicable: boolean;
  promocion?: { id: number; codigo: string; nombre: string } | null;
}
```

### React: render de capas con formato inline

```tsx
function renderLayerContent(text: string): React.ReactNode {
  if (!text) return null;
  const regex = /(\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|_(.+?)_)/g;
  const parts: React.ReactNode[] = [];
  let key = 0, lastIndex = 0, m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(<span key={key++}>{text.slice(lastIndex, m.index)}</span>);
    if (m[2]) parts.push(<strong key={key++}>{m[2]}</strong>);
    else if (m[3]) parts.push(<span key={key++} style={{ textDecoration: 'underline' }}>{m[3]}</span>);
    else if (m[4] || m[5]) parts.push(<em key={key++}>{m[4] || m[5]}</em>);
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  return parts.length > 1 ? parts : text;
}

// En el componente del banner:
{banner.configuracion_diseno?.map((layer) => {
  if (!layer.contenido) return null;
  if (banner.todo_clicable && layer.tipo === 'button') return null;
  const isMobile = /* detectar viewport */;
  const x = isMobile && layer.x_mobile != null ? layer.x_mobile : layer.x;
  const y = isMobile && layer.y_mobile != null ? layer.y_mobile : layer.y;
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)',
    color: layer.estilos?.color ?? '#fff',
    fontSize: layer.estilos?.fontSize ?? 16,
    fontFamily: layer.estilos?.fontFamily,
    fontWeight: layer.estilos?.fontWeight === 'bold' ? 'bold' : layer.estilos?.fontWeight,
    fontStyle: layer.estilos?.fontStyle,
    textDecoration: layer.estilos?.textDecoration,
    backgroundColor: layer.estilos?.backgroundColor,
    borderRadius: layer.estilos?.borderRadius ? `${layer.estilos.borderRadius}px` : undefined,
    padding: layer.tipo === 'button' ? '6px 14px' : 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    maxWidth: '95%',
    textAlign: 'center',
  };
  const content = renderLayerContent(layer.contenido);
  const Tag = layer.tipo === 'h1' ? 'h1' : layer.tipo === 'p' ? 'p' : 'span';
  const el = <Tag key={layer.id} className="drop-shadow" style={style}>{content}</Tag>;
  const url = layer.tipo === 'button' ? (layer.url || banner.url_destino) : null;
  return url ? <a href={url}>{el}</a> : el;
})}
```

### Imagen con object-fit y focal point

```tsx
const objectFit = isMobile ? (banner.object_fit_mobile ?? banner.object_fit ?? 'cover') : (banner.object_fit ?? 'cover');
const focalPoint = isMobile ? (banner.focal_point_mobile ?? banner.focal_point) : banner.focal_point;
// Mapear focalPoint a CSS (north→top, south→bottom, east→right, west→left)
const objectPosition = /^\d+% \d+%$/.test(focalPoint) ? focalPoint : { north: 'top', south: 'bottom', east: 'right', west: 'left' }[focalPoint] ?? focalPoint;

<img
  src={isMobile ? (banner.url_imagen_mobile || banner.url_imagen_desktop) : banner.url_imagen_desktop}
  alt=""
  style={{ objectFit, objectPosition }}
  className="w-full h-full"
/>
```

---

## Referencias

- **Dimensiones detalladas:** `docs/GUIA-GESTOR-BANNERS.md`
- **API general:** `docs/API_TIENDA_INXORA.md`
- **Estructura de página:** `docs/ESTRUCTURA_PAGINA_PRINCIPAL_TIENDA.md`
