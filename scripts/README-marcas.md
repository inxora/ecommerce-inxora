# 📸 Guía: Subir Imágenes de Marcas a Supabase

## Resumen Rápido

Tu aplicación ya está configurada para mostrar logos de marcas desde el campo `logo_url` de la tabla `marca`. Solo necesitas:

1. **Subir las imágenes** al bucket `marcas-images` en Supabase Storage
2. **Actualizar el campo `logo_url`** en cada registro de la tabla `marca` con la URL pública

## Método Recomendado: Dashboard de Supabase

### Paso 1: Subir Imágenes al Storage

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **Storage** → **marcas-images**
3. Haz clic en **"Upload file"** o **"Upload folder"**
4. Sube todas las imágenes de marcas
5. **Importante**: Asegúrate de que el bucket sea **público**:
   - Ve a **Storage** → **marcas-images** → **Settings**
   - Activa **"Public bucket"**

### Paso 2: Obtener URLs Públicas

Para cada imagen subida:

1. Haz clic derecho en la imagen
2. Selecciona **"Copy URL"** o **"Get public URL"**
3. La URL será algo como:
   ```
   https://[tu-proyecto].supabase.co/storage/v1/object/public/marcas-images/mitutoyo.png
   ```

### Paso 3: Actualizar Registros en la Base de Datos

1. Ve a **Table Editor** → **marca**
2. Para cada marca:
   - Haz clic en el registro
   - Actualiza el campo `logo_url` con la URL pública de la imagen
   - Guarda los cambios

## Método Alternativo: Script Automatizado

Si tienes muchas marcas, puedes usar el script automatizado:

### Requisitos Previos

1. Instalar `dotenv` (si no está instalado):
```bash
npm install dotenv --save-dev
```

2. Crear carpeta para imágenes:
```bash
mkdir -p public/marcas
```

3. Colocar las imágenes en `public/marcas/` con nombres que coincidan:
   - **Por ID**: `1.png`, `2.jpg` (donde 1, 2 son los IDs de las marcas)
   - **Por nombre**: `mitutoyo.png`, `bosch.svg` (el script intentará hacer match)

4. Configurar variables de entorno en `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

5. Ejecutar el script:
```bash
node scripts/upload-brand-images.js
```

## Estructura de Datos

La tabla `marca` tiene estos campos relevantes:

```typescript
interface Marca {
  id: number
  nombre: string
  logo_url: string  // ← Aquí va la URL de la imagen
  activo: boolean
  // ... otros campos
}
```

## Formato de URLs

Las URLs de Supabase Storage siguen este patrón:

```
https://[PROJECT_ID].supabase.co/storage/v1/object/public/[BUCKET_NAME]/[FILE_NAME]
```

Ejemplo real:
```
https://keeussaqlshdsegerqob.supabase.co/storage/v1/object/public/marcas-images/mitutoyo.png
```

## Verificación

Después de subir las imágenes:

1. ✅ Verifica que las URLs son accesibles (ábrelas en el navegador)
2. ✅ Verifica que los registros tienen `logo_url` actualizado
3. ✅ Revisa el carrusel de marcas en la página de categorías

## Troubleshooting

### Las imágenes no se muestran

- **Verifica la URL**: Abre la URL directamente en el navegador
- **Verifica el bucket**: Debe ser público
- **Verifica el campo**: El campo `logo_url` debe tener la URL completa
- **Revisa la consola**: Busca errores de CORS o 404

### Error de permisos

- Usa `SUPABASE_SERVICE_ROLE_KEY` en lugar de la anon key
- Verifica que tienes permisos de escritura en la tabla `marca`

### El script no encuentra las marcas

- Verifica que los nombres de archivo coinciden con los nombres o IDs de las marcas
- Revisa que las marcas están activas (`activo = true`)

## Notas Importantes

- **Formato de imágenes**: PNG, JPG, SVG, WebP son soportados
- **Tamaño recomendado**: 200x200px o similar (el código las redimensiona)
- **Nombres de archivo**: Usa nombres descriptivos y sin espacios
- **Backup**: Haz backup de tus datos antes de actualizar en lote

