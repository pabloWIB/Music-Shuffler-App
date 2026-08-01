/** Audio file detection and the renaming rule. No DOM access here. */

const AUDIO_MIME_TYPES = ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/m4a"];
const AUDIO_EXTENSIONS = [".mp3", ".m4a"];

/**
 * MIME type first, extension as a fallback: some systems hand over `.m4a`
 * files with an empty `type`.
 */
export function isAudioFile(file) {
  if (AUDIO_MIME_TYPES.includes(file.type)) return true;
  const lower = file.name.toLowerCase();
  return AUDIO_EXTENSIONS.some((extension) => lower.endsWith(extension));
}

/**
 * `007 - La Gota Fria.mp3` — the number is zero-padded to the digit width of
 * the total, so alphabetical order on the USB stick matches the shuffled order.
 */
export function buildMixedName(index, total, originalName) {
  const width = String(total).length;
  const position = String(index + 1).padStart(width, "0");
  return `${position} - ${originalName}`;
}

/**
 * Adds only audio files whose name is not already taken. The set grows as we
 * go, so a single drop that mixes `vallenato/Mix.mp3` with `salsa/Mix.mp3`
 * keeps the first and drops the second — dragging several genre folders at once
 * is the normal way to use this app.
 */
export function mergeNewAudioFiles(current, incoming) {
  const seen = new Set(current.map((file) => file.name));
  const fresh = [];
  for (const file of incoming) {
    if (!isAudioFile(file) || seen.has(file.name)) continue;
    seen.add(file.name);
    fresh.push(file);
  }
  return fresh.length > 0 ? [...current, ...fresh] : current;
}
