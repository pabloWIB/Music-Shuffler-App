"use client";

import { useCallback, useState } from "react";
import { collectDroppedFiles } from "../lib/drop";
import { Figure } from "./figure";

const INPUT_ID = "song-input";
const HINT_ID = "song-input-hint";

/**
 * A real `<label>` over a focusable-but-hidden `<input type="file">`: the browser
 * gives us click, Enter and Space for free, so there is no `role="button"` and
 * no synthetic `.click()` to re-dispatch.
 *
 * Once there are songs, `compact` shrinks the zone to one row so the next step
 * moves up the screen.
 */
export function DropZone({ inputRef, compact, onFilesAdded }) {
  const [dragging, setDragging] = useState(false);
  const [reading, setReading] = useState(false);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    // Ignore the dragleave fired when the pointer crosses onto a child element.
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (event) => {
      event.preventDefault();
      setDragging(false);
      if (reading) return;
      const pending = collectDroppedFiles(event.dataTransfer);
      setReading(true);
      try {
        onFilesAdded(await pending);
      } finally {
        setReading(false);
      }
    },
    [onFilesAdded, reading]
  );

  const handleChange = useCallback(
    (event) => {
      const picked = Array.from(event.target.files ?? []);
      // Clear the input so picking the same files again still fires `change`.
      event.target.value = "";
      onFilesAdded(picked);
    },
    [onFilesAdded]
  );

  let text = "Arrastra aquí tus canciones o sus carpetas";
  if (reading) text = "Buscando canciones…";
  else if (compact) text = "¿Faltan canciones? Arrástralas aquí";

  return (
    <div
      className={`dropzone${compact ? " dropzone--compact" : ""}${
        dragging ? " is-active" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        id={INPUT_ID}
        className="visually-hidden"
        type="file"
        accept="audio/*,.mp3,.m4a"
        multiple
        aria-describedby={compact ? undefined : HINT_ID}
        onChange={handleChange}
      />
      {!compact && (
        <Figure
          id="fig-card"
          className="dropzone__figure"
          from="#ff5fa8"
          to="#6d3cff"
        />
      )}
      <label className="dropzone__label" htmlFor={INPUT_ID}>
        <span className="dropzone__text">{text}</span>
        {!compact && (
          <span className="dropzone__hint" id={HINT_ID} aria-hidden="true">
            Sirven archivos MP3 y M4A.
          </span>
        )}
        <span className="dropzone__button" aria-hidden="true">
          {!compact && <span className="dropzone__plus">+</span>}
          {compact ? "Elegir más" : "Elegir canciones"}
        </span>
      </label>
    </div>
  );
}
