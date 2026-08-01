import JSZip from "jszip";

/**
 * Builds the archive in memory. `STORE` (no compression) is deliberate: MP3 and
 * M4A are already compressed, so deflating them costs CPU and saves nothing.
 *
 * @param {{file: File, newName: string}[]} entries
 * @param {(percent: number) => void} [onProgress]
 */
export function createZipBlob(entries, onProgress) {
  const zip = new JSZip();
  entries.forEach(({ file, newName }) => zip.file(newName, file));

  return zip.generateAsync(
    { type: "blob", compression: "STORE" },
    onProgress ? (metadata) => onProgress(Math.round(metadata.percent)) : undefined
  );
}

/**
 * Saves a blob to disk. The anchor has to be in the document and the object URL
 * has to outlive the click, otherwise Firefox drops the download silently.
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
