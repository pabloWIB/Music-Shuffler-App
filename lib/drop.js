/**
 * Turns a drop into a flat list of files, walking into any folders.
 *
 * `dataTransfer.files` alone hands back a dropped folder as one empty entry, so
 * dragging the genre folders straight from the file explorer added nothing.
 * The entries API reads their contents instead.
 *
 * The entries have to be taken synchronously, inside the drop event: the
 * browser empties `dataTransfer` as soon as the handler returns.
 *
 * @param {DataTransfer} dataTransfer
 * @returns {Promise<File[]>}
 */
export function collectDroppedFiles(dataTransfer) {
  const entries = [];
  const items = dataTransfer.items;
  for (let i = 0; items && i < items.length; i += 1) {
    const entry = items[i].kind === "file" && items[i].webkitGetAsEntry?.();
    if (entry) entries.push(entry);
  }

  if (entries.length === 0) {
    return Promise.resolve(Array.from(dataTransfer.files ?? []));
  }
  return Promise.all(entries.map(readEntry)).then((nested) => nested.flat());
}

function readEntry(entry) {
  if (entry.isFile) {
    return new Promise((resolve) => {
      entry.file(
        (file) => resolve([file]),
        () => resolve([])
      );
    });
  }
  if (entry.isDirectory) return readDirectory(entry.createReader());
  return Promise.resolve([]);
}

/** `readEntries` returns at most 100 entries per call, so keep asking until it runs dry. */
async function readDirectory(reader) {
  const children = [];
  for (;;) {
    const batch = await new Promise((resolve) => {
      reader.readEntries(resolve, () => resolve([]));
    });
    if (batch.length === 0) break;
    children.push(...batch);
  }
  const nested = await Promise.all(children.map(readEntry));
  return nested.flat();
}
