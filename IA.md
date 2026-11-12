# IA.md — Cromoverso, sprint 1

- Repositorio: https://github.com/Juan122421/cromoverso
- Despliegue: https://cromoverso-frontend.vercel.app
- Herramientas: ChatGPT (GPT-5.6 Luna), Gemini, Cursor

---

## Entrada 1 — Explicación de Vercel y proceso de despliegue

- **Fecha:** 2026-11-11
- **Historia / archivo:** Configuración del proyecto y despliegue · `Vercel / repositorio`
- **Herramienta y modelo:** ChatGPT · GPT-5.6 Luna
- **Qué necesitaba:** Entender qué es Vercel y cuál es el proceso correcto para desplegar una aplicación web desarrollada con React/Vite.

### Prompt (resumido)

«¿Qué es Vercel y cómo hacer un despliegue?»

### Lo que respondió la IA

La IA explicó que Vercel es una plataforma para publicar aplicaciones web en internet. También describió el flujo recomendado para el proyecto:

1. Probar la aplicación localmente con `npm run dev`.
2. Comprobar que el proyecto puede generar correctamente la versión de producción con `npm run build`.
3. Subir los cambios al repositorio de GitHub mediante Git.
4. Conectar el repositorio con Vercel.
5. Importar el proyecto y comprobar la configuración de Vite.
6. Realizar el despliegue y obtener una URL pública.

También explicó que, después de conectar GitHub con Vercel, los nuevos cambios enviados al repositorio pueden generar nuevos despliegues automáticamente.

### Qué hice yo con eso

- Acepté la explicación como guía para entender el proceso de despliegue.
- Tomé como paso importante ejecutar `npm run build` antes de intentar desplegar nuevamente.
- Comprendí que primero deben corregirse los errores de compilación locales, ya que un error durante el build también puede impedir que Vercel complete el despliegue.
- Utilicé el flujo general:

```text
Desarrollo local → npm run build → GitHub → Vercel → aplicación publicada
```

### ¿La IA se equivocó?

- **No.** La respuesta se usó como explicación general de Vercel y del proceso de despliegue. En este caso no hubo que corregir a la IA.

---

## Entrada 2 — Corrección de las cartas destacadas de Inicio

- **Fecha:** 2026-11-11
- **Historia / archivo:** Sprint 1 · `src/pages/Inicio.jsx`
- **Herramienta y modelo:** ChatGPT · GPT-5.6 Luna
- **Qué necesitaba:** Modificar la sección de cartas destacadas de la portada para que el sello de la guardiana no estuviera dentro de la carta central, sino posicionado respecto al grupo completo de cartas.

### Prompt (resumido)

«A este código de Inicio.jsx agrégale este nuevo bloque de hero__cartas en el lugar correcto.»

El cambio solicitado consistía en recorrer `datos.destacados`, renderizar las cartas con `LADOS[indice]` y colocar `hero__sello` fuera de cada carta.

### Lo que respondió la IA

La IA indicó que debía reemplazar el bloque existente de:

```html
<div className="hero__cartas" aria-hidden="true">
```

por una nueva versión donde las cartas se generan mediante `datos?.destacados?.map(...)`.

También movió el sello (`span.hero__sello`) fuera de la carta central y lo dejó como elemento independiente dentro de `hero__cartas`.

### Qué hice yo con eso

- Adapté el bloque propuesto dentro de `Inicio.jsx`.
- Conservé las tres posiciones de las cartas: izquierda, centro y derecha.
- Comprobé que el sello quedara separado de las cartas en el JSX, para poder posicionarlo respecto al grupo completo mediante CSS.

### ¿La IA se equivocó?

- **No** en el enfoque del sello. La propuesta se adaptó al archivo; el posicionamiento fino se dejó en CSS.

---

## Entrada 3 — Diagnóstico de fallos de despliegue en Vercel en Pull Request #6

- **Fecha:** 2026-11-11
- **Historia / archivo:** US-CRO-S1-03 · Pull Request `#6` (`Feat/hu03 inicio`)
- **Herramienta y modelo:** Gemini
- **Qué necesitaba:** Entender por qué aparecían dos verificaciones fallidas en la interfaz del Pull Request en GitHub y cómo consultar el detalle exacto del error.

### Prompt (resumido)

«Que pueden ser esos errores» (adjuntando captura de pantalla del Pull Request `#6` donde fallan los checks `Vercel – cromoverso` y `Vercel – cromoverso-frontend` con el mensaje `Deployment has failed`).

### Lo que respondió la IA

Identificó que los errores correspondían a fallos en el despliegue automático de los entornos de vista previa de Vercel (`cromoverso` y `cromoverso-frontend`) para esa rama, señalando que eran checks opcionales que no bloqueaban el merge por defecto. Indicó dos vías para diagnosticar la causa raíz: ejecutar en la terminal el comando proporcionado por la propia interfaz (`npx vercel inspect dpl_... --logs`) o revisar directamente la pestaña **Deployments** → **Build Logs** en el panel web de Vercel para detectar errores de compilación (`npm run build`), sintaxis o variables de entorno faltantes.

### Qué hice yo con eso

- Acepté el diagnóstico y revisé los logs de compilación en Vercel (Deployments → Build Logs), no solo el mensaje rojo del PR.
- En local corrí `npm run build` para reproducir el fallo antes de volver a empujar.
- El historial del repo refleja el arreglo: el commit `Fix: solucionar error por nombre de services` (ruta incorrecta del cliente de la API) y más adelante se dejó de versionar `dist`, que interfería con el output de Vite.
- Tras el merge del PR `#6` el despliegue de producción quedó en `cromoverso-frontend.vercel.app`. Los checks de preview de las dos cuentas de Vercel pueden seguir fallando si un proyecto no tiene las mismas variables o el mismo directorio raíz; el que vale para la entrega es el frontend conectado a este repositorio.

### ¿La IA se equivocó?

- **No** en el diagnóstico (había que abrir los logs, no adivinar desde GitHub). No entregó el parche: el arreglo del nombre de `services` y del `dist` lo hicimos nosotros después de ver el log.

---

## Entrada 4 — Respuesta equivocada: prop `tamaño` e iconos duplicados

- **Fecha:** 2026-11-11
- **Historia / archivo:** US-CRO-S1-03 · `src/components/Cromo/Cromo.jsx` y `src/components/TarjetaMundo/TarjetaMundo.jsx`
- **Herramienta y modelo:** Cursor
- **Qué necesitaba:** Que el emblema de la carta y de la tarjeta de mundo usara la figura que envía la API (`ilustracion.figura` / `mundo.figura`) y el icono del diseño.

### Prompt (resumido)

Conectar el icono de la carta a la figura de la API y al mapa de Figma, sin imágenes raster.

### Lo que respondió la IA (incorrecto)

En el emblema dejó **dos** `<Icono />`:

- uno con `iconoDeFigura(...)` y la prop **`tamaño`** (con ñ);
- otro con la figura cruda, también con `tamaño`.

`Icono` solo lee la prop **`tamano`**. `tamaño` se ignora y el SVG queda en 20 px (el valor por defecto). Además, `Icono` ya traduce `ola`, `hoja`, `orbita` y `runa` a los SVG del diseño, así que el segundo icono repetía el primero.

### Qué hice yo con eso

- En el navegador se veían dos SVG superpuestos en el emblema.
- Dejé un solo `<Icono nombre={cromo.ilustracion?.figura ?? "estrella"} tamano="100%" />` en `Cromo.jsx`.
- En `TarjetaMundo.jsx` dejé un solo `<Icono nombre={mundo.figura} tamano={22} />`.
- Aproveché para completar `--hero-rayos-cx` en `Inicio.css`, que estaba vacío y invalidaba el `calc` de los rayos en móvil.

### ¿La IA se equivocó?

- **Sí.** Respuesta incorrecta: dos iconos y una prop que el componente no reconoce. Corrección: un `Icono` con `tamano` (sin ñ). Queda como evidencia de que hay que leer el componente real (`Icono.jsx`) y no copiar el JSX a ciegas.
