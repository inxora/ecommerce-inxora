# Banners Dinámicos y SEO

Impacto de los banners dinámicos en el posicionamiento y recomendaciones.

---

## 1. Impacto en Core Web Vitals

### LCP (Largest Contentful Paint)
- **Hero (home-hero):** Suele ser el elemento LCP de la Home.
- **Riesgo:** Si el banner se carga desde el API después del HTML, puede retrasar el LCP.
- **Mitigación actual:**
  - Los banners se obtienen en el servidor (`getBannersActivos` en `page.tsx`) y se pasan como props.
  - El HTML incluye la imagen en el primer render (SSR).
  - `fetchPriority="high"` y `loading="eager"` en el hero.
- **Recomendación:** Mantener el fetch de banners en el servidor. No migrar a carga client-side.

### CLS (Cumulative Layout Shift)
- **Mitigación:** `aspect-ratio` fijo en el contenedor reserva espacio antes de cargar la imagen.
- **Recomendación:** No cambiar los ratios sin actualizar la config.

### INP / FID
- Los banners no añaden interacción pesada. El carrusel usa estado local ligero.

---

## 2. Contenido y Crawlability

### Texto del banner (titulo_h1, subtitulo_p)
- **Estado:** El texto está en el HTML y es visible para el crawler.
- **Semántica:** Se usa `<h2>` para el título del banner (el H1 de la página está en el fallback estático o en metadata).
- **Recomendación:** Si el banner es el contenido principal del hero, valorar usar `<h1>` para el primer banner cuando no hay H1 estático encima.

### Imágenes
- **Alt:** Se usa `titulo_h1` o "Banner" como `alt`. Mejorar con descripciones más específicas desde el CRM.
- **URLs:** Las imágenes de Cloudinary son absolutas y accesibles. No hay bloqueo por robots.

---

## 3. Estructura de la página

### Jerarquía de encabezados
- Con banners dinámicos, el primer `<h1>` visible puede ser el del banner o el del fallback.
- **Recomendación:** Definir en el CRM si el `titulo_h1` del hero debe ser H1 o H2 según la estrategia de la página.

### Schema.org
- Los banners no requieren schema específico.
- Si hay carrusel de banners, se podría añadir `ItemList` con `ListItem` para cada slide (opcional, bajo impacto).

---

## 4. URLs de destino (url_destino)

- Los enlaces del banner son crawlables.
- **Recomendación:** Usar URLs relativas o absolutas internas (`/es/catalogo`, `https://tienda.inxora.com/es/...`) para que pasen autoridad.

---

## 5. Checklist SEO para banners

| Aspecto | Estado | Acción |
|---------|--------|--------|
| Carga en servidor | ✅ | Mantener |
| LCP (priority en hero) | ✅ | Mantener |
| Aspect-ratio (anti-CLS) | ✅ | Mantener |
| Alt de imagen | ⚠️ | Mejorar en CRM con descripciones |
| H1/H2 del hero | ⚠️ | Definir estrategia (H1 vs H2) |
| URLs internas | ✅ | Usar enlaces internos |

---

## 6. Riesgos a evitar

1. **No cargar banners en el cliente** para el hero: empeoraría LCP.
2. **No eliminar el aspect-ratio:** aumentaría CLS.
3. **No usar imágenes sin alt:** perjudica accesibilidad y SEO de imagen.
4. **No bloquear imágenes con robots.txt:** Cloudinary debe ser accesible.
