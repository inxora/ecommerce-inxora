# Wireframe - Página Principal (Home) - Estructura Actual

**Fecha:** Febrero 2025  
**Ruta:** `/[locale]` (ej: `/es`, `/en`, `/pt`)  
**Archivos:** `app/[locale]/page.tsx` → `app/[locale]/HomeClient.tsx`

## Sistema de espaciado (estilo tienda real)

- **Secciones productos:** Sin `max-width` — usan ancho completo de viewport
- **Grid productos + banner:** `xl:grid-cols-[minmax(0,1fr)_320px]`, `xl:gap-10 2xl:gap-12`
- **Padding productos:** `pl-4 sm:pl-6 lg:pl-8 xl:pl-10 2xl:pl-12` (con banner) o `px-4...` (sin banner)
- **Objetivo 1920px:** ~1500–1520px para productos, 400px para banner lateral
- **Banner lateral:** `400×600px` (2:3), `sticky top-24`, `pr-4 2xl:pr-6` desde borde derecho — coincide con wireframe app.inxora

---

## 1. Jerarquía de componentes

```
Layout (app/[locale]/layout.tsx)
├── Header (components/layout/header.tsx) — sticky
├── <main>
│   └── HomeClient (app/[locale]/HomeClient.tsx)
│       ├── Hero Section
│       ├── Barra de Categorías Rápidas
│       ├── Productos Destacados (FeaturedProductsSlider)
│       ├── Nuevos Productos (FeaturedProductsSlider)
│       ├── Categorías Principales
│       └── Pre-Footer / CTA
├── Footer (components/layout/footer.tsx)
└── WhatsAppFloat (components/layout/whatsapp-float.tsx) — flotante
```

---

## 2. Wireframe ASCII - Estructura vertical

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LAYOUT (global)                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  HEADER (sticky)                                                             │
│  Logo | Categorías | Nav | Buscador | Moneda | Favoritos | Carrito | Usuario  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  MAIN (contenido de la página)                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. HERO SECTION                                                        │  │
│  │    - BannerSlot (home-hero) si hay banners                             │  │
│  │    - O fallback: imagen estática + H1 + CTA + badges (Calidad, Envíos)  │  │
│  │    - min-h: 500px lg:600px                                             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 2. BARRAS DE CATEGORÍAS RÁPIDAS                                        │  │
│  │    - Slider infinito horizontal (icono + nombre por categoría)          │  │
│  │    - bg-gray-100, py-4 lg:py-5                                         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 3. PRODUCTOS DESTACADOS                                                │  │
│  │    ┌─────────────────────────────────────┬─────────────────────────┐  │  │
│  │    │ Slider productos (cards)            │ BANNER LATERAL           │  │  │
│  │    │ - Header: título + subtítulo         │ home-right-destacados    │  │  │
│  │    │ - Carrusel horizontal infinito      │ 320px, min-h 400px       │  │  │
│  │    │ - Botón "Ver todos los productos"   │ Solo desktop (lg:)       │  │  │
│  │    └─────────────────────────────────────┴─────────────────────────┘  │  │
│  │    Layout: grid lg:grid-cols-[1fr_320px] (solo si hay banner)         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 4. NUEVOS PRODUCTOS                                                    │  │
│  │    ┌─────────────────────────────────────┬─────────────────────────┐  │  │
│  │    │ Slider productos (cards)            │ BANNER LATERAL           │  │  │
│  │    │ - Misma estructura que Destacados   │ home-right-nuevos       │  │  │
│  │    │ - bg-gray-50 (fondo diferenciado)  │ 320px, min-h 400px       │  │  │
│  │    └─────────────────────────────────────┴─────────────────────────┘  │  │
│  │    Layout: grid lg:grid-cols-[1fr_320px] (solo si hay banner)         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 5. CATEGORÍAS PRINCIPALES                                              │  │
│  │    - Título "Categorías Principales"                                    │  │
│  │    - CategoriesCarousel (cards con imagen + nombre)                     │  │
│  │    - 1 columna, sin lateral                                            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 6. PRE-FOOTER / CTA                                                    │  │
│  │    - BannerSlot (home-pre-footer) si hay banners                        │  │
│  │    - O fallback: "Explora Nuestro Catálogo" + botón CTA                 │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  FOOTER                                                                      │
│  Logo | Enlaces | Redes | Contacto                                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────┐
│WhatsApp │  ← Flotante (fixed bottom-right)
└─────────┘
```

---

## 3. Layout de 2 columnas

| Sección              | ¿2 columnas? | Descripción                                                                 |
|----------------------|--------------|-------------------------------------------------------------------------------|
| Productos Destacados | Sí (lg:)     | Izquierda: slider de productos. Derecha: banner `home-right-destacados` (320px) |
| Nuevos Productos     | Sí (lg:)     | Izquierda: slider de productos. Derecha: banner `home-right-nuevos` (320px)    |
| Resto de secciones   | No           | Una sola columna full-width                                                   |

**Nota:** Los laterales de banner solo se muestran en viewport `lg` (≥1024px). En móvil/tablet no hay columna lateral.

---

## 4. Mapeo Componente → Slot de Banner

| Componente / Sección        | Slot de API           | Estado actual | Ubicación en wireframe |
|-----------------------------|-----------------------|---------------|------------------------|
| Hero Section                | `home-hero`           | Implementado   | Sección 1              |
| —                            | `home-below-hero`     | No implementado | Iría entre Hero y Barra de Categorías |
| Barra de Categorías Rápidas | —                     | Sin slot      | Sección 2              |
| —                            | `home-below-categories` | No implementado | Iría entre Categorías y Productos Destacados |
| Productos Destacados        | `home-right-destacados` | Implementado | Lateral derecho Sección 3 |
| —                            | `home-middle`        | No implementado | Iría entre Productos Destacados y Nuevos Productos |
| Nuevos Productos            | `home-right-nuevos`   | Implementado   | Lateral derecho Sección 4 |
| —                            | `home-between-sections` | No implementado | Iría entre Nuevos Productos y Categorías Principales |
| Categorías Principales      | —                     | Sin slot      | Sección 5              |
| Pre-Footer / CTA            | `home-pre-footer`     | Implementado   | Sección 6              |
| Header                      | `layout-header-strip` | No implementado | Bajo el header principal |
| Footer                      | `layout-footer-strip` | No implementado | Sobre o dentro del footer |

---

## 5. Slots implementados vs. no implementados

### Implementados (4)
- `home-hero` → Hero Section
- `home-right-destacados` → Lateral derecho de Productos Destacados
- `home-right-nuevos` → Lateral derecho de Nuevos Productos
- `home-pre-footer` → Pre-Footer / CTA

### Configurados pero no renderizados (1)
- `home-middle` → Se obtienen los banners en `page.tsx` y se pasan a `HomeClient`, pero **no se renderizan** en el DOM.

### No implementados (5)
- `home-below-hero`
- `home-below-categories`
- `home-between-sections`
- `layout-header-strip`
- `layout-footer-strip`

---

## 6. Componentes hijos utilizados

| Componente padre      | Componente hijo          | Archivo                                      |
|-----------------------|--------------------------|----------------------------------------------|
| HomeClient            | BannerSlot               | `components/banner/banner-slot.tsx`          |
| HomeClient            | FeaturedProductsSlider   | Inline en `HomeClient.tsx`                   |
| HomeClient            | CategoriesCarousel       | `components/home/categories-carousel.tsx`   |
| HomeClient            | ProductImage             | `components/ui/product-image.tsx`            |
| Layout                | Header                   | `components/layout/header.tsx`               |
| Layout                | Footer                   | `components/layout/footer.tsx`               |
| Layout                | WhatsAppFloat            | `components/layout/whatsapp-float.tsx`       |

---

## 7. Orden vertical definitivo (de arriba a abajo)

1. **Header** (layout)
2. **Hero Section** — `home-hero`
3. **Barra de Categorías Rápidas**
4. **Productos Destacados** + `home-right-destacados` (lateral)
5. **Nuevos Productos** + `home-right-nuevos` (lateral)
6. **Categorías Principales**
7. **Pre-Footer / CTA** — `home-pre-footer`
8. **Footer** (layout)
9. **WhatsAppFloat** (flotante, fuera del flujo)
