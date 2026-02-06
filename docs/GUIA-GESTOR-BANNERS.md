# Guía para el Gestor de Banners — INXORA E-commerce

**Documento de referencia para crear y subir banners en el CRM**  
Versión 1.0 | Actualizado: 2025-02-03

Este documento reúne toda la información necesaria para que el gestor de banners configure correctamente cada anuncio en el sistema. Las dimensiones y ratios aquí indicados están implementados en la tienda; respetarlos evita recortes y distorsiones.

---

## Índice

1. [Resumen de slots y dimensiones](#resumen-de-slots-y-dimensiones)
2. [Especificación por slot](#especificación-por-slot)
3. [Tabla rápida de exportación](#tabla-rápida-de-exportación)
4. [Recomendaciones técnicas](#recomendaciones-técnicas)
5. [Valores posicion_slug para el CRM](#valores-posicion_slug-para-el-crm)

---

## Resumen de slots y dimensiones

| # | posicion_slug | Ubicación en la página | Desktop (px) | Mobile (px) | Ratio |
|---|---------------|------------------------|--------------|-------------|-------|
| 1 | `home-hero` | Hero principal (arriba de todo) | 1920 × 823 | 750 × 562 | 21:9 / 4:3 |
| 2 | `layout-header-strip` | Encima del header (todas las páginas) | 1920 × 80 | 750 × 31 | 24:1 |
| 3 | `home-below-hero` | Entre Hero y barra de categorías | 1920 × 240 | 750 × 188 | 8:1 / 4:1 |
| 4 | `home-below-categories` | Entre categorías y Productos Destacados | 1920 × 400 | 375 × 78 | 24:5 |
| 5 | `home-right-destacados` | Lateral derecho de Productos Destacados | 400 × 600 | — (oculto) | 2:3 |
| 6 | `home-middle` | Entre Productos Destacados y Nuevos | 1920 × 400 | 375 × 78 | 24:5 |
| 7 | `home-right-nuevos` | Lateral derecho de Nuevos Productos | 400 × 600 | — (oculto) | 2:3 |
| 8 | `home-between-sections` | Entre Nuevos Productos y Categorías | 1920 × 300 | 375 × 188 | 3:1 / 2:1 |
| 9 | `home-pre-footer` | Pre-footer / CTA (antes del pie) | 1920 × 300 | 750 × 117 | 32:5 |
| 10 | `layout-footer-strip` | Arriba del contenido del footer | 1920 × 80 | 750 × 31 | 24:1 |

---

## Especificación por slot

### 1. home-hero — Hero principal

- **posicion_slug:** `home-hero`
- **Ubicación:** Primera sección de la página de inicio, ancho completo.
- **Dimensiones Desktop:** 1920 × 823 px (ratio 21:9)
- **Dimensiones Mobile:** 750 × 562 px (ratio 4:3)
- **Notas:** Es el banner más visible. Prioridad alta de carga. Si no hay banner, se muestra una imagen estática de respaldo.

---

### 2. layout-header-strip — Strip del header

- **posicion_slug:** `layout-header-strip`
- **Ubicación:** Encima del header principal, en todas las páginas.
- **Dimensiones Desktop:** 1920 × 80 px (ratio 24:1)
- **Dimensiones Mobile:** 750 × 31 px (ratio 24:1)
- **Uso típico:** Promos cortas: "Envío gratis", "Oferta limitada", etc.

---

### 3. home-below-hero — Strip post-hero

- **posicion_slug:** `home-below-hero`
- **Ubicación:** Entre el Hero y la barra de categorías rápidas.
- **Dimensiones Desktop:** 1920 × 240 px (ratio 8:1)
- **Dimensiones Mobile:** 750 × 188 px (ratio 4:1)
- **Uso típico:** Promos horizontales, ofertas flash.

---

### 4. home-below-categories — Entre categorías y destacados

- **posicion_slug:** `home-below-categories`
- **Ubicación:** Entre la barra de categorías y la sección "Productos Destacados".
- **Dimensiones Desktop:** 1920 × 400 px (ratio 24:5 ≈ 4.8:1)
- **Dimensiones Mobile:** 375 × 78 px (ratio 24:5)
- **Uso típico:** Campañas promocionales.

---

### 5. home-right-destacados — Lateral Productos Destacados

- **posicion_slug:** `home-right-destacados`
- **Ubicación:** Columna derecha junto al slider de Productos Destacados. Solo visible en pantallas ≥1536px.
- **Dimensiones:** 400 × 600 px (ratio 2:3)
- **Mobile:** No se muestra en móvil.
- **Nota:** El layout lo muestra a 320–380 px de ancho; exportar a 400×600 para buena nitidez.

---

### 6. home-middle — Entre sliders

- **posicion_slug:** `home-middle`
- **Ubicación:** Entre "Productos Destacados" y "Nuevos Productos".
- **Dimensiones Desktop:** 1920 × 400 px (ratio 24:5)
- **Dimensiones Mobile:** 375 × 78 px (ratio 24:5)
- **Uso típico:** Banners promocionales centrales.

---

### 7. home-right-nuevos — Lateral Nuevos Productos

- **posicion_slug:** `home-right-nuevos`
- **Ubicación:** Columna derecha junto al slider de Nuevos Productos. Solo visible en pantallas ≥1536px.
- **Dimensiones:** 400 × 600 px (ratio 2:3)
- **Mobile:** No se muestra en móvil.

---

### 8. home-between-sections — Entre secciones

- **posicion_slug:** `home-between-sections`
- **Ubicación:** Entre "Nuevos Productos" y "Categorías Principales".
- **Dimensiones Desktop:** 1920 × 300 px (ratio 3:1)
- **Dimensiones Mobile:** 375 × 188 px (ratio 2:1)

---

### 9. home-pre-footer — Pre-footer / CTA

- **posicion_slug:** `home-pre-footer`
- **Ubicación:** Antes del footer, sección de llamada a la acción.
- **Dimensiones Desktop:** 1920 × 300 px (ratio 32:5 ≈ 6.4:1)
- **Dimensiones Mobile:** 750 × 117 px (ratio 32:5)
- **Uso típico:** CTA principal, explorar catálogo, promos finales.

---

### 10. layout-footer-strip — Strip del footer

- **posicion_slug:** `layout-footer-strip`
- **Ubicación:** Arriba del contenido del footer, en todas las páginas.
- **Dimensiones Desktop:** 1920 × 80 px (ratio 24:1)
- **Dimensiones Mobile:** 750 × 31 px (ratio 24:1)
- **Uso típico:** Newsletter, trust badges, última promoción.

---

## Tabla rápida de exportación

Para diseño y exportación de imágenes:

| posicion_slug | Desktop (px) | Mobile (px) |
|---------------|--------------|-------------|
| home-hero | 1920 × 823 | 750 × 562 |
| layout-header-strip | 1920 × 80 | 750 × 31 |
| home-below-hero | 1920 × 240 | 750 × 188 |
| home-below-categories | 1920 × 400 | 375 × 78 |
| home-right-destacados | 400 × 600 | — |
| home-middle | 1920 × 400 | 375 × 78 |
| home-right-nuevos | 400 × 600 | — |
| home-between-sections | 1920 × 300 | 375 × 188 |
| home-pre-footer | 1920 × 300 | 750 × 117 |
| layout-footer-strip | 1920 × 80 | 750 × 31 |

---

## Recomendaciones técnicas

### Formatos de imagen

- **Fotos:** JPG (calidad 80–85)
- **Gráficos con transparencia:** PNG
- **Optimización:** WebP cuando el sistema lo soporte

### Resolución

- **Desktop:** 1920 px de ancho para banners full-width.
- **Mobile:** 750 px o 1080 px de ancho para pantallas retina (2x–3x).
- **Laterales (home-right-*):** 400×600 px fijo.

### Parámetros de referencia

| Parámetro | Valor |
|-----------|-------|
| Ancho máximo contenedor (Desktop) | 1920 px |
| Viewport móvil típico | 375 px (iPhone) / 390 px (Android) |
| Altura mínima Hero (Mobile) | 500 px |
| Altura mínima Hero (Desktop) | 600 px |
| Ancho lateral en layout | 320–380 px |

### Implementación en frontend

Los aspect-ratio están definidos en el código. Si las imágenes no respetan las proporciones indicadas, el frontend las recorta con `object-cover` centrado. Para evitar recortes no deseados, usar las dimensiones exactas de esta guía.

---

## Valores posicion_slug para el CRM

Al crear un banner en el gestor, asignar el campo **posicion_slug** exactamente como se indica (minúsculas, guiones):

```
home-hero
layout-header-strip
home-below-hero
home-below-categories
home-right-destacados
home-middle
home-right-nuevos
home-between-sections
home-pre-footer
layout-footer-strip
```

**Importante:** El valor debe coincidir exactamente. Variantes como `home_hero` o `Home-Hero` pueden no funcionar correctamente.

---

## Orden de aparición en la página de inicio

1. **layout-header-strip** (si existe) — encima del header  
2. **home-hero** — hero principal  
3. **home-below-hero** — strip post-hero  
4. Barra de categorías rápidas  
5. **home-below-categories** — entre categorías y destacados  
6. **Productos Destacados** + **home-right-destacados** (lateral)  
7. **home-middle** — entre sliders  
8. **Nuevos Productos** + **home-right-nuevos** (lateral)  
9. **home-between-sections** — entre secciones  
10. Categorías principales  
11. **home-pre-footer** — pre-footer / CTA  
12. **layout-footer-strip** (si existe) — strip del footer  
13. Footer

---

*Implementación en código: `lib/config/banner-slots.ts`*
