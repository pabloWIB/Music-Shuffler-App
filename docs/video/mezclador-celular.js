/**
 * El mismo video en vertical, para Instagram, TikTok y estados de WhatsApp.
 *     node grabar.js <este repo>/docs/video/mezclador-celular.js salidas/mezclador-celular
 *     python montar.py salidas/mezclador-celular --fondo negro
 */
const base = require('./mezclador');

module.exports = { ...base, celular: true, ancho: undefined, alto: undefined };
