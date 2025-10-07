# 🛒 E-COMMERCE INXORA - Prompt Universal

## 📋 CONTEXTO DEL PROYECTO

Crear front-end de tienda e-commerce B2B para **INXORA** (marketplace de suministros industriales en Perú/LatAm).

**Sitio actual:** https://inxora.com  
**Nueva tienda:** https://tiendaindustrial.inxora.com

---

## 🎨 IDENTIDAD DE MARCA

**Colores oficiales:**
```
Azul oscuro primario: #171D4C
Celeste acento: #139ED4
Fucsia: #D90E8C
Morado: #771A53
Aqua: #88D4E4
```

**Estilo:** B2B moderno, minimalista, técnico, confiable.

---

## 🛠️ STACK TÉCNICO

```
Framework: Next.js 14+ App Router
UI: Tailwind CSS + shadcn/ui
Base de datos: Supabase (lectura)
Multi-idioma: ES, EN, PT
Deploy: Vercel
```

---

## 📊 ESTRUCTURA DE BASE DE DATOS

### Tabla: categoria
```
id → bigint (PK)
nombre → varchar(100)
descripcion → varchar(300)
activo → boolean
fecha_creacion → timestamp
```

### Tabla: marca
```
id → bigint (PK)
codigo → varchar(20) UNIQUE
nombre → varchar(100)
descripcion → varchar(300)
logo_url → varchar(300)
sitio_web → varchar(200)
pais_origen → varchar(3)
activo → boolean
fecha_creacion → timestamp
```

### Tabla: producto
```
sku → bigint (PK)
sku_producto → varchar(50) UNIQUE
nombre → varchar(150)
descripcion_corta → varchar(300)
descripcion_detallada → text
especificaciones_tecnicas → text
aplicaciones → text
id_categoria → bigint (FK → categoria.id)
id_marca → bigint (FK → marca.id)
precio_referencia → numeric(12,2)
imagen_principal_url → varchar(500)
galeria_imagenes_urls → text[]
seo_title → varchar(60)
seo_description → varchar(160)
seo_keywords → text
seo_slug → varchar(100) UNIQUE
canonical_url → varchar(300)
structured_data → jsonb
tags → text[]
es_destacado → boolean
es_novedad → boolean
activo → boolean
visible_web → boolean
```

**⚠️ REGLA CRÍTICA:** Solo mostrar productos donde `activo = true` AND `visible_web = true`

---

## 🏗️ ESTRUCTURA DEL SITIO

```
/[locale]/
├── / → Home (productos destacados)
├── /catalogo → Listado completo
├── /producto/[slug] → Detalle de producto
├── /carrito → Carrito de compras
├── /checkout → Proceso de compra
├── /confirmacion/[orderId] → Confirmación de pedido
├── /contacto
├── /faq
├── /terminos
└── /privacidad
```

---

## ⚙️ FUNCIONALIDADES REQUERIDAS

### 1. CATÁLOGO DE PRODUCTOS
- Grid responsive de productos
- Filtros: categoría, marca, tags
- Búsqueda por nombre (usar trigram similarity)
- Paginación (20 items por página)
- Orden: Relevancia, Nombre A-Z, Destacados

### 2. FICHA DE PRODUCTO
**Ruta:** `/producto/[seo_slug]`

Mostrar:
- Galería de imágenes (principal + secundarias)
- Nombre y descripciones (corta + detallada)
- Especificaciones técnicas
- Aplicaciones
- Marca y categoría con enlaces
- Botón "Añadir al carrito"
- Botón "Consultar por WhatsApp"

**SEO:**
- Meta tags desde DB (`seo_title`, `seo_description`)
- Canonical URL
- JSON-LD Schema Product
- Open Graph + Twitter Card

### 3. CARRITO DE COMPRAS
- Persistencia en **localStorage**
- Añadir/editar cantidad/eliminar items
- Drawer lateral en mobile
- Resumen con subtotales
- CTA a checkout

### 4. CHECKOUT (SIN PAGO ONLINE)

**Formulario del cliente:**
```typescript
{
  empresa: string
  ruc?: string (opcional)
  nombre: string
  email: string
  telefono: string
  direccion: string
  metodoPago: 'transferencia' | 'yape' | 'plin'
}
```

**Al confirmar pedido:**
1. Generar Order ID único (ej: ORD-20250929-001)
2. Enviar email a operaciones con detalle
3. Enviar email al cliente con instrucciones de pago
4. Enviar webhook POST al VPS interno
5. Mostrar página de confirmación con:
   - Número de pedido
   - Instrucciones de pago según método
   - Datos bancarios (Banco BCP - usar placeholders)
   - Botón para contactar por WhatsApp

### 5. WHATSAPP FLOTANTE
- Botón fijo en esquina inferior derecha
- Visible en todas las páginas
- Deep link con contexto:
  - Desde producto: `?text=Hola Sara, consulta sobre [NOMBRE_PRODUCTO]`
  - Desde confirmación: `?text=Hola Sara, pedido #[ORDER_ID]`
- Número configurable por variable de entorno

### 6. MULTI-IDIOMA
Español (default), Inglés, Portugués
- Selector de idioma en header
- Rutas: `/es/...`, `/en/...`, `/pt/...`
- Traducciones para UI (no productos, esos vienen de DB)

### 7. PÁGINAS INFORMATIVAS
- Contacto (formulario + mapa + WhatsApp)
- FAQ (preguntas frecuentes)
- Términos y Condiciones
- Política de Privacidad
- Política de Envíos y Devoluciones

---

## 🔌 INTEGRACIONES

### Supabase (Lectura)
Cliente inicializado con variables de entorno:
```typescript
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Query ejemplo - Listar productos:**
```typescript
supabase
  .from('producto')
  .select(`
    sku, nombre, descripcion_corta, precio_referencia,
    imagen_principal_url, seo_slug,
    marca:id_marca(nombre, logo_url),
    categoria:id_categoria(nombre)
  `)
  .eq('activo', true)
  .eq('visible_web', true)
  .order('es_destacado', { ascending: false })
  .range(0, 19)
```

**Query ejemplo - Producto por slug:**
```typescript
supabase
  .from('producto')
  .select(`*, marca:id_marca(*), categoria:id_categoria(*)`)
  .eq('seo_slug', slug)
  .eq('activo', true)
  .eq('visible_web', true)
  .single()
```

### Email (Resend)
Variable de entorno:
```typescript
RESEND_API_KEY
EMAIL_FROM="Pedidos INXORA <no-reply@inxora.com>"
EMAIL_OPS_TO="operaciones@inxora.com"
```

### Webhook a VPS
```typescript
ORDERS_WEBHOOK_URL="https://inxora.com/api/orders/webhook"
ORDERS_WEBHOOK_TOKEN="[token_secreto]"
```

**Payload JSON:**
```json
{
  "order_id": "ORD-20250929-001",
  "created_at": "2025-09-29T10:30:00Z",
  "customer": {
    "empresa": "Empresa XYZ",
    "ruc": "20123456789",
    "nombre": "Juan Pérez",
    "email": "juan@empresa.com",
    "telefono": "+51987654321",
    "direccion": "Av. Industrial 123"
  },
  "items": [
    {
      "sku": "12345",
      "nombre": "Válvula industrial",
      "cantidad": 2,
      "precio": 150.00
    }
  ],
  "payment_method": "transferencia",
  "total": 300.00,
  "currency": "PEN",
  "status": "PENDING_PAYMENT"
}
```

### WhatsApp
```typescript
WHATSAPP_NUMBER="+51XXXXXXXXX"
```

---

## 🎨 COMPONENTES UI (shadcn/ui)

Incluir estos componentes:
```bash
button, card, input, select, textarea, 
dialog, sheet, toast, badge, tabs, 
separator, label, checkbox
```

**Configuración Tailwind:**
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'inxora': {
        blue: '#171D4C',
        cyan: '#139ED4',
        pink: '#D90E8C',
        purple: '#771A53',
        aqua: '#88D4E4'
      }
    }
  }
}
```

---

## 📧 TEMPLATE EMAIL CONFIRMACIÓN

**Asunto:** `✅ Pedido confirmado #[ORDER_ID] - INXORA`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Confirmación de Pedido</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #171D4C; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">INXORA</h1>
    <p style="color: #139ED4; margin: 5px 0;">Suministros Industriales</p>
  </div>
  
  <div style="padding: 30px 20px;">
    <h2>¡Gracias por tu pedido, [NOMBRE]!</h2>
    
    <p>Tu pedido <strong>#[ORDER_ID]</strong> ha sido registrado exitosamente.</p>
    
    <h3>📦 Resumen del pedido:</h3>
    <table style="width: 100%; border-collapse: collapse;">
      [ITEMS_HTML]
    </table>
    
    <p style="text-align: right; font-size: 18px; font-weight: bold;">
      Total: S/ [TOTAL]
    </p>
    
    <h3>💳 Instrucciones de pago:</h3>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
      [PAYMENT_INSTRUCTIONS]
    </div>
    
    <p>Una vez realizado el pago, envía tu comprobante por WhatsApp:</p>
    <a href="https://wa.me/[PHONE]?text=Hola Sara, adjunto comprobante del pedido #[ORDER_ID]" 
       style="display: inline-block; background: #25D366; color: white; padding: 12px 24px; 
              text-decoration: none; border-radius: 5px; margin: 10px 0;">
      📱 Enviar comprobante
    </a>
  </div>
  
  <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
    <p>INXORA - Marketplace B2B de Suministros Industriales</p>
    <p>Lima, Perú | contacto@inxora.com</p>
  </div>
</body>
</html>
```

---

## ✅ SEO REQUIREMENTS

### Por cada producto:
- `<title>` desde `seo_title` de DB
- `<meta name="description">` desde `seo_description`
- `<link rel="canonical">` desde `canonical_url`
- JSON-LD Product Schema con datos del producto

### General:
- Sitemap.xml dinámico con todos los productos activos
- robots.txt permitiendo indexación
- Imágenes optimizadas con next/image
- Lazy loading para galería de productos
- Core Web Vitals > 85 mobile, > 90 desktop

---

## 🔒 VARIABLES DE ENTORNO (.env.example)

```env
# Supabase (NO COMPARTIR VALORES REALES)
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM="Pedidos INXORA <no-reply@inxora.com>"
EMAIL_OPS_TO="operaciones@inxora.com"

# Webhook interno
ORDERS_WEBHOOK_URL=https://inxora.com/api/orders/webhook
ORDERS_WEBHOOK_TOKEN=secret_token_here

# WhatsApp
WHATSAPP_NUMBER="+51987654321"

# Idiomas
NEXT_PUBLIC_DEFAULT_LOCALE=es
NEXT_PUBLIC_SUPPORTED_LOCALES=es,en,pt
```

---

## 🚀 PROMPT EJECUTABLE DIRECTO

**Copia y pega esto en bolt.new / V0 / TRAE:**

---

Crea un e-commerce Next.js 14 App Router para **INXORA**, marketplace B2B de suministros industriales en Perú.

**Stack:** Next.js + Tailwind + shadcn/ui + Supabase (solo lectura)

**Colores de marca:**
- Azul primario: #171D4C
- Celeste acento: #139ED4
- Fucsia: #D90E8C

**Base de datos Supabase:**
- Tabla `producto`: sku, nombre, descripcion_corta, descripcion_detallada, especificaciones_tecnicas, precio_referencia, imagen_principal_url, galeria_imagenes_urls, seo_slug, seo_title, seo_description, id_categoria, id_marca, activo, visible_web
- Tabla `categoria`: id, nombre, descripcion, activo
- Tabla `marca`: id, nombre, descripcion, logo_url, activo

**Funcionalidades:**

1. **Catálogo** `/catalogo`: Grid de productos con filtros (categoría, marca), búsqueda, paginación. Solo mostrar productos con activo=true y visible_web=true.

2. **Ficha producto** `/producto/[seo_slug]`: Galería de imágenes, descripción completa, especificaciones técnicas, aplicaciones, botón añadir al carrito, botón WhatsApp. SEO completo con meta tags desde DB y JSON-LD Product.

3. **Carrito**: Persistencia localStorage, drawer en mobile, añadir/editar/eliminar items.

4. **Checkout**: Formulario (empresa, RUC opcional, nombre, email, teléfono, dirección, método de pago: transferencia/yape/plin). Sin pasarela de pago online.

5. **Confirmación**: Al confirmar pedido, generar ID único, enviar email a operaciones y cliente con instrucciones de pago, enviar webhook POST a VPS interno, mostrar página con número de pedido e instrucciones.

6. **WhatsApp flotante**: Botón fijo inferior derecha en todas las páginas con deep link contextual.

7. **Multi-idioma**: ES (default), EN, PT con selector en header.

8. **Páginas**: Contacto, FAQ, Términos, Privacidad, Envíos.

**Integraciones:**
- Supabase client con env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- Resend para emails: RESEND_API_KEY, EMAIL_FROM, EMAIL_OPS_TO
- Webhook: ORDERS_WEBHOOK_URL, ORDERS_WEBHOOK_TOKEN
- WhatsApp: WHATSAPP_NUMBER

**UI:** Usar shadcn/ui (button, card, input, select, dialog, sheet, toast, badge). Diseño minimalista B2B.

**SEO:** Meta tags dinámicos desde DB, sitemap.xml, robots.txt, imágenes optimizadas con next/image.

Genera estructura completa de carpetas, componentes principales, queries Supabase, y archivo .env.example con placeholders (NO incluir valores reales de API keys).

---

## 📝 NOTAS IMPORTANTES

### ⚠️ SEGURIDAD
- **NUNCA** compartas valores reales de API keys con la IA
- Usa placeholders en todos los ejemplos
- La IA generará `.env.example` con valores falsos
- Tú agregarás las keys reales manualmente después

### 🎯 PRIORIDADES
1. Funcionalidad > Diseño inicial
2. Código limpio y bien comentado
3. Componentes reutilizables
4. Mobile-first responsive

### 🛠️ DIFERENCIAS POR PLATAFORMA

**bolt.new:**
- Genera proyecto completo ejecutable
- Puede instalar dependencias
- Preview en vivo

**V0 by Vercel:**
- Genera componentes individuales
- Enfocado en UI/UX
- Puedes pedirle páginas específicas

**TRAE:**
- Similar a bolt.new
- Puede generar backend también
- Ideal para full-stack

### 💡 TIPS DE USO

1. **Inicio:** Usa el prompt ejecutable completo
2. **Refinamiento:** Pide ajustes específicos ("cambia el color del botón", "añade validación al formulario")
3. **Por partes:** Si es muy complejo, pide primero la estructura, luego componentes específicos
4. **Prueba y ajusta:** Genera, prueba en local, pide correcciones

---

## ✅ CHECKLIST FINAL

- [ ] Catálogo con filtros funcionando
- [ ] Ficha de producto con galería
- [ ] Carrito persistente en localStorage
- [ ] Checkout con validación
- [ ] Email de confirmación con HTML template
- [ ] Webhook POST al VPS
- [ ] Botón WhatsApp flotante
- [ ] Multi-idioma (ES/EN/PT)
- [ ] SEO: meta tags, sitemap, JSON-LD
- [ ] Mobile responsive
- [ ] .env.example incluido
- [ ] README con instrucciones

---

**¿Listo para generar tu e-commerce?** 🚀 Copia el prompt ejecutable y pégalo en la IA que elijas.