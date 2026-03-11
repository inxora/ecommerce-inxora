# Flujo Google Maps + Ubigeo para Clientes y Ecommerce

## Objetivo
Documentar el flujo actual de `ClientesForm.tsx` para reutilizarlo en el ecommerce durante la venta, especialmente para:

- autocompletar direcciones
- confirmar punto de entrega en mapa
- resolver `id_distrito` y `ubigeo`
- guardar dirección fiscal y dirección de entrega

## Resumen Ejecutivo
El flujo actual mezcla 3 fuentes:

1. `SUNAT`
Obtiene razón social, dirección legal y textos de ubicación (`departamento`, `provincia`, `distrito`, `ubigeo`).

2. `Google Maps`
Se usa para búsqueda de direcciones y confirmación del punto exacto de entrega con coordenadas.

3. `BD interna`
Se usa para convertir textos de ubicación a IDs internos (`id_ciudad`, `id_provincia`, `id_distrito`) y a `ubigeo` válido para logística/SUNAT.

## Componentes involucrados

- `src/components/Clientes/ClientesForm.tsx`
- `src/components/Common/MapaSelector.tsx`
- `src/components/Common/InputDireccionPlaces.tsx`
- `src/lib/api/services/geocodificacion.service.ts`
- `src/config/api.ts`

## Qué carga realmente Google Maps
El mapa visual no sale de un endpoint backend.

Se carga directo con la librería JS de Google usando:

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

Esto ocurre en `MapaSelector.tsx`.

## Endpoints usados

### 1. Consulta RUC
- `GET /api/clientes/consultar-ruc/{ruc}`

Uso:
- obtener datos legales de SUNAT
- precargar razón social y dirección fiscal
- recuperar textos de ubicación para intentar match con la BD

### 2. Buscar ubicación en BD por texto
- `POST /api/clientes/buscar-ubicacion`

Body:

```json
{
  "distrito_texto": "Miraflores",
  "provincia_texto": "Lima",
  "departamento_texto": "Lima"
}
```

Uso:
- convertir textos a `id_ciudad`, `id_provincia`, `id_distrito`
- recuperar `ubigeo`
- alinear SUNAT o Google con el catálogo interno

### 3. Autocomplete de direcciones
- `GET /api/google-maps/autocomplete?q=...&limit=...`

Uso:
- sugerencias de direcciones mientras el usuario escribe

### 4. Geocodificación inversa
- `POST /api/google-maps/geocodificar-inversa`

Body:

```json
{
  "lat": -12.121212,
  "lng": -77.030303
}
```

Uso:
- convertir coordenadas a dirección corta
- recuperar `distrito`, `provincia`, `departamento`
- luego intentar match contra la BD con `buscar-ubicacion`

## Flujo actual en Clientes

### Caso A: empresa Perú con RUC

1. Usuario ingresa RUC.
2. `ClientesForm.tsx` llama `GET /api/clientes/consultar-ruc/{ruc}`.
3. SUNAT devuelve:
   - razón social
   - dirección
   - distrito
   - provincia
   - departamento
   - ubigeo
4. El formulario guarda esa dirección como fiscal:
   - `origen_sunat = true`
   - `tipo_direccion = FISCAL`
   - `direccion_confirmada = false`
   - sin coordenadas
5. Luego llama `POST /api/clientes/buscar-ubicacion`.
6. Si encuentra match:
   - completa `id_ciudad`
   - completa `id_provincia`
   - completa `id_distrito`
   - completa `ubigeo`
7. Si el usuario abre el mapa y confirma un punto:
   - se guarda aparte como dirección de entrega
   - con `latitud`, `longitud`, `direccion_confirmada = true`

### Caso B: confirmación en mapa

1. Usuario abre `MapaSelector`.
2. Puede buscar dirección o mover el pin.
3. Si escribe:
   - `InputDireccionPlaces` llama `GET /api/google-maps/autocomplete`
4. Si elige sugerencia, hace clic en mapa, arrastra pin o usa "Mi ubicación":
   - `MapaSelector` llama `POST /api/google-maps/geocodificar-inversa`
5. Esa respuesta entrega:
   - `direccion`
   - `distrito`
   - `provincia`
   - `departamento`
6. Al confirmar, `ClientesForm.tsx` vuelve a llamar:
   - `POST /api/clientes/buscar-ubicacion`
7. Si hay match:
   - obtiene `id_distrito`
   - obtiene `ubigeo`
8. Se guarda la dirección de entrega con:
   - `direccion`
   - `latitud`
   - `longitud`
   - `id_distrito`
   - `ubigeo`
   - `direccion_confirmada = true`

## Qué se guarda hoy

### Dirección fiscal
Fuente:
- SUNAT para Perú
- texto libre para otros países

Regla:
- representa el domicilio legal / facturación
- no necesita coordenadas

Campos típicos:

```json
{
  "nombre_direccion": "Domicilio Fiscal",
  "direccion_linea1": "AV. EJEMPLO 123",
  "direccion": "AV. EJEMPLO 123",
  "id_distrito": 150122,
  "ubigeo": "150122",
  "tipo_direccion": "FISCAL",
  "origen_sunat": true,
  "es_direccion_facturacion": true
}
```

### Dirección de entrega
Fuente:
- mapa confirmado por el usuario

Regla:
- representa el punto logístico real
- sí debe llevar coordenadas

Campos típicos:

```json
{
  "nombre_direccion": "Punto de Entrega Principal",
  "direccion_linea1": "Calle Los Ejemplos 456",
  "direccion": "Calle Los Ejemplos 456",
  "id_distrito": 150122,
  "ubigeo": "150122",
  "tipo_direccion": "ENTREGA",
  "origen_sunat": false,
  "latitud": -12.121212,
  "longitud": -77.030303,
  "direccion_confirmada": true
}
```

## Cómo aplicarlo al ecommerce para la venta

### Recomendación principal
En ecommerce no mezclar:

- dirección fiscal
- dirección de entrega

Debe existir una UX separada:

1. `Facturación`
- datos legales
- RUC/DNI
- dirección fiscal

2. `Entrega`
- dirección operativa real
- punto confirmado en mapa
- coordenadas
- ubigeo e `id_distrito`

### Flujo recomendado para checkout

1. El cliente ingresa o selecciona su dirección.
2. El sistema muestra autocomplete con:
   - `GET /api/google-maps/autocomplete`
3. El cliente confirma en mapa.
4. El frontend obtiene coordenadas y dirección administrativa con:
   - `POST /api/google-maps/geocodificar-inversa`
5. El frontend intenta resolver `id_distrito` y `ubigeo` con:
   - `POST /api/clientes/buscar-ubicacion`
6. Si encuentra match:
   - guardar `id_distrito`
   - guardar `ubigeo`
7. Si no encuentra match:
   - guardar igual coordenadas y dirección
   - marcar el registro como pendiente de normalización

## Reglas sugeridas para ecommerce

- No exigir RUC para poder seleccionar dirección de entrega.
- Sí exigir confirmación en mapa cuando el pedido requiera despacho.
- Si hay `id_distrito` + `ubigeo`, usarlo como base para:
  - reglas de reparto
  - cálculo logístico
  - guías de remisión
- Si solo hay coordenadas pero no `ubigeo`:
  - permitir guardar
  - marcar como dirección útil para despacho, pero no totalmente normalizada para procesos SUNAT/GRE

## Diferencia entre match BD y Google

### Google
Sirve para:
- UX de búsqueda
- mapa
- coordenadas
- validación visual

### BD interna
Sirve para:
- IDs del sistema
- ubigeo estándar
- integraciones logísticas y tributarias

Conclusión:
- Google no reemplaza tu catálogo interno
- Google da precisión geográfica
- la BD da normalización operativa y tributaria

## Flujo recomendado final para ecommerce

```text
Usuario escribe dirección
-> autocomplete Google
-> selecciona sugerencia / mueve pin
-> geocodificación inversa
-> obtiene distrito/provincia/departamento
-> buscar-ubicacion en BD
-> obtiene id_distrito + ubigeo
-> guardar dirección de entrega confirmada
```

## Casos borde a contemplar

- Google encuentra dirección, pero `buscar-ubicacion` no encuentra `ubigeo`
- SUNAT devuelve textos con variantes ortográficas
- el usuario cambia manualmente la dirección después de consultar SUNAT
- cliente fuera de Perú
- cliente en Perú con dirección fiscal válida, pero con punto de entrega distinto

## Recomendación técnica para implementación en ecommerce

- Reutilizar `MapaSelector.tsx`
- Reutilizar `InputDireccionPlaces.tsx`
- Reutilizar `geocodificacion.service.ts`
- Reutilizar `POST /api/clientes/buscar-ubicacion`
- Modelar en checkout dos bloques:
  - `direccion_facturacion`
  - `direccion_entrega`

## Checklist de implementación

- Crear bloque de dirección de entrega en checkout
- Agregar botón `Seleccionar ubicación en mapa`
- Consumir `GET /api/google-maps/autocomplete`
- Consumir `POST /api/google-maps/geocodificar-inversa`
- Consumir `POST /api/clientes/buscar-ubicacion`
- Guardar `latitud`, `longitud`, `id_distrito`, `ubigeo`
- Diferenciar fiscal vs entrega
- Permitir fallback sin ubigeo, pero con bandera de normalización pendiente

## Conclusión
El flujo actual de `ClientesForm.tsx` ya resuelve bien el problema real:

- SUNAT para lo legal
- Google para lo geográfico
- BD interna para lo operativo/tributario

Para ecommerce, lo recomendable es replicar exactamente esa misma lógica, pero separando claramente:

- datos de facturación
- datos de entrega

Así la venta queda lista tanto para experiencia de usuario como para logística y documentos posteriores.
