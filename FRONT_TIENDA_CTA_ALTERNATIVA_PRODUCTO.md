# Tienda web: CTA alternativa por producto

Documento para el equipo de **frontend de la tienda (ecommerce)**. Resume qué devuelve la API y qué deben implementar en UI.

---

## Contexto

En el CRM, cada producto puede tener un bloque opcional de **llamada a la acción (CTA)** para la ficha de producto:

- **Texto** encima del botón (ej. *«¿Buscas una solución todo en uno?»*)
- **Texto del botón** (ej. *«Ver soluciones DC-UPS de Adelsystem»*)
- **URL** a la que apunta el botón

Si los tres campos están vacíos en base de datos, la API los devuelve como `null`. **No mostrar** el bloque en ese caso.

La decisión de **mostrar u ocultar** el bloque y el estilo del botón es **100 % responsabilidad del front de la tienda**. La API solo expone datos.

---

## Campos en la respuesta JSON

| Campo | Tipo | Descripción |
|--------|------|-------------|
| `cta_alternativa_texto` | `string \| null` | Frase sobre el botón |
| `cta_alternativa_boton` | `string \| null` | Etiqueta del botón |
| `cta_alternativa_url` | `string \| null` | Destino del enlace (idealmente `https://...`) |

---

## Dónde vienen en la API

Base path típico: `/api/productos` (según despliegue; puede ir detrás de dominio o prefijo).

### 1. Listado / grid ecommerce (catálogo, filtros, búsqueda)

**`GET /api/productos/ecommerce`**

Cada elemento de `data.productos[]` incluye los tres campos.

Útil si en tarjetas de listado queréis mostrar un hint o el mismo CTA (no obligatorio; muchas tiendas solo lo muestran en la **ficha**).

### 2. Ficha de producto por slug SEO

**`GET /api/productos/slug/{slug}`**

El objeto `data` incluye los tres campos. Es el lugar habitual para renderizar el bloque (texto + botón enlazado).

---

## Sugerencia de lógica en la tienda

1. **Mostrar el bloque** solo si hay contenido útil para el usuario, por ejemplo:
   - `cta_alternativa_url` presente y válido **y**
   - al menos `cta_alternativa_boton` **o** `cta_alternativa_texto` (ajustad la regla a diseño).

   Ejemplo mínimo estricto:

   ```ts
   const showCta =
     Boolean(cta_alternativa_url?.trim()) &&
     Boolean(cta_alternativa_boton?.trim())
   ```

   Si preferís mostrar solo un botón sin línea de texto, podéis relajar la condición.

2. **Seguridad / UX de enlaces**
   - Abrir en nueva pestaña si es enlace externo: `target="_blank"` y `rel="noopener noreferrer"`.
   - No ejecutar `javascript:` ni datos no confiables sin validar.

3. **Contenido duplicado**
   - El texto largo del producto (`descripcion_corta` / `descripcion_detallada`) puede seguir teniendo enlaces manuales en HTML. El CTA de CRM es un bloque **aparte** y editable desde el CRM; coordinad con marketing si hay solapamiento visual.

---

## Ejemplo de estructura UI (referencia)

```text
[cta_alternativa_texto]     ← párrafo opcional

[ Botón: cta_alternativa_boton ]  → href = cta_alternativa_url
```

---

## Checklist frontend tienda

- [ ] Consumir `cta_alternativa_*` desde `/ecommerce` y/o `/slug/{slug}` según vuestras páginas.
- [ ] En ficha de producto, renderizar bloque solo cuando cumpla la regla de negocio acordada.
- [ ] Estilos alineados con el diseño (tipografía, espaciado, botón primario/secundario).
- [ ] Probar con producto **sin** CTA (`null` en los tres) → no debe romper layout ni mostrar huecos vacíos.
- [ ] Tras despliegue de API, confirmar que la versión del backend en producción ya expone estos campos (reinicio PM2 / despliegue si aplica).

---

## Referencia backend (no requerido para FE)

- Columnas en BD: `producto.cta_alternativa_texto`, `cta_alternativa_boton`, `cta_alternativa_url`.
- Edición: formulario de producto completo en CRM.

---

*Última actualización: documento orientado al consumo en tienda; los nombres de campos son estables en la API.*
