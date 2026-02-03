# Configuración de Slots de Banners - Home & Layout

**INXORA E-commerce** | Versión 1.0 | Actualizado: 2025-02-03

Configuración de espacios (slots) para banners en la página Home y componentes de layout. Replicable en CRM.

---

## Resumen Ejecutivo

| # | posicion_slug | Ubicación | Existe | Desktop | Mobile | LCP |
|---|---------------|-----------|:------:|---------|--------|-----|
| 1 | `home-hero` | Hero principal | ✅ | 21:9 | 4:3 | 1 |
| 2 | `layout-header-strip` | Header promo | ❌ | 20:1 | 10:1 | 2 |
| 3 | `home-below-hero` | Post-Hero | ❌ | 8:1 | 4:1 | 4 |
| 4 | `home-below-categories` | Entre categorías y destacados | ❌ | 3:1 | 2:1 | 5 |
| 5 | `home-middle` | Entre sliders | ❌ | 16:5 | 16:6 | 6 |
| 6 | `home-between-sections` | Entre nuevos y categorías | ❌ | 3:1 | 2:1 | 7 |
| 7 | `home-pre-footer` | Pre-Footer / CTA | ✅ | 21:5 | 3:1 | 8 |
| 8 | `layout-footer-strip` | Footer strip | ❌ | 4:1 | 2:1 | 9 |

---

## Slots Detallados

### 1. home-hero — Hero Principal

| Campo | Valor |
|-------|-------|
| **posicion_slug** | `home-hero` |
| **Nombre** | Hero Principal |
| **Existe actualmente** | ✅ Sí |
| **Ubicación** | `HomeClient.tsx` — primera sección, antes de barra de categorías (líneas 269-283) |

**Descripción:** Banner principal above-the-fold. Actualmente usa imagen estática. Ocupa todo el ancho con min-height 500px (mobile) / 600px (desktop).

**Aspect-Ratio:**

| Breakpoint | Ratio | Notas |
|------------|-------|-------|
| Desktop | 21:9 | Formato cinematográfico para hero full-width |
| Mobile | 4:3 | Más cuadrado para mejor legibilidad en viewport reducido |

**LCP Priority:** 1 — Elemento LCP principal. Debe cargarse con `priority` / `fetchpriority="high"`. Crítico para Core Web Vitals.

---

### 2. layout-header-strip — Header Promo Strip

| Campo | Valor |
|-------|-------|
| **posicion_slug** | `layout-header-strip` |
| **Nombre** | Header Promo Strip |
| **Existe actualmente** | ❌ No |
| **Ubicación** | `header.tsx` — encima del header o como primera fila debajo del logo |

**Descripción:** Banner delgado encima o debajo del header sticky. Común para "Envío gratis", "Oferta limitada", etc.

**Aspect-Ratio:**

| Breakpoint | Ratio | Notas |
|------------|-------|-------|
| Desktop | 20:1 | Strip muy bajo. Altura ~40-50px |
| Mobile | 10:1 | Solo texto o icono + texto |

**LCP Priority:** 2 — Visible en viewport inicial. Prioridad alta pero menor que Hero.

---

### 3. home-below-hero — Strip Post-Hero

| Campo | Valor |
|-------|-------|
| **posicion_slug** | `home-below-hero` |
| **Nombre** | Strip Post-Hero |
| **Existe actualmente** | ❌ No |
| **Ubicación** | Entre Hero (section) y Barra de Categorías (section) |

**Descripción:** Slot ideal para promos horizontales (envío gratis, ofertas flash).

**Aspect-Ratio:**

| Breakpoint | Ratio | Notas |
|------------|-------|-------|
| Desktop | 8:1 | Strip horizontal bajo |
| Mobile | 4:1 | Formato banner tipo "marquee" o anuncio promocional |

**LCP Priority:** 4 — Below the fold. Carga diferida recomendada (lazy).

---

### 4. home-below-categories — Entre Categorías y Productos Destacados

| Campo | Valor |
|-------|-------|
| **posicion_slug** | `home-below-categories` |
| **Nombre** | Entre Categorías y Productos Destacados |
| **Existe actualmente** | ❌ No |
| **Ubicación** | HomeClient — después de CategoriesCarousel strip, antes de FeaturedProductsSlider |

**Descripción:** Ideal para banner promocional de campaña.

**Aspect-Ratio:**

| Breakpoint | Ratio | Notas |
|------------|-------|-------|
| Desktop | 3:1 | Tipo leaderboard ampliado |
| Mobile | 2:1 | Buena visibilidad |

**LCP Priority:** 5 — Below the fold. Carga lazy.

---

### 5. home-middle — Middle Banner (Entre Sliders)

| Campo | Valor |
|-------|-------|
| **posicion_slug** | `home-middle` |
| **Nombre** | Middle Banner |
| **Existe actualmente** | ❌ No |
| **Ubicación** | HomeClient — entre FeaturedProductsSlider (Destacados) y FeaturedProductsSlider (Nuevos) |

**Descripción:** Slot clásico para banners promocionales en e-commerce.

**Aspect-Ratio:**

| Breakpoint | Ratio | Notas |
|------------|-------|-------|
| Desktop | 16:5 | ≈ 3.2:1, formato intermedio |
| Mobile | 16:6 | Ligeramente más alto para tap targets |

**LCP Priority:** 6 — Below the fold. Carga lazy.

---

### 6. home-between-sections — Entre Productos Nuevos y Categorías Principales

| Campo | Valor |
|-------|-------|
| **posicion_slug** | `home-between-sections` |
| **Nombre** | Entre Productos Nuevos y Categorías Principales |
| **Existe actualmente** | ❌ No |
| **Ubicación** | HomeClient — entre segundo FeaturedProductsSlider y Main Categories Section |

**Descripción:** Entre el slider de Productos Nuevos y la sección Categorías Principales (CategoriesCarousel).

**Aspect-Ratio:**

| Breakpoint | Ratio | Notas |
|------------|-------|-------|
| Desktop | 3:1 | Consistente con home-below-categories |
| Mobile | 2:1 | Coherencia visual |

**LCP Priority:** 7 — Below the fold. Carga lazy.

---

### 7. home-pre-footer — Pre-Footer / CTA Strip

| Campo | Valor |
|-------|-------|
| **posicion_slug** | `home-pre-footer` |
| **Nombre** | Pre-Footer / CTA Strip |
| **Existe actualmente** | ✅ Sí |
| **Ubicación** | HomeClient — sección CTA (líneas 381-394), antes del cierre del main |

**Descripción:** Reemplaza o complementa la sección CTA actual ("Explora Nuestro Catálogo Completo"). Puede ser banner con CTA integrado.

**Aspect-Ratio:**

| Breakpoint | Ratio | Notas |
|------------|-------|-------|
| Desktop | 21:5 | Strip ancho pre-footer |
| Mobile | 3:1 | Actualmente es sección de texto + botón; puede convertirse en banner visual |

**LCP Priority:** 8 — Above the fold en scroll largo. Carga lazy.

---

### 8. layout-footer-strip — Footer Strip / Newsletter

| Campo | Valor |
|-------|-------|
| **posicion_slug** | `layout-footer-strip` |
| **Nombre** | Footer Strip / Newsletter |
| **Existe actualmente** | ❌ No |
| **Ubicación** | `footer.tsx` — antes del grid de links o en la bottom bar |

**Descripción:** Banner en el footer para newsletter, trust badges o última promoción.

**Aspect-Ratio:**

| Breakpoint | Ratio | Notas |
|------------|-------|-------|
| Desktop | 4:1 | Footer strip |
| Mobile | 2:1 | Newsletter signup o trust badges |

**LCP Priority:** 9 — Último en la página. Carga lazy, menor prioridad.

---

## Orden de Prioridad LCP

1. **home-hero** — LCP principal
2. **layout-header-strip** — Si se implementa
3. Resto below the fold — lazy
4. Slots 4-9 en orden de aparición en la página

---

## Recomendaciones de Implementación

- **Hero:** Usar `priority` en Next/Image y `fetchpriority="high"`
- **Slots 4-9:** Usar `loading="lazy"` y/o Intersection Observer
- **CLS:** Considerar placeholder con `aspect-ratio` para evitar Cumulative Layout Shift

---

## Dimensiones de Referencia

| Parámetro | Valor |
|-----------|-------|
| Container max | 1920px |
| Hero min-height (mobile) | 500px |
| Hero min-height (desktop) | 600px |
| Strip altura estimada (desktop) | 80-120px |
| Strip altura estimada (mobile) | 100-150px |

---

## Estructura Visual de la Home

```
┌─────────────────────────────────────────┐
│ Header (layout)                          │
│ [layout-header-strip] ← slot opcional    │
├─────────────────────────────────────────┤
│ [home-hero] ← LCP 1                      │
├─────────────────────────────────────────┤
│ [home-below-hero] ← slot opcional       │
├─────────────────────────────────────────┤
│ Barra Categorías Rápidas                 │
├─────────────────────────────────────────┤
│ [home-below-categories] ← slot opcional │
├─────────────────────────────────────────┤
│ Productos Destacados                     │
├─────────────────────────────────────────┤
│ [home-middle] ← slot opcional            │
├─────────────────────────────────────────┤
│ Productos Nuevos                         │
├─────────────────────────────────────────┤
│ [home-between-sections] ← slot opcional  │
├─────────────────────────────────────────┤
│ Categorías Principales                   │
├─────────────────────────────────────────┤
│ [home-pre-footer] ← CTA actual           │
├─────────────────────────────────────────┤
│ Footer                                   │
│ [layout-footer-strip] ← slot opcional   │
└─────────────────────────────────────────┘
```

---

## JSON para CRM

La configuración en formato JSON está disponible en:

`/root/ecommerce-inxora/data/banner-slots-config.json`
