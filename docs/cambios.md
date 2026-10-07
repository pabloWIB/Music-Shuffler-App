# Registro de cambios — reorganización

Trabajo del 2026-07-31. Todo local: no se ejecutó ningún comando de git.

El proyecto es una app Next.js (App Router), no un sitio de HTML plano, así que
la estructura de carpetas se adaptó al framework: `app/` para rutas y metadata,
`components/` y `lib/` en lugar de `assets/js/modules/`, y `styles/` en lugar de
`assets/css/`. La jerarquía pedida (base → layout → componentes, un punto de
entrada + módulos) se respeta; sólo cambian los nombres de carpeta que Next.js
impone.

---

## Fase 1 — Auditoría

- Inventario completo en [`auditoria.md`](auditoria.md): 13 archivos de proyecto,
  5 imágenes, 4 dependencias npm, 0 CDNs.
- Build de referencia antes de tocar nada: correcto, 140 kB First Load JS.
- 12 defectos funcionales, 6 problemas de CSS, 0 credenciales, 0 enlaces rotos.

## Fase 2 — Estructura

| Antes | Después | Motivo |
|---|---|---|
| `app/globals.css` | `styles/base.css` + `styles/layout.css` + `styles/components.css` | Separar tokens/reset, esqueleto de página y componentes |
| lógica dentro de `app/page.js` | `lib/audio.js`, `lib/shuffle.js`, `lib/zip.js`, `lib/site.js` | Lógica pura, sin DOM, testeable y reutilizable |
| UI dentro de `app/page.js` | `components/music-mixer.js`, `components/drop-zone.js`, `components/icons.js` | `page.js` queda como Server Component; el estado vive en un solo cliente |
| `app/manifest.json` | `app/manifest.js` | Reutiliza `lib/site.js`; deja de duplicar nombre y colores |
| `REQUIREMENTS.md` (raíz) | `docs/requisitos.md` | La especificación es documentación, no configuración |
| `public/web-app-manifest-192x192.png` | `public/icon-192.png` | Nombre semántico |
| `public/web-app-manifest-512x512.png` | `public/icon-512.png` | Nombre semántico |
| — | `app/not-found.js` | No existía página 404 propia |
| — | `app/robots.js`, `app/sitemap.js` | No existían |
| — | `app/opengraph-image.js` | Genera un PNG real de 1200×630 en build |

Todas las rutas quedaron actualizadas y verificadas: el manifest apunta a los
iconos renombrados y `layout.js` importa las tres hojas de estilo en orden.

## Fase 3 — Higiene

**Eliminado:**

| Archivo | Motivo |
|---|---|
| ``window.innerWidth` `` | 0 bytes. Residuo de un comando de shell mal escapado. Sin referencias. |
| `docs/txt.txt` | 0 bytes, vacío, sin referencias. |
| `app/globals.css` | Reemplazado por las tres hojas de `styles/`. |
| `app/manifest.json` | Reemplazado por `app/manifest.js`. |
| `.dropzone-sub` (regla CSS) | Nunca la usó ningún elemento. |
| Dependencia `lucide-react` | Se usaba para 6 iconos. Sustituida por SVG propios en `components/icons.js`. |

- `.gitignore` reescrito: añade `out/`, `build/`, `.vercel/`, `.DS_Store`,
  `Thumbs.db`, `desktop.ini`, `*.log`, `.idea/`, `.vscode/`, `*.swp`.
- `package.json`: nombre corregido a `mezclador-de-musica`, `next` alineado con
  el lockfile (`^15.5.18` en vez de `^15.3.2`), añadidos `description`,
  `homepage`, `author` y `engines`.
- **Credenciales: ninguna.** La búsqueda sobre todo el repo no encontró tokens,
  API keys ni contraseñas. No hay nada que sacar del código.
- Formato normalizado: 2 espacios, comillas dobles, punto y coma, salto de línea
  final, sin tabs, sin CRLF (se corrigieron `next.config.js` y
  `docs/requisitos.md`, que venían con CRLF).

## Fase 4 — Imágenes

No hubo nada que convertir ni redimensionar:

- El proyecto **no tiene ni una etiqueta `<img>`**. Toda la iconografía visible
  es SVG inline, así que `width`/`height`/`loading`/`alt` no aplican.
- Las 5 imágenes existentes son iconos de favicon/PWA. La mayor pesa 101 KB,
  por debajo del umbral de 200 KB, y sus tamaños (48, 96, 180, 192, 512 px) son
  exactamente los que declara cada `<link>` y el manifest. Convertirlas a WebP
  rompería la compatibilidad de instalación de la PWA.
- Sólo se renombraron para que el nombre describa el contenido.

## Fase 5 — HTML, SEO y accesibilidad

- Estructura semántica: `<header>` / `<main>` / `<footer>` en `page.js`, tres
  `<section>` numeradas dentro de la tarjeta. Un solo `<h1>`; los pasos son
  `<h2>`. Sin saltos de nivel.
- `<head>` completo vía `metadata`: título único por página (53 y 44
  caracteres), descripción única (155 y 148), `canonical`, `metadataBase`,
  Open Graph completo y `theme_color`.
- `og:image` apunta a `/opengraph-image`, un PNG de 1200×630 **generado en el
  build** — no es una ruta inventada; el archivo existe tras `next build`.
- Manifest PWA: se eliminaron `"MyWebSite"` y `"MySite"`, que eran relleno del
  template original, y se añadieron `description`, `lang`, `scope` y variantes
  `any` además de `maskable` para los iconos.
- `robots.txt` y `sitemap.xml` generados con la URL real del sitio.
- Accesibilidad:
  - La zona de arrastre pasó de `<div role="button">` con `onKeyDown` manual a
    un `<label>` real sobre un `<input type="file">` enfocable. El navegador da
    click, Enter y Espacio de forma nativa.
  - Anillo de foco visible de 3 px en todos los elementos interactivos.
  - Contador con `role="status"` y `aria-live="polite"`; alertas con
    `role="status"` y `role="alert"`.
  - Iconos SVG con `aria-hidden="true"` y `focusable="false"`.
  - `lang="es"` correcto.

## Fase 6 — CSS y sistema de diseño

- **Paleta unificada.** El sitio tenía dos identidades: azul `#2563eb` en
  encabezados, etiquetas y dropzone, y morado `#AD7FA8` / `#7a4d75` en los
  botones. El icono de la app —favicon, apple-icon y icono de instalación de la
  PWA— es azul, así que se unificó todo en azul y se descartó el morado.
- Los tres colores de texto que incumplían el requisito N1 (≥ 7:1) se
  oscurecieron. Medición sobre el DOM renderizado: **ningún texto baja de 7:1**
  (o 4.5:1 en texto grande). El valor más bajo es 7.62:1.
- 20 variables nuevas en `:root`: colores, escala de espaciado, escala
  tipográfica, radios, sombras y transición.
- Escala de espaciado estricta 4 / 8 / 16 / 24 / 32 / 48 / 64 / 96. Los valores
  sueltos (2.5px, 6px, 10px, 18px, 37px) desaparecieron.
- Una sola familia tipográfica (`system-ui`), seis tamaños.
- Orden dentro de cada archivo: variables → reset → base → layout → componentes
  → media queries.
- Sin CSS muerto (35 clases declaradas, 35 usadas), sin selectores de más de 3
  niveles, sin estilos inline salvo el ancho calculado de la barra de progreso.
- Un único `!important`, en el bloque `prefers-reduced-motion`, donde es
  obligatorio para ganar a cualquier transición declarada.

## Fase 7 — Responsive

- Reescrito a mobile-first: la media query `max-width: 600px` se sustituyó por
  `min-width` en 480, 768 y 1024.
- Verificado en 360, 480, 768, 1024 y 1440 px sobre Chrome headless:
  `document.documentElement.scrollWidth === window.innerWidth` en las cinco
  anchuras y en las dos páginas. **Cero scroll horizontal.**
- Áreas táctiles: botones principales de 72 px de alto, reset y enlaces de 44 px
  mínimo. El único elemento medido por debajo es el `<input type="file">`
  oculto de 1×1 px, cuya superficie real de activación es el `<label>` de 160 px
  que lo cubre.
- No hay menú móvil que probar: la app es de una sola pantalla y no tiene
  navegación. No hay tablas ni bloques de código.

## Fase 8 — UX / UI

- Se entiende en 5 segundos: título, subtítulo de una línea y tres pasos
  numerados en orden.
- Un solo camino: MEZCLAR se habilita al añadir canciones y DESCARGAR al
  mezclar. Los dos botones comparten estilo porque nunca compiten — el estado
  deshabilitado indica cuál toca.
- Estados completos en cada elemento interactivo: default, hover, focus-visible,
  active y disabled, con transiciones de 180 ms.
- El estado vacío del contador pasó de una caja azul grande y en negrita a texto
  gris discreto; el elemento sigue en el DOM para que su región `aria-live`
  pueda anunciar el primer cambio.
- **`alert()` sustituido por una alerta en línea** con `role="alert"`.
- **Barra de progreso real durante el zipado**, alimentada por el callback de
  progreso de JSZip, que antes no se usaba.
- No hay formularios: no hay nada que fingir que funciona.
- Sin gradientes ni animaciones decorativas. La sombra de la tarjeta se suavizó.

## Fase 9 — JavaScript

- Punto de entrada único (`app/page.js`, Server Component) + módulos.
- `lucide-react` eliminada; los 6 iconos son SVG propios.
- Cero `var`, cero variables globales, cero jQuery, cero `console.*`.
- **Bug corregido:** el `<a>` de descarga no se insertaba en el DOM y
  `URL.revokeObjectURL()` se llamaba de forma síncrona justo tras `a.click()`.
  Ahora el anchor se añade al documento y la URL se revoca a los 60 s. Firefox
  ignora silenciosamente descargas de anchors fuera del DOM.
- **Fragilidad corregida:** el `<input type="file">` estaba dentro del div
  clicable y `input.click()` reentraba en el `onClick` del padre. Con el patrón
  `<label for>` ese ciclo ya no existe.
- `onDragLeave` ya no se dispara al cruzar a un hijo (`contains(relatedTarget)`).
- Cero errores y cero warnings en consola en las cinco anchuras.

## Fase 10 — Rendimiento

- Primera carga medida con caché desactivada: **184 KB en 12 peticiones**, muy
  por debajo del objetivo de 1 MB.
- CSS: tres archivos fuente, un solo `<link>` en producción (Next.js los une).
- Scripts: los emite Next.js con su estrategia de carga no bloqueante.
- Fuentes: `system-ui`. Cero peticiones de fuentes, así que no hay `swap` ni
  `preconnect` que añadir — añadirlos apuntaría a un origen inexistente.
- Una dependencia menos en el bundle tras quitar `lucide-react`.

## Fase 11 — QA

Ver la tabla de verificación en el informe final. Todo verificado sobre el build
de producción servido con `next start`, en Chrome headless controlado por CDP.

## Fase 12 — Documentación

- `README.md` actualizado: la reorganización cambió rutas y nombres de carpeta,
  así que se rehicieron el árbol del proyecto, la tabla de stack (sin
  `lucide-react`), las rutas de los ejemplos de código y la sección de scripts.
- Este archivo.

## Fase 13 — Deploy

- Verificado con `next build` + `next start` en el puerto 4321.
- Sin rutas absolutas de la máquina local en ningún archivo del proyecto.
- Todas las rutas internas relativas y en minúsculas.
- No se creó `vercel.json` ni ningún archivo de hosting: no se indicó destino y
  el despliegue actual en Vercel funciona sin configuración.

---

## 2026-10-07 — Tema oscuro de app de música

Rediseño visual pedido por Pablo a partir de una referencia de app de música
(fondo casi negro, acento lima, tarjeta lila, botones de pastilla) y de unas
siluetas borrosas con grano como personajes de fondo. La lógica no cambió.

- **Paleta:** fondo `#0b0b10`, tarjetas `#16161d`, acento lima `#d4f06a` con
  tinta `#0b0b10` (15:1), tarjeta lila `#cdb4f6` con tinta `#1b1030`. Brillos
  rosa, morado y lima detrás, fijos al desplazarse.
- **Personajes de fondo:** `components/figure.js` dibuja una silueta de busto en
  SVG con degradado; el CSS la desenfoca y el fondo le pone grano. No se usa
  ninguna foto. Tres en el fondo (lima, morada y rosa) y una en la tarjeta del
  paso 1. Son decorativas (`aria-hidden`) y en celular se van a las esquinas.
- **Letra:** el texto sigue en Atkinson Hyperlegible; títulos, pastillas y
  botones pasan a Plus Jakarta Sans.
- **Nuevo:** fila de pastillas con el paso actual (`1 · Agrega`, `2 · Mezcla`,
  `3 · Descarga`), la lista del orden con miniaturas de color y el nombre nuevo
  de cada archivo, y la imagen para compartir (`opengraph-image.js`) en oscuro.
- **Contraste medido** sobre el build servido con `next start`, a 390 y 1440 px,
  vacío y mezclado: ningún texto baja de 8.6:1.
- **Video:** `docs/video/` tiene el guion para Grabador-Tutoriales (horizontal y
  vertical) y las 12 canciones de prueba, con semilla fija para que el orden
  salga siempre igual. `docs/demo.gif` y `docs/capturas/` se rehicieron.

