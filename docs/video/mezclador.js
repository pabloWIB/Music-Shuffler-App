/**
 * Guion del video del Mezclador para Grabador-Tutoriales (github.com/pabloWIB/Grabador-Tutoriales).
 *
 *     npm run build && npx next start -p 3077          (en este repo)
 *     node grabar.js <este repo>/docs/video/mezclador.js salidas/mezclador          (en el grabador)
 *     python montar.py salidas/mezclador --fondo negro
 *
 * Otra dirección: MEZCLADOR_URL=https://mezcladordemusica.wib.digital node grabar.js …
 * Vertical para redes: docs/video/mezclador-celular.js.
 *
 * Las 12 canciones de `canciones/` son un segundo de silencio cada una: tres por género.
 * Math.random va con semilla fija para que el orden mezclado salga siempre igual y se vea
 * mezclado (con la semilla 1 los cinco primeros son Vallenato, Cumbia, Salsa, Tango, Cumbia).
 */
const fs = require('fs');
const path = require('path');

const URL = process.env.MEZCLADOR_URL || 'http://localhost:3077/';
const CARPETA = path.join(__dirname, 'canciones');
const CANCIONES = fs.readdirSync(CARPETA).filter((f) => f.endsWith('.mp3')).sort().map((f) => path.join(CARPETA, f));
const SEMILLA = 1;

module.exports = {
  titulo: 'Mezcla tus canciones para el carro',
  voz: 'es-CO-SalomeNeural',
  ancho: 1440,
  alto: 810,
  antes: async (pagina) => {
    await pagina.evaluateOnNewDocument((s) => {
      let x = s >>> 0;
      Math.random = () => {
        x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
        return x / 4294967296;
      };
    }, SEMILLA);
  },
  pasos: async (g) => {
    await g.ir(URL, 'Si el radio del carro te toca todas las salsas juntas y después todos los tangos, esto es para ti.');
    await g.decir('Nada se sube a internet: todo pasa en tu computador.', { objetivo: '.site-header__privacy' });
    await g.subir({ sel: 'label', texto: 'Elegir canciones' }, CANCIONES, 'Pulsa «Elegir canciones» y escoge tus canciones. Aquí van doce, tres de cada género.');
    await g.decir('Ya están en la lista.', { objetivo: '.tally' });
    await g.clic({ sel: 'button', texto: 'Mezclar' }, 'Pulsa «Mezclar».');
    await g.decir('Así quedó el orden: los géneros ya no van juntos.', { objetivo: '.preview' });
    await g.clic({ sel: 'button', texto: 'Descargar' }, 'Pulsa «Descargar» y se baja un archivo ZIP con las canciones renombradas.');
    await g.decir('Ábrelo, copia las canciones a la USB y el radio las toca mezcladas.', { objetivo: '.message--success' });
  },
};
