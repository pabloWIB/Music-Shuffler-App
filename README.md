# 🎵 Mezclador de Música

App web sencilla para mezclar canciones de distintos géneros renombrándolas con números aleatorios, para que el reproductor del carro las reproduzca en desorden. **Sin base de datos.** Todo corre en el navegador.

---

## ¿Qué hace?

La usuaria tiene su música organizada por género (vallenato, tango, salsa, cumbia…). El reproductor del carro las toca en orden de nombre, así que los géneros quedan agrupados. Esta app:

1. Recibe las canciones (arrastrar y soltar).
2. Les pone un número aleatorio al inicio (`001 - ...`, `002 - ...`) en orden mezclado.
3. Las entrega en un **ZIP** para descargar.

Luego ella copia esas canciones al USB y el carro las reproduce mezcladas.

> **Límite técnico:** un navegador no puede renombrar archivos directamente en un USB. Por eso se descargan copias renombradas en un ZIP.

---

## Cómo la usa la clienta (3 pasos)

1. **Arrastra** sus canciones a la pantalla.
2. Presiona **🎲 MEZCLAR**.
3. Presiona **⬇️ DESCARGAR** y copia el ZIP al USB.

Interfaz en español, botones grandes, letras grandes, mucho contraste.

---

## Stack

- **Next.js (App Router) + React** — JavaScript
- **JSZip** — empaqueta los archivos renombrados
- **Vercel** — despliegue sin configuración
- Sin backend, sin base de datos, sin login, sin variables de entorno

---

## Para construir con Claude Code

1. Lee `REQUIREMENTS.md` completo — es la especificación.
2. Genera la app siguiendo la estructura sugerida ahí.
3. No agregues base de datos, autenticación ni rutas de API. Todo en el cliente.

### Comandos

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

---

## Despliegue en Vercel

1. Sube el repo a GitHub.
2. En Vercel: **New Project → importa el repo**.
3. Vercel detecta Next.js automáticamente. No hay variables de entorno.
4. Deploy. Cada `git push` redespliega solo.

---

## Estructura

```
mezclador-musica/
├── app/
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── public/
├── package.json
├── next.config.js
├── README.md
└── REQUIREMENTS.md
```

---

## Solución de problemas

| Problema | Causa / Solución |
|----------|------------------|
| El ZIP no descarga | El navegador puede bloquear descargas; permitir descargas para el sitio. |
| Tarda mucho con muchas canciones | Normal con miles de archivos; el empaquetado toma tiempo. Mostrar spinner. |
| Faltan archivos en el ZIP | Solo acepta audio (`.mp3`, `.m4a`); otros se ignoran. |
| El carro no mezcla | Confirmar que el reproductor ordena por nombre de archivo, no por etiquetas/álbum. |
