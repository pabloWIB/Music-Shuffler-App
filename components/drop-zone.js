"use client";

import { useCallback, useState } from "react";
import { MusicNoteIcon } from "./icons";

const INPUT_ID = "song-input";

/**
 * A real `<label>` over a focusable-but-hidden `<input type="file">`: the browser
 * gives us click, Enter and Space for free, so there is no `role="button"` and
 * no synthetic `.click()` to re-dispatch.
 */
export function DropZone({ inputRef, onFilesAdded }) {
  const [dragging, setDragging] = useState(false);

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
    (event) => {
      event.preventDefault();
      setDragging(false);
      onFilesAdded(event.dataTransfer.files);
    },
    [onFilesAdded]
  );

  const handleChange = useCallback(
    (event) => onFilesAdded(event.target.files),
    [onFilesAdded]
  );

  return (
    <div
      className={`dropzone${dragging ? " is-active" : ""}`}
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
        onChange={handleChange}
      />
      <label className="dropzone__label" htmlFor={INPUT_ID}>
        <span className="dropzone__icon">
          <MusicNoteIcon size={52} strokeWidth={1.4} />
        </span>
        <span className="dropzone__text">Arrastra tus canciones aquí</span>
        <span className="dropzone__hint">
          o toca este recuadro para buscarlas en tu computador
        </span>
      </label>
    </div>
  );
}
