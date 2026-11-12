# Cromoverso

Frontend del álbum digital de cromos **Cromoverso**. Sitio público en español e inglés: inicio con los seis mundos, catálogo de un mundo con filtros, selector de idioma, aviso de cookies y panel de accesibilidad.

Los textos de la interfaz y los datos del catálogo salen de la API del curso. Este repositorio es el cliente (**React 19 + Vite + React Router**). El enunciado pide Next.js (App Router) con TypeScript; esa migración queda fuera de este sprint para no romper las vistas 1 y 2.

## Entrega del sprint 1

Completa estos enlaces antes de enviar:

- **Despliegue en Vercel:** https://cromoverso-frontend.vercel.app
- **Repositorio:** https://github.com/Juan122421/cromoverso
- **IA.md:** archivo en la raíz del repo (cuatro entradas; una documenta una respuesta equivocada de la IA)

## Requisitos

- Node.js 20 o superior
- npm

## Variables de entorno

Copia `.env.example` a `.env`:

```
VITE_API_URL=https://yanethm-cromoverso-api.fly.dev/api/v1
```

Vite solo expone al navegador las variables que empiezan por `VITE_`.

En Vercel: **Settings → Environment Variables** y crea `VITE_API_URL` con el mismo valor. Vuelve a desplegar después de guardarla.

## Instalar y ejecutar

```bash
npm install
npm run dev
```

La app queda en `http://localhost:5173`.

Otros scripts:

```bash
npm run build    # genera la carpeta dist
npm run preview  # sirve el build localmente
```

## API

- Base: https://yanethm-cromoverso-api.fly.dev/api/v1
- Documentación: https://yanethm-cromoverso-api.fly.dev/docs
- Contrato por vista: https://yanethm-cromoverso-api.fly.dev/docs/contrato

Cuenta de prueba (iniciar sesión es sprint 2): `laura@cromoverso.test` / `cromos2026`.

## Rutas del sprint 1

| Ruta | Vista |
| --- | --- |
| `/` | Inicio público (`GET /mundos`, `GET /rarezas`) |
| `/mundos` | Redirige al primer mundo (Ciudad Neón) |
| `/mundos/:id` | Catálogo de un mundo. Los filtros `?rareza=` y `?tipo=` se conservan en la URL |
| `/cromos/:id` | Detalle (placeholder; sprint 2) |
| `/ingresar` | Placeholder (sprint 2) |
| `/registro` | Placeholder (sprint 3) |

## Idioma y cookies

- Textos de la interfaz: `GET /textos?idioma=es` o `?idioma=en`. El catálogo no se traduce.
- `<html lang>` cambia a `es-CO` o `en`.
- Cookie `consentimiento`: `aceptado` o `rechazado`. El aviso no vuelve a salir.
- Cookie `idioma`: solo se guarda si la persona **aceptó**. Si rechaza, el sitio funciona igual y el idioma no se recuerda.

## Despliegue

El proyecto se despliega en Vercel a partir de este repositorio. `vercel.json` reescribe todas las rutas a `index.html` para que el enrutado del cliente funcione al recargar.

Framework preset: **Vite**. Build: `npm run build`. Output: `dist`.

## Estructura

```
src/
  pages/           Inicio, catálogo, páginas provisionales
  components/      Navbar, pie, botones, cromo, cookies, accesibilidad
  context/         Idioma, cookies y preferencias de accesibilidad
  hooks/           Textos y datos de la API
  services/api.js  Cliente fetch
  styles/          Tokens de Figma y estilos globales
```

## Alcance por sprint

| Sprint | Qué entra |
| --- | --- |
| 1 (este repo) | Configuración, sistema de diseño, navegación, inicio, catálogo, idioma, cookies |
| 2 | Detalle del cromo, estados de carga/error pulidos, iniciar sesión |
| 3 | Crear cuenta, verificar correo, recuperar contraseña |

## Cómo trabajar (herramientas)

Una rama y un PR por historia, commits convencionales (`feat:`, `fix:`, `chore:`):

- `US-CRO-S1-01` → `feat/hu01-config-entorno`
- `US-CRO-S1-02` → `feat/hu02-navbar-menu-footer`
- `US-CRO-S1-03` → `feat/hu03-inicio`
- `US-CRO-S1-04` → `feat/hu04-catalogo`
- `US-CRO-S1-05` → `feat/hu05-idioma`
- `US-CRO-S1-06` → `feat/hu06-cookies`
