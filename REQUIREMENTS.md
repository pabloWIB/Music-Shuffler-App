# REQUIREMENTS.md — Mezclador de Música

> Build instructions for Claude Code. Read this fully before writing any code.
> This is a **simple, client-side, no-database** web app. Do **not** add a backend, database, authentication, or any server logic. Everything runs in the browser.

---

## 1. What this app is

A single-page web app that lets a non-technical, elderly user **mix her music across genres** so her car's USB player shuffles them.

Her MP3 files are currently grouped by genre (vallenato, tango, salsa, cumbia, etc.). Her car plays them in filename/alphabetical order, so genres stay clumped together. To mix them, the app **renames the files with random leading numbers** (`001 - ...`, `002 - ...`) in a randomized order, so when copied to the USB they interleave.

### The hard constraint (do not work around it)
A browser **cannot** rename files in place on a USB drive. So the flow is:
1. User drags her MP3 files onto the page.
2. App renames them in memory with random ordering numbers.
3. App bundles the renamed copies into a single **ZIP** for download.
4. User unzips and copies them to her USB.

No File System Access API. No folder picker. Drag/drop + download ZIP only — it works on every browser and avoids confusing permission popups.

---

## 2. The end user

- Elderly, non-technical. May have reduced vision and fine-motor control.
- Speaks **Spanish only**. All UI text in Spanish.
- Should be able to use the app with **almost no reading**. Big buttons, big letters, high contrast, obvious colors, emoji icons.
- Worst case she should succeed with three actions: **drop files → press MEZCLAR → press DESCARGAR**.

---

## 3. Functional requirements

| ID | Requirement |
|----|-------------|
| F1 | Large drag-and-drop zone. Clicking it also opens the file picker (`accept="audio/*,.mp3,.m4a"`). |
| F2 | Accept multiple audio files at once (`.mp3`, `.m4a` minimum). Ignore non-audio files silently. |
| F3 | After files are added, show a big count: e.g. **"127 canciones"**. |
| F4 | One huge green button **🎲 MEZCLAR**. On press: randomly shuffle the file order (Fisher–Yates) and assign zero-padded sequence numbers. |
| F5 | Renaming format: `NNN - <originalname>.<ext>`, where `NNN` is the new shuffled position, zero-padded to the digit-width of the total count (e.g. 3 digits for 100–999 files). Original extension preserved. |
| F6 | One huge blue button **⬇️ DESCARGAR**. On press: build a ZIP of all renamed files and trigger download as `musica-mezclada.zip`. Button disabled until MEZCLAR has run. |
| F7 | After download, show a clear Spanish success message (e.g. "¡Listo! Copia estas canciones a tu USB."). |
| F8 | A small **"Empezar de nuevo"** reset that clears everything. |
| F9 | While zipping, show a simple loading state on the button (spinner + "Preparando..."). Files can be large/many. |

### Out of scope (do NOT build)
- No login / accounts / database / server.
- No editing of audio content, tags, or metadata — filename only.
- No playback in the app.
- No genre detection. Mixing = pure random shuffle across everything dropped in.

---

## 4. Non-functional requirements

| ID | Requirement |
|----|-------------|
| N1 | **Accessibility first.** Tap targets ≥ 64px tall. Base font ≥ 18px; buttons much larger. Contrast ratio ≥ 7:1 for text on its background. |
| N2 | Works offline after first load is a nice-to-have, not required. |
| N3 | Must handle ~1000 files / a few GB without crashing the tab. Stream into the ZIP; don't hold unnecessary copies. Warn gracefully if the browser runs out of memory. |
| N4 | Mobile-friendly layout (single column, full-width buttons), but desktop is the primary target since she'll use a computer to load the USB. |
| N5 | No analytics, no tracking, no external calls except the font CDN. |
| N6 | All UI copy in Spanish. Comments/code in English is fine. |

---

## 5. Technical constraints

- **Framework:** Next.js (App Router) + React, JavaScript (no TypeScript required).
- **Zipping:** `jszip` for the archive, plus a browser save (anchor download or `file-saver`).
- **No database, no API routes, no env vars** required to run.
- **Deploy target:** Vercel (zero-config Next.js deploy).
- **Repo:** GitHub, public.

---

## 6. Success criteria

1. User drops her genre-sorted MP3s, presses two buttons, gets `musica-mezclada.zip`.
2. Inside the ZIP, files are renamed `001 - ...`, `002 - ...` in a random order that mixes genres.
3. Copied to USB, the car player now plays genres interleaved instead of clumped.
4. The screen is usable by an elderly Spanish speaker with no instructions beyond the on-screen text.
5. `npm run dev` works locally; `git push` to GitHub auto-deploys on Vercel.

---

## 7. Suggested project structure

```
mezclador-musica/
├── app/
│   ├── layout.js          # lang="es", fonts
│   ├── page.js            # main UI + all logic
│   └── globals.css        # big-button accessible styles
├── public/
├── package.json
├── next.config.js
├── README.md
└── REQUIREMENTS.md
```

Keep it this simple. One page holds the state (file list, mixed flag, loading flag) with `useState`. No global state library needed.

---

## 8. Core logic (reference for Claude Code)

```js
// 1. Shuffle (Fisher–Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 2. Rename
function renamedName(index, total, originalName) {
  const width = String(total).length;        // e.g. 127 -> 3
  const num = String(index + 1).padStart(width, "0");
  return `${num} - ${originalName}`;          // keeps original extension
}

// 3. Zip (jszip)
import JSZip from "jszip";
async function buildZip(mixedFiles) {
  const zip = new JSZip();
  mixedFiles.forEach(({ file, newName }) => zip.file(newName, file));
  const blob = await zip.generateAsync({ type: "blob" });
  // trigger download of blob as "musica-mezclada.zip"
}
```

That's the whole app. Resist the urge to add anything else.
