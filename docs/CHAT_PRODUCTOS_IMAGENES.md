# Cómo comprobar si las imágenes de productos en el chat son thumbnail

Cuando Sara muestra productos en el chat (ej.: "busca interruptores Schneider"), las fotos deben verse **pequeñas** (thumbnail). Esta guía sirve para verificar que así sea.

---

## 1. Backend (orquestador / Sara)

Las llamadas a **GET /api/test/productos/** que hace el orquestador deben incluir el query param:

```
imagen_tamano=thumbnail
```

**Cómo comprobarlo:**

- **Pestaña Network (DevTools):** Al enviar un mensaje tipo "busca interruptores Schneider", revisar si aparece una petición a `/api/test/productos/` (o al proxy que use el backend). En la URL debe verse `imagen_tamano=thumbnail`.
- **Logs del backend:** Si tienes acceso a los logs del servicio que orquesta a Sara, buscar las requests a productos y comprobar que envían `imagen_tamano=thumbnail`.

Si ese parámetro **no** está en la request, el backend está pidiendo imágenes a tamaño completo y puede afectar rendimiento y tamaño de respuesta.

---

## 2. Respuesta del backend

En la respuesta JSON del endpoint de productos, el campo:

- `data.productos[].imagen_principal_url`

debe contener la transformación de Cloudinary para thumbnail, por ejemplo:

- `/upload/w_200,c_limit,f_auto,q_auto:good/`  
  (o similar: `w_200`, `c_limit`, etc.)

**Cómo comprobarlo:**

- En Network, abrir la respuesta de la request a productos y revisar `data.productos[0].imagen_principal_url` (o cualquier índice).
- Si la URL incluye algo como `w_200,c_limit`, el backend **sí** está devolviendo thumbnail.

Si la URL no tiene esa transformación, el backend no está aplicando thumbnail al generar las URLs (revisar implementación del endpoint cuando recibe `imagen_tamano=thumbnail`).

---

## 3. En el chat (frontend)

Al pedir productos a Sara, las fotos en el chat deben verse **pequeñas**, no a tamaño completo.

**Comportamiento actual:**

- El chat **no** llama directamente a `/api/test/productos/`. Las imágenes que muestra vienen **dentro del mensaje** que devuelve el backend (Sara): el orquestador llama a productos, arma el mensaje (p. ej. Markdown con URLs de imagen) y lo devuelve al frontend.
- El frontend renderiza ese mensaje (ReactMarkdown) y aplica un **tamaño máximo** a las imágenes (p. ej. 200px) para que, incluso si la URL fuera a tamaño completo, no se vean enormes en el chat.

**Resumen de verificación:**

| Dónde | Qué comprobar |
|-------|----------------|
| **Request a productos** | Que incluya `imagen_tamano=thumbnail`. |
| **URL en la respuesta** | Que `imagen_principal_url` contenga `w_200,c_limit` (o similar). |
| **Vista en el chat** | Que las fotos de productos se vean pequeñas (el frontend limita el tamaño de todas las imágenes en las respuestas del asistente). |

Si la request incluye `imagen_tamano=thumbnail` y la URL contiene `w_200,c_limit`, se están usando thumbnails correctamente. Si no, revisar que el orquestador use ese parámetro y que el endpoint de productos devuelva URLs con la transformación; el frontend del chat ya limita el tamaño de visualización de las imágenes.
