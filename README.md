# INXORA Ecommerce

Plataforma e-commerce B2B construida con Next.js y Tailwind CSS. Este repositorio contiene el frontend de INXORA con catálogo de productos, carrito, checkout y soporte multilenguaje.

## Características
- Next.js App Router (v13+)
- Tailwind CSS
- Internacionalización (middleware y `messages/`)
- Carrito de compras con estado persistente (`hooks/use-cart.ts`)
- Checkout y resumen de pedido
- Componentes reutilizables (UI y módulos de catálogo/producto)

## Requisitos
- Node.js 18+ (recomendado 20)
- npm o pnpm

## Instalación
```
npm install
```

## Variables de entorno
Crea un archivo `.env.local` con tus credenciales necesarias. Ejemplo:
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL="<tu_url>"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<tu_key>"
```

Consulta `lib/supabase.ts` y `messages/*.json` para revisar dependencias de configuración.

## Desarrollo
```
npm run dev
```
Servidor de desarrollo: `http://localhost:3001`

## Build
```
npm run build
npm run start
```

## Estructura principal
```
app/
components/
hooks/
lib/
messages/
public/
```

## Publicación en GitHub
1. Configura tu identidad de Git:
   ```
   git config --global user.name "inxora"
   git config --global user.email "inxora.global@gmail.com"
   git config --global init.defaultBranch main
   ```
2. Inicializa el repositorio:
   ```
   git init
   git add .
   git commit -m "feat: initial commit"
   ```
3. Agrega el remoto y realiza push:
   ```
   git remote add origin https://github.com/inxora/ecommerce-inxora.git
   git branch -M main
   git push -u origin main
   ```

## Scripts disponibles
- `dev`: inicia servidor de desarrollo
- `build`: compila producción
- `start`: ejecuta servidor de producción

## Licencia
Uso interno INXORA. Contacto: `inxora.global@gmail.com`.