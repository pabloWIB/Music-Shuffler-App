# Mezclador de Música

Renames a folder of songs with random leading numbers and returns them as a ZIP, so a car stereo that plays in filename order stops grouping every genre together.

[![Live demo](https://img.shields.io/badge/demo-mezcladordemusica.wib.digital-2ea44f)](https://mezcladordemusica.wib.digital)
[![Hire me on Fiverr](https://img.shields.io/badge/Hire%20me%20on%20Fiverr-1DBF73?style=for-the-badge&logo=fiverr&logoColor=white)](https://www.fiverr.com/pablonietop)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.18-000000)](https://nextjs.org)

<p align="center">
  <a href="https://mezcladordemusica.wib.digital"><img src="docs/demo.gif" alt="Adding 12 songs grouped by genre, pressing Mezclar and downloading them shuffled, in the dark music-app design" width="560"></a>
  &nbsp;
  <img src="docs/capturas/movil-2-mezclado.png" alt="Mezclador de Música en el celular" width="200">
</p>

> **En español:** arrastra tus canciones, toca **Mezclar** y descarga un ZIP con los archivos renombrados
> `01 - `, `02 - `… (o `001 - ` si son cientos) en orden aleatorio. Al copiarlos a la USB, el radio del carro los toca mezclados en vez
> de agrupados por género. Todo corre en el navegador: las canciones no salen de tu computador.

## Description

A car stereo reading songs off a USB stick sorts them by filename. If the music is organised in folders by genre — vallenato, tango, salsa, cumbia — the stereo plays forty vallenatos, then forty tangos. There is no shuffle button on the unit, and the owner is not going to rename four hundred files by hand.

This app does the renaming. Drop the songs in, and it assigns each one a random position and prefixes the filename with a zero-padded number as wide as the song count: `01 - `, `02 - `… for a dozen songs, `001 - ` for a few hundred. Copy the result back to the USB stick and the stereo's alphabetical order becomes the shuffled order.

A browser cannot rename files in place on a USB drive, so the app returns renamed copies inside a ZIP rather than modifying the originals. Nothing is uploaded: the files are read, renamed and zipped entirely in the browser. There is no backend, no database and no account.

## Features

- Drag and drop files or whole folders (subfolders included), or pick files through the system dialog.
- Accepts `.mp3` and `.m4a`, checked by MIME type first and file extension as a fallback. Anything else is skipped; if a drop adds nothing, the page says why.
- After mixing, the first five new filenames are listed so the shuffle is visible before downloading.
- Duplicate filenames are skipped, so dropping the same batch twice does not double it.
- Fisher-Yates shuffle, with the number width derived from the total — 400 songs produce `001`, not `1`.
- Live progress percentage while the archive is built, from JSZip's progress callback.
- Everything runs client-side; no file leaves the machine.
- Spanish interface built for a non-technical user: 72px buttons, 18px base type, and no text below a 7:1 contrast ratio.

## Tech stack

| Layer | Technology | Version | Role in project |
|---|---|---|---|
| Framework | Next.js | 15.5.18 | App Router, one static page |
| UI library | React | 18.3.1 | Component state |
| Archiving | JSZip | 3.10.1 | Builds the ZIP in the browser |
| Styling | Plain CSS | — | Custom properties, no framework |
| Type | Atkinson Hyperlegible Next + Mono, Plus Jakarta Sans | — | Atkinson (drawn for low-vision readers) for body text and numbers, Plus Jakarta Sans for titles and buttons; all self-hosted by `next/font` |
| Language | JavaScript | — | No TypeScript in this project |

Three runtime dependencies in total. `next/font` downloads the fonts at build time and serves them from the site, so the page makes no third-party requests at runtime.

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer

## Installation

```bash
git clone https://github.com/pabloWIB/Music-Shuffler-App.git
cd Music-Shuffler-App
npm install
npm run dev
```

Open `http://localhost:3000`.

## Usage

1. Drag the songs onto the drop zone, or click it to open the file picker.
2. Press **Mezclar** to shuffle and renumber.
3. Press **Descargar** to get `musica-mezclada.zip`, then copy its contents to the USB stick.

The renaming rule lives in `lib/audio.js`:

```javascript
export function buildMixedName(index, total, originalName) {
  const width = String(total).length;
  const position = String(index + 1).padStart(width, "0");
  return `${position} - ${originalName}`;
}
```

With 120 files, `La Gota Fría.mp3` in position 7 comes out as:

```
007 - La Gota Fría.mp3
```

The archive is written with `compression: "STORE"`. MP3 and M4A are already compressed, so deflating them costs CPU and saves nothing.

## Project structure

```
app/
├── layout.js            # Root layout, <head> metadata, CSS imports
├── page.js              # Server Component: header, mixer, footer
├── not-found.js         # 404 page with a link back home
├── manifest.js          # PWA manifest  -> /manifest.webmanifest
├── robots.js            # -> /robots.txt
├── sitemap.js           # -> /sitemap.xml
├── opengraph-image.js   # Renders a real 1200x630 PNG at build time
├── favicon.ico          # 48x48
├── icon.png             # 96x96
└── apple-icon.png       # 180x180
components/
├── music-mixer.js       # Client Component: all the state lives here
├── drop-zone.js         # <label> over a hidden file input
├── figure.js            # Blurred silhouette (SVG) inside the step 1 card
└── icons.js             # Note, lock and play icons, all decorative
lib/
├── audio.js             # File-type detection and the renaming rule
├── drop.js              # Reads dropped folders into a flat file list
├── shuffle.js           # Fisher-Yates
├── zip.js               # Archive building and blob download
└── site.js              # Name, URL, description, brand colours
styles/
├── base.css             # Custom properties, reset, base typography
├── layout.css           # Page shell: glows, grain, header, main, footer
└── components.css       # Step chips, steps, dropzone, buttons, preview, messages, progress
public/
├── icon-192.png         # PWA icon
└── icon-512.png         # PWA icon
docs/
├── auditoria.md         # Pre-reorganisation audit
├── cambios.md           # Change log, including the dark redesign
├── requisitos.md        # Original build specification
├── demo.gif             # The GIF at the top of this README
├── capturas/            # Screenshots, desktop and phone
└── video/               # Script for the demo video and 12 silent test songs
.github/
├── ISSUE_TEMPLATE/      # Bug and idea forms
└── pull_request_template.md
CODE_OF_CONDUCT.md       # Contributor Covenant 2.1
CONTRIBUTING.md          # How to run it and the ground rules
next.config.js
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server on `http://localhost:3000` |
| `npm run build` | Production build |
| `npm start` | Serves the production build |

## Accessibility

The end user is elderly, Spanish-speaking and has reduced vision, so the spec in `docs/requisitos.md` sets a 7:1 contrast target — one level above WCAG AA.

- Every text colour measured against its rendered background clears 7:1. The lowest is 8.6:1 (the muted "y 7 canciones más" on the order panel).
- Dark theme in the style of a music app: near-black background, lime accent, lilac card for step 1. Text always sits on a solid card or the plain background; the coloured glows behind it are decorative.
- Each step's number circle shows where the user is: lime for the step to do now, a lime outline once done, grey until it can be reached. The chips above the steps say the same. Disabled buttons keep a readable label and a line below says what to do first.
- The drop zone is a `<label>` over a focusable file input, so click, Enter and Space all work without custom key handling.
- Primary buttons are 72px tall; every other interactive target is at least 44×44px.
- One polite live region announces each change (songs added, new first song after a shuffle, download ready); errors use `role="alert"`.
- Verified with no horizontal scroll at 360, 480, 768, 1024 and 1440px.

## Demo GIF and video

The GIF at the top and the tutorial videos are recorded from the production build with
[Grabador-Tutoriales](https://github.com/pabloWIB/Grabador-Tutoriales). The script is
`docs/video/mezclador.js` (16:9) or `docs/video/mezclador-celular.js` (9:16). It picks the 12
one-second silent songs in `docs/video/canciones/` and seeds `Math.random`, so the mixed order
is the same on every recording.

```bash
npm run build && npx next start -p 3077
# then, inside Grabador-Tutoriales:
node grabar.js <this repo>/docs/video/mezclador.js salidas/mezclador
python montar.py salidas/mezclador --fondo negro --color "#D4F06A"
```

## Deployment

Deployed on Vercel at [mezcladordemusica.wib.digital](https://mezcladordemusica.wib.digital). No environment variables, no backend, no build-time configuration — `git push` triggers the deploy.

## Contributing

Ideas and pull requests are welcome, in English or Spanish. Issues labelled
[`good first issue`](https://github.com/pabloWIB/Music-Shuffler-App/labels/good%20first%20issue) are small and
self-contained. Keep the spirit of the app: no backend, no account, nothing uploaded, and a UI that an
elderly, non-technical user can read.

**Hacktoberfest:** this repo takes part. A merged pull request that closes one of the
[open issues](https://github.com/pabloWIB/Music-Shuffler-App/issues) counts. See
[CONTRIBUTING.md](CONTRIBUTING.md) to run it locally and the [code of conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE) © 2026 Pablo Nieto Pérez

## Author

**Pablo Nieto Pérez** — [wib.digital](https://wib.digital)
GitHub: [@pabloWIB](https://github.com/pabloWIB)

## Hire me

I build **custom internal tools, CRMs and dashboards** for small teams, and
**conversion-focused websites** for businesses.

- [Custom internal tool, CRM or dashboard](https://www.fiverr.com/pablonietop/build-a-custom-internal-app-for-your-business) — from $45
- [Conversion-focused website](https://www.fiverr.com/pablonietop/convert-your-landing-page-design-to-code) — from $80
- [All my services on Fiverr](https://www.fiverr.com/pablonietop)
- [wib.digital](https://wib.digital)
