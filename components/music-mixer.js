"use client";

import { useCallback, useRef, useState } from "react";
import { DropZone } from "./drop-zone";
import { buildMixedName, mergeNewAudioFiles } from "../lib/audio";
import { shuffle } from "../lib/shuffle";
import { createZipBlob, downloadBlob } from "../lib/zip";

const ZIP_FILENAME = "musica-mezclada.zip";
const PREVIEW_LENGTH = 5;
const ERROR_MESSAGE =
  "No se pudo preparar el archivo. Intenta de nuevo con menos canciones a la vez.";
const NOTHING_ADDED_MESSAGE =
  "No se agregó ninguna canción. Solo sirven archivos MP3 y M4A que no estén ya en la lista.";

export function MusicMixer() {
  const [files, setFiles] = useState([]);
  const [mixed, setMixed] = useState(null);
  const [progress, setProgress] = useState(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const inputRef = useRef(null);

  const hasFiles = files.length > 0;
  const zipping = progress !== null;

  const handleFilesAdded = useCallback(
    (incoming) => {
      const next = mergeNewAudioFiles(files, incoming);
      if (next === files) {
        // A drop that adds nothing would otherwise look like the page ignored it.
        if (incoming.length === 0) return;
        setNotice(NOTHING_ADDED_MESSAGE);
        setAnnouncement(NOTHING_ADDED_MESSAGE);
        return;
      }
      setFiles(next);
      setMixed(null);
      setDone(false);
      setError(null);
      setNotice(null);
      setAnnouncement(
        `${next.length} ${next.length === 1 ? "canción" : "canciones"} en la lista.`
      );
    },
    [files]
  );

  const handleMix = useCallback(() => {
    if (files.length === 0) return;
    const order = shuffle(files);
    setMixed(
      order.map((file, index) => ({
        file,
        newName: buildMixedName(index, order.length, file.name),
      }))
    );
    setDone(false);
    setError(null);
    setNotice(null);
    // Naming the new first song makes a second shuffle audible too.
    setAnnouncement(`Mezcladas. Ahora la primera es ${order[0].name}.`);
  }, [files]);

  const handleDownload = useCallback(async () => {
    if (!mixed) return;
    setError(null);
    setProgress(0);
    try {
      const blob = await createZipBlob(mixed, setProgress);
      downloadBlob(blob, ZIP_FILENAME);
      setDone(true);
      setAnnouncement(
        `Descarga lista. Busca ${ZIP_FILENAME} en tu carpeta de Descargas.`
      );
    } catch {
      setError(ERROR_MESSAGE);
    } finally {
      setProgress(null);
    }
  }, [mixed]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setMixed(null);
    setDone(false);
    setError(null);
    setNotice(null);
    setAnnouncement("Se quitaron todas las canciones.");
    // The reset button disappears with the songs; send focus back to the start.
    inputRef.current?.focus();
  }, []);

  let downloadLabel = "Descargar";
  if (zipping) downloadLabel = "Preparando…";
  else if (done) downloadLabel = "Descargar otra vez";

  return (
    <>
      <ol className="steps">
        <Step
          number={1}
          state={hasFiles ? "done" : "active"}
          title="Agrega tus canciones"
        >
          <DropZone
            inputRef={inputRef}
            compact={hasFiles}
            onFilesAdded={handleFilesAdded}
          />
          {hasFiles && (
            <p className="tally">
              <span className="tally__number">{files.length}</span>{" "}
              {files.length === 1 ? "canción" : "canciones"}
            </p>
          )}
          {notice && <p className="note">{notice}</p>}
        </Step>

        <Step
          number={2}
          state={mixed ? "done" : hasFiles ? "active" : "pending"}
          title="Mézclalas"
        >
          <button
            type="button"
            className={`btn${mixed ? " btn--secondary" : ""}`}
            onClick={handleMix}
            disabled={!hasFiles}
            aria-describedby={hasFiles ? undefined : "mix-hint"}
          >
            {mixed ? "Mezclar otra vez" : "Mezclar"}
          </button>
          {!hasFiles && (
            <p className="hint" id="mix-hint">
              Primero agrega tus canciones.
            </p>
          )}
          {mixed && <OrderPreview entries={mixed} />}
        </Step>

        <Step
          number={3}
          state={done ? "done" : mixed ? "active" : "pending"}
          title="Descárgalas"
        >
          <button
            type="button"
            className={`btn${done ? " btn--secondary" : ""}${
              zipping ? " is-busy" : ""
            }`}
            onClick={handleDownload}
            disabled={!mixed || zipping}
            aria-describedby={mixed ? undefined : "download-hint"}
          >
            {downloadLabel}
          </button>
          {!mixed && (
            <p className="hint" id="download-hint">
              Primero mézclalas.
            </p>
          )}

          {zipping && (
            <div className="progress">
              <div
                className="progress__track"
                role="progressbar"
                aria-label="Preparando el archivo"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div className="progress__bar" style={{ width: `${progress}%` }} />
              </div>
              <span aria-hidden="true">{progress}%</span>
            </div>
          )}

          {done && (
            <div className="message message--success">
              <p className="message__title">Descarga lista</p>
              <ol className="message__steps">
                <li>
                  Busca <strong>{ZIP_FILENAME}</strong> en tu carpeta de
                  Descargas.
                </li>
                <li>Ábrelo con doble clic y copia las canciones a tu USB.</li>
              </ol>
              <p>
                Si la USB ya tenía estas canciones, bórralas antes para que no
                se repitan.
              </p>
            </div>
          )}

          {error && (
            <p className="message message--error" role="alert">
              {error}
            </p>
          )}
        </Step>
      </ol>

      <p className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </p>

      {hasFiles && (
        <div className="reset-row">
          <button type="button" className="btn-link" onClick={handleReset}>
            Empezar de nuevo
          </button>
        </div>
      )}
    </>
  );
}

/**
 * The number square is the only step indicator: filled blue for the step to do
 * now, outlined in ink once done, and grey until it can be reached.
 */
function Step({ number, state, title, children }) {
  return (
    <li
      className={`step step--${state}`}
      aria-current={state === "active" ? "step" : undefined}
    >
      <span className="step__number" aria-hidden="true">
        {number}
      </span>
      <h2 className="step__title">
        <span className="visually-hidden">Paso {number}: </span>
        {title}
        {state === "done" && <span className="step__done">Listo</span>}
      </h2>
      <div className="step__body">{children}</div>
    </li>
  );
}

/** Shows the first few new names so the shuffle is visible, not just claimed. */
function OrderPreview({ entries }) {
  const shown = entries.slice(0, PREVIEW_LENGTH);
  const rest = entries.length - shown.length;

  return (
    <div className="preview">
      <p className="preview__title">Así quedó el orden</p>
      <ol className="preview__list">
        {shown.map(({ file, newName }) => (
          <li key={newName}>
            <span className="preview__position">
              {newName.slice(0, newName.indexOf(" - "))}
            </span>{" "}
            <span className="preview__name">{file.name}</span>
          </li>
        ))}
      </ol>
      {rest > 0 && (
        <p className="preview__more">
          y {rest} {rest === 1 ? "canción más" : "canciones más"}
        </p>
      )}
    </div>
  );
}
