# API de Banners Dinámicos

El frontend consume los siguientes endpoints de la API:

## Endpoints

### GET /api/banners/public

Devuelve todos los banners públicos activos. El frontend filtra por `posicion_slug`.

**Respuesta:** Array directo de banners (no envuelto en objeto).

```json
[
  {
    "id": 1,
    "nombre_interno": "PRUEBA BANNER",
    "posicion_slug": "home_hero",
    "url_imagen_desktop": "https://res.cloudinary.com/.../image.png",
    "url_imagen_mobile": "https://res.cloudinary.com/.../image.png",
    "focal_point": "center",
    "titulo_h1": "Título",
    "subtitulo_p": "Subtítulo",
    "boton_texto": "Ver más",
    "url_destino": "https://tienda.inxora.com/es/catalogo",
    "orden": 1,
    "todo_clicable": false,
    "promocion": null
  }
]
```

### GET /api/banners/

Devuelve todos los banners (base).

### GET /api/banners/{banner_id}

Devuelve un banner por ID.

### Estructura de la tabla `public.banner`

El tipo `Banner` en el frontend refleja la estructura esperada:

- `id` (number)
- `posicion_slug` (string)
- `titulo_h1` (string | null)
- `subtitulo_p` (string | null)
- `url_imagen_desktop` (string) — requerido
- `url_imagen_mobile` (string | null) — fallback a desktop si null
- `url_destino` (string | null)
- `boton_texto` (string | null)
- `todo_clicable` (boolean)
- `focal_point` (string | null) — center, north, south, east, west
- `orden` (number)
- `activo` (boolean)
- `fecha_inicio` (string | null)
- `fecha_fin` (string | null)
- `fecha_creacion` (string)
- `fecha_actualizacion` (string)

### Posiciones (slots) disponibles

| posicion_slug          | Ubicación                                    | Dimensiones recomendadas |
|------------------------|----------------------------------------------|--------------------------|
| home-hero              | Hero principal (LCP)                         | 1920×823 (21:9)          |
| home-right-destacados  | Lateral derecho de Productos Destacados       | **400×600** (2:3)        |
| home-right-nuevos      | Lateral derecho de Nuevos Productos           | **400×600** (2:3)        |
| home-middle            | Entre Productos Destacados y Nuevos           | 1920×400 (4.8:1)         |
| home-pre-footer        | Pre-footer / CTA                             | 1920×300 (6.4:1)         |
| home-below-hero        | Post-Hero                                    | 1920×400 (4.8:1)         |
| home-below-categories  | Entre categorías y destacados                | 1920×400 (4.8:1)         |
| home-between-sections  | Entre nuevos y categorías                    | 1920×300 (6.4:1)         |
| layout-header-strip    | Header promo                                 | 1920×80 (24:1)           |
| layout-footer-strip    | Footer strip                                 | 1920×80 (24:1)           |

**Nota para app.inxora:** Los slugs `home_right_destacados` y `home_right_nuevos` (con guión bajo) se normalizan y coinciden con `home-right-destacados` y `home-right-nuevos`.

**Dimensiones y slots:** Ver `docs/GUIA-GESTOR-BANNERS.md` (fuente de verdad para dimensiones, posicion_slug y especificaciones).
