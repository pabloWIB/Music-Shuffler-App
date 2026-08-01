# Auditoría — Mezclador de Música

Estado del repositorio **antes** de la reorganización. Documento interno de trabajo.

- Fecha: 2026-07-31
- Stack detectado: Next.js 15.5.18 (App Router) + React 18.3.1, JavaScript, sin backend
- Build de referencia antes de tocar nada: `next build` compila correctamente, 140 kB First Load JS en `/`

---

## 1. Inventario de archivos

### 1.1 Páginas / rutas

| Archivo | Ruta generada | `<title>` | `<h1>` | Propósito real |
|---|---|---|---|---|
| `app/page.js` | `/` | `Mezclador de Música` (heredado de `layout.js`) | `Mezclador de Música` | Única pantalla: dropzone, contador, botones MEZCLAR y DESCARGAR, reset |
| `app/layout.js` | — | Define `metadata.title` y `description` para todo el sitio | — | Layout raíz, `lang="es"`, importa `globals.css` |
| — | `/_not-found` | 404 por defecto de Next.js | — | **No existe `not-found.js`**: se sirve la página 404 genérica del framework, sin enlace de vuelta |

No hay ninguna otra ruta. No hay `robots.txt` ni `sitemap.xml`.

### 1.2 CSS

| Archivo | Peso | Se carga | Observaciones |
|---|---|---|---|
| `app/globals.css` | 4,446 B | Sí, desde `app/layout.js` | Único archivo. Mezcla reset + base + layout + componentes + media query sin separación. Sin variables `:root`. |

Reglas muertas o problemáticas detectadas en `globals.css`:

| Selector | Problema |
|---|---|
| `.dropzone-sub` | **Nunca usado.** Ningún elemento del JSX lleva esa clase. CSS muerto. |
| `@media (max-width: 600px)` | Desktop-first, con un único breakpoint. Contrario al requisito mobile-first. |
| `.subtitle` (`#6b7280` sobre `#f0f4f8`) | Contraste ≈ 4.3:1. El propio requisito N1 del proyecto pide ≥ 7:1. |
| `.btn-reset` (`#6b7280`) | Contraste ≈ 4.5:1. Mismo incumplimiento de N1. |
| `.btn-mezclar` (blanco sobre `#AD7FA8`) | Contraste ≈ 3.3:1. Pasa AA sólo por tratarse de texto grande; incumple N1. |
| Valores mágicos | `2.5px`, `1.5px`, `6px`, `10px`, `18px`, `37px`-style: escala de espaciado inexistente. |
| Paleta duplicada | Dos identidades en la misma pantalla: azul `#2563eb` (icono, labels, dropzone, focus) y morado `#AD7FA8` / `#7a4d75` (botones). |

### 1.3 JavaScript

| Archivo | Peso | Se carga | Observaciones |
|---|---|---|---|
| `app/page.js` | 6,492 B | Sí | 215 líneas. Client component único: lógica de negocio (`isAudio`, `shuffle`, `renamedName`), construcción del ZIP, descarga y toda la UI en el mismo archivo. Sin módulos. |
| `app/layout.js` | 295 B | Sí | Correcto pero incompleto: sin Open Graph, sin canonical, sin `metadataBase`, sin `themeColor`. |
| `next.config.js` | 98 B | Sí | Configuración vacía (`{}`). |

No hay archivos JS huérfanos. No hay jQuery. No hay `var`. No hay variables globales sueltas.

### 1.4 Imágenes

| Archivo | Peso | Dimensiones | Formato | Uso real |
|---|---|---|---|---|
| `app/favicon.ico` | 15,086 B | 48×48 | ICO | Sí — Next.js inyecta `<link rel="icon">` |
| `app/icon.png` | 7,887 B | 96×96 | PNG | Sí — `<link rel="icon" sizes="96x96">` |
| `app/apple-icon.png` | 16,817 B | 180×180 | PNG | Sí — `<link rel="apple-touch-icon">` |
| `public/web-app-manifest-192x192.png` | 18,307 B | 192×192 | PNG | Sí — referenciado por `app/manifest.json` |
| `public/web-app-manifest-512x512.png` | 101,769 B | 512×512 | PNG | Sí — referenciado por `app/manifest.json` |

Ninguna imagen supera los 200 KB, así que **no aplica conversión a WebP**. Tampoco aplica `width`/`height`/`loading`/`alt`: el proyecto **no tiene ni una sola etiqueta `<img>`**; toda la iconografía visible es SVG. Los nombres `web-app-manifest-192x192.png` no son semánticos según la regla de nombres.

### 1.5 Dependencias externas

| Dependencia | Versión | Tipo | Uso real |
|---|---|---|---|
| `next` | 15.5.18 | npm | Framework |
| `react` / `react-dom` | 18.3.1 | npm | UI |
| `jszip` | 3.10.1 | npm | Construye el ZIP en el navegador. Imprescindible. |
| `lucide-react` | 1.16.0 | npm | **6 iconos**: `Music`, `Shuffle`, `Download`, `CheckCircle`, `RotateCcw`, `Music2`. Una librería entera para seis SVG. |

Sin CDNs. Sin fuentes externas (usa `system-ui`). Sin analítica ni llamadas de red en runtime. Correcto respecto al requisito N5.

### 1.6 Archivos basura y fuera de sitio

| Archivo | Peso | Diagnóstico |
|---|---|---|
| ``window.innerWidth` `` | 0 B | **Basura.** Nombre con backtick incluido; residuo de un comando de shell mal escapado. No lo referencia nadie. |
| `docs/txt.txt` | 0 B | **Vacío.** Cero bytes, sin contenido, sin referencias. |
| `REQUIREMENTS.md` | 6,273 B | Contenido legítimo (especificación original) pero en la raíz; su sitio es `docs/`. |
| `.next/` | 56 MB | Artefacto de build. Ya está en `.gitignore`. |

No hay `.bak`, `copia de`, `final_v2`, `.DS_Store`, `Thumbs.db` ni `node_modules` versionado.

---

## 2. Enlaces, rutas y referencias

| Comprobación | Resultado |
|---|---|
| `href` a archivos inexistentes | Ninguno. La app no tiene navegación ni menú. |
| `src` de imagen inexistente | Ninguno. No hay `<img>`. |
| `<link>` / `<script>` a archivos inexistentes | Ninguno. Todos los assets de `<head>` los genera Next.js desde archivos reales verificados en disco. |
| Rutas del manifest | `/web-app-manifest-192x192.png` y `/web-app-manifest-512x512.png` existen en `public/`. Correctas. |
| Rutas absolutas de la máquina local | Ninguna. |
| Credenciales / tokens / API keys | **Ninguna.** Búsqueda sobre todo el repo sin resultados. |
| Enlaces del README | `github.com/pabloWIB/Music-Shuffler-App`, `wib.digital` y `mezcladordemusica.wib.digital` (verificado: HTTP 200). |

---

## 3. Defectos funcionales encontrados

| # | Archivo | Defecto | Impacto |
|---|---|---|---|
| 1 | `app/page.js:88-92` | El `<a>` de descarga nunca se añade al DOM y `URL.revokeObjectURL()` se llama de forma síncrona justo después de `a.click()`. | La descarga puede no dispararse en Firefox, y el objeto URL puede revocarse antes de que el navegador termine de leerlo. Es el único camino de salida de la app. |
| 2 | `app/page.js:95` | El error de zipado se comunica con `alert()`. | Diálogo modal bloqueante, sin estilo, imposible de leer por lectores de pantalla en contexto. |
| 3 | `app/page.js:130` | `onKeyDown` sólo atiende `Enter`. | Un elemento con `role="button"` debe activarse también con `Space`. Incumple navegación por teclado. |
| 4 | `app/page.js:136-143` | `<input type="file">` oculto **dentro** del div clicable; `inputRef.current.click()` re-entra en el `onClick` del padre. | Funciona hoy sólo porque el DOM bloquea el click reentrante sobre el mismo elemento. Patrón frágil. |
| 5 | `app/page.js:80-99` | Sin indicador de progreso durante el zipado. JSZip expone callback de progreso y no se usa. | Con cientos de MB el botón queda en "Preparando..." sin señal de vida. |
| 6 | `app/manifest.json` | `"name": "MyWebSite"`, `"short_name": "MySite"`, `theme_color: "#ffffff"`. | **Texto de relleno del template.** Es lo que aparece al instalar la PWA. |
| 7 | `app/manifest.json` | Ambos iconos declarados sólo como `purpose: "maskable"`. | Sin variante `any`, algunos lanzadores no tienen icono utilizable. |
| 8 | `app/layout.js` | Sin Open Graph, sin `canonical`, sin `metadataBase`. | Compartir el enlace no produce previsualización. |
| 9 | — | Sin `not-found.js`. | El 404 es la pantalla genérica de Next.js, sin salida hacia el inicio. |
| 10 | — | Sin `robots.txt` ni `sitemap.xml`. | Sin señales de indexación. |
| 11 | `package.json` | Declara `next: ^15.3.2`; el lockfile resuelve 15.5.18; el README afirma 15.5.18. | Inconsistencia documental. |
| 12 | `.gitignore` | 4 líneas. Faltan `.DS_Store`, `Thumbs.db`, `*.log`, `.vercel`, `out/`, `build/`. | Riesgo de versionar basura. |

---

## 4. HTML duplicado entre páginas

No aplica: el proyecto tiene una sola página. No hay `nav`, `header` ni `footer` repetidos entre archivos.

---

## 5. Contenido de relleno heredado del template

| Ubicación | Texto |
|---|---|
| `app/manifest.json` | `"MyWebSite"`, `"MySite"` |
| `docs/txt.txt` | Archivo vacío |

No hay "Lorem ipsum", "TODO", "TBD" ni "coming soon" en ningún archivo del proyecto.

---

## 6. Resumen en 5 líneas

1. Es una app de una sola pantalla en Next.js App Router que renombra canciones con números aleatorios y las devuelve en un ZIP, todo en el navegador, para que el USB del carro deje de agrupar los géneros.
2. El estado es **funcional pero sin organizar**: compila, hace lo que promete y no tiene credenciales ni enlaces rotos, pero toda la lógica y toda la UI viven en un único archivo de 215 líneas y todo el CSS en un único archivo sin variables.
3. Lo más grave es funcional: **la descarga —el único camino de salida de la app— está implementada de forma frágil**; el `<a>` no se inserta en el DOM y el object URL se revoca de inmediato, lo que puede impedir la descarga en Firefox.
4. Lo segundo más grave es de imagen: el **manifest de la PWA sigue diciendo "MyWebSite"**, que es literalmente el nombre que vería la usuaria al instalar la app.
5. Lo tercero es accesibilidad: el proyecto se escribió para una usuaria mayor con visión reducida y exige ≥ 7:1 de contraste en su propia especificación, pero **tres colores de texto no llegan**, y la zona de arrastre no responde a la barra espaciadora.
