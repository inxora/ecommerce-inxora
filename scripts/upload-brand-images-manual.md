# Guía Manual: Subir Imágenes de Marcas a Supabase Storage

## Opción 1: Usar el Script Automatizado

1. **Instalar dependencias** (si no están instaladas):
```bash
npm install dotenv
```

2. **Configurar variables de entorno** en `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

3. **Crear carpeta para imágenes**:
```bash
mkdir -p public/marcas
```

4. **Colocar las imágenes** en `public/marcas/` con nombres que coincidan con:
   - El ID de la marca (ej: `1.png`, `2.jpg`)
   - O el nombre de la marca (ej: `mitutoyo.png`, `bosch.svg`)

5. **Ejecutar el script**:
```bash
node scripts/upload-brand-images.js
```

## Opción 2: Subir Manualmente desde Supabase Dashboard

1. **Ir a Supabase Dashboard** → Storage → `marcas-images`

2. **Subir las imágenes** una por una o en lote

3. **Obtener la URL pública** de cada imagen (click derecho → "Copy URL")

4. **Actualizar los registros** en la tabla `marca`:
   - Ir a Table Editor → `marca`
   - Para cada marca, actualizar el campo `logo_url` con la URL pública

## Opción 3: Usar SQL Directo

Si tienes las URLs de las imágenes, puedes actualizar directamente con SQL:

```sql
-- Ejemplo: Actualizar marca con ID 1
UPDATE marca 
SET logo_url = 'https://tu-proyecto.supabase.co/storage/v1/object/public/marcas-images/mitutoyo.png'
WHERE id = 1;

-- Actualizar múltiples marcas
UPDATE marca 
SET logo_url = CASE 
  WHEN id = 1 THEN 'https://tu-proyecto.supabase.co/storage/v1/object/public/marcas-images/mitutoyo.png'
  WHEN id = 2 THEN 'https://tu-proyecto.supabase.co/storage/v1/object/public/marcas-images/bosch.png'
  WHEN id = 3 THEN 'https://tu-proyecto.supabase.co/storage/v1/object/public/marcas-images/fluke.png'
  -- Agregar más casos según necesites
END
WHERE id IN (1, 2, 3);
```

## Estructura de la URL

La URL pública de Supabase Storage sigue este formato:
```
https://[PROJECT_ID].supabase.co/storage/v1/object/public/[BUCKET_NAME]/[FILE_NAME]
```

Ejemplo:
```
https://keeussaqlshdsegerqob.supabase.co/storage/v1/object/public/marcas-images/mitutoyo.png
```

## Verificar que Funciona

Después de subir las imágenes, verifica que:

1. Las imágenes son accesibles públicamente (abre la URL en el navegador)
2. Los registros en la tabla `marca` tienen el campo `logo_url` actualizado
3. Las imágenes se muestran correctamente en el carrusel de marcas

## Permisos del Bucket

Asegúrate de que el bucket `marcas-images` tenga:
- **Public**: Habilitado (para acceso público a las imágenes)
- **File size limit**: Configurado según tus necesidades
- **Allowed MIME types**: `image/png`, `image/jpeg`, `image/svg+xml`, `image/webp`

## Troubleshooting

### Error: "new row violates row-level security policy"
- Verifica que tienes permisos de escritura en la tabla `marca`
- O usa el `SUPABASE_SERVICE_ROLE_KEY` en lugar de la anon key

### Error: "The resource already exists"
- El archivo ya existe en el storage
- El script usa `upsert: true` para sobrescribir, pero puedes eliminarlo manualmente primero

### Las imágenes no se muestran
- Verifica que la URL es pública y accesible
- Verifica que el campo `logo_url` en la BD tiene el valor correcto
- Revisa la consola del navegador para errores de CORS

