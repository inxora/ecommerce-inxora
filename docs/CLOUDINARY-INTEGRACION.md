# Integración de Cloudinary (plan Free) – FastAPI + Next.js

Guía paso a paso para servir imágenes de categorías (y opcionalmente marcas/productos) desde Cloudinary. Cuenta ya creada, plan free.

---

## 1. Obtener credenciales en Cloudinary

1. Entra a [Cloudinary Dashboard](https://console.cloudinary.com/).
2. En la página principal verás:
   - **Cloud name**: p. ej. `dxample123`
   - **API Key**: número como `123456789012345`
   - **API Secret**: haz clic en "Reveal" para verlo (guárdalo solo en variables de entorno, nunca en el código ni en el repo).

3. **Upload preset (opcional)**  
   Si quieres subir desde el frontend sin firmar:
   - **Settings** → **Upload** → **Upload presets** → **Add upload preset**.
   - Nombre: p. ej. `categorias_inxora`.
   - **Signing Mode**: "Unsigned" solo si vas a subir desde el navegador; para subir desde FastAPI no es necesario.

Anota:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## 2. Variables de entorno

### Backend (FastAPI)

En tu `.env` o configuración de entorno del proyecto FastAPI:

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

Nunca subas estos valores al repositorio. Usa un archivo `.env` en `.gitignore` o variables de entorno del servidor.

### Frontend (Next.js) – opcional

Solo si en el frontend vas a **construir URLs de Cloudinary a mano** (p. ej. para transformaciones):

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
```

En este proyecto las URLs vienen completas desde la API, así que con añadir el dominio en `next.config.mjs` suele bastar.

---

## 3. Subir imágenes a Cloudinary

### Opción A: Desde el Dashboard (rápido para pocas imágenes)

1. **Media Library** → **Upload**.
2. Sube las imágenes de categorías (y marcas si aplica).
3. Puedes organizar en carpetas, p. ej. `categorias`, `marcas`.
4. Tras subir, cada asset tiene una **URL** (p. ej. `https://res.cloudinary.com/tu_cloud/image/upload/v1234567890/categorias/nombre.jpg`). Esa URL es la que guardarás en tu base de datos.

### Opción B: Desde FastAPI (Python)

1. Instala el SDK:

```bash
pip install cloudinary
```

2. Configura (una vez al arranque de la app, p. ej. en `main.py` o un módulo `config`):

```python
import cloudinary
import cloudinary.uploader
import os

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)
```

3. Subir una imagen (ejemplo para categoría):

```python
import cloudinary.uploader

def subir_imagen_categoria(archivo_path: str, nombre_categoria: str, id_categoria: int):
    result = cloudinary.uploader.upload(
        archivo_path,
        folder="categorias",
        public_id=f"cat_{id_categoria}_{nombre_categoria.lower().replace(' ', '_')}",
        overwrite=True,
    )
    return result["secure_url"]  # URL para guardar en BD
```

4. Guardar la URL en tu base de datos en el campo `logo_url` de la tabla de categorías (o el que uses). La API que sirve el árbol de navegación debe devolver esa URL tal cual.

---

## 4. Exponer la URL de Cloudinary en la API (FastAPI)

- El endpoint que ya usas para **árbol de navegación** (p. ej. `/api/test/ecommerce/arbol-navegacion`) debe devolver en cada categoría un campo `logo_url` con la **URL completa** de Cloudinary, por ejemplo:

  `https://res.cloudinary.com/tu_cloud/image/upload/v1234567890/categorias/cat_1_herramientas.jpg`

- No hace falta que FastAPI redirija ni proxee la imagen; el frontend usará esa URL directamente en `<Image src={category.logo_url} />`.

- Si también quieres usar Cloudinary para **marcas**, el mismo endpoint (o el que devuelve marcas) debe incluir `logo_url` con la URL de Cloudinary para cada marca. En el frontend ya se usa `buildBrandLogoUrl(brand.logo_url)`; si `logo_url` es una URL completa (http/https), se devuelve tal cual, así que las URLs de Cloudinary funcionarán sin cambios.

Resumen:
1. En tu BD, actualiza `logo_url` de categorías (y marcas) con las URLs de Cloudinary.
2. Asegúrate de que tu endpoint de arbol-navegacion (y el de marcas si aplica) devuelve ese `logo_url` en la respuesta JSON.

---

## 5. Next.js: permitir imágenes de Cloudinary

En este proyecto ya está añadido el dominio de Cloudinary en la configuración de imágenes:

- **next.config.mjs** → `images.remotePatterns` incluye:

  ```js
  {
    protocol: 'https',
    hostname: 'res.cloudinary.com',
    pathname: '/**',
  }
  ```

Así, `<Image src={url_de_cloudinary} />` funciona sin error de dominio no permitido.

- Las categorías en el home usan `category.logo_url` directamente.
- Las marcas usan `buildBrandLogoUrl(brand.logo_url)`; si `logo_url` es una URL completa (p. ej. Cloudinary), se devuelve tal cual.

No hace falta usar `unoptimized` para Cloudinary; Next.js puede optimizar las imágenes de ese dominio. Si en el futuro quieres servir todo desde Cloudinary con transformaciones (y ahorrar cuota de Vercel), se puede usar un loader custom de Cloudinary (opcional).

---

## 6. Checklist rápido

| Paso | Dónde | Acción |
|------|--------|--------|
| 1 | Cloudinary Dashboard | Anotar Cloud name, API Key, API Secret |
| 2 | FastAPI `.env` | Añadir `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| 3 | Cloudinary | Subir imágenes (Dashboard y/o script FastAPI) y copiar URLs |
| 4 | Base de datos | Actualizar `logo_url` de categorías (y marcas) con URLs de Cloudinary |
| 5 | FastAPI | Verificar que arbol-navegacion (y marcas) devuelven `logo_url` en el JSON |
| 6 | Next.js | Ya configurado: `res.cloudinary.com` en `next.config.mjs` |

---

## 7. URLs de ejemplo

- **Imagen subida sin transformación:**  
  `https://res.cloudinary.com/tu_cloud/image/upload/v1234567890/categorias/cat_1_herramientas.jpg`

- **Con transformación (opcional):**  
  `https://res.cloudinary.com/tu_cloud/image/upload/w_400,h_400,c_fill/v1234567890/categorias/cat_1_herramientas.jpg`  
  (width 400, height 400, crop fill). Puedes construir estas URLs en FastAPI o en el frontend si añades `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.

Con esto, las imágenes de categorías (y marcas si actualizas sus `logo_url`) se sirven desde Cloudinary y se muestran correctamente en el frontend.
