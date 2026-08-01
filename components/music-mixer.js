"use client";

import { useCallback, useRef, useState } from "react";
import { DropZone } from "./drop-zone";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  DownloadIcon,
  RotateIcon,
  ShuffleIcon,
} from "./icons";
import { buildMixedName, mergeNewAudioFiles } from "../lib/audio";
import { shuffle } from "../lib/shuffle";
import { createZipBlob, downloadBlob } from "../lib/zip";

const ZIP_FILENAME = "musica-mezclada.zip";
const ERROR_MESSAGE =
  "No se pudo preparar el archivo. Intenta de nuevo con menos canciones a la vez.";

export function MusicMixer() {
  const [files, setFiles] = useState([]);
  const [mixed, setMixed] = useState(null);
  const [progress, setProgress] = useState(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const zipping = progress !== null;

  const handleFilesAdded = useCallback((incoming) => {
    setFiles((current) => mergeNewAudioFiles(current, incoming));
    setMixed(null);
    setDone(false);
    setError(null);
  }, []);

  const handleMezclar = useCallback(() => {
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
  }, [files]);

  const handleDescargar = useCallback(async () => {
    if (!mixed) return;
    setError(null);
    setProgress(0);
    try {
      const blob = await createZipBlob(mixed, setProgress);
      downloadBlob(blob, ZIP_FILENAME);
      setDone(true);
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
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const hasFiles = files.length > 0;

  return (
    <div className="card">
      <section className="step" aria-labelledby="step-1">
        <h2 className="step-label" id="step-1">
          Paso 1 — Agrega tus canciones
        </h2>
        <DropZone inputRef={inputRef} onFilesAdded={handleFilesAdded} />
      </section>

      <p
        className={`counter${hasFiles ? "" : " counter--empty"}`}
        role="status"
        aria-live="polite"
      >
        {hasFiles ? (
          <>
            <span className="counter__number">{files.length}</span>{" "}
            {files.length === 1 ? "canción lista" : "canciones listas"}
            {mixed && (
              <span className="counter__status">
                <CheckCircleIcon size={18} />
                Ya están mezcladas
              </span>
            )}
          </>
        ) : (
          "Todavía no has agregado canciones"
        )}
      </p>

      <hr className="divider" />

      <section className="step" aria-labelledby="step-2">
        <h2 className="step-label" id="step-2">
          Paso 2 — Mézclalas
        </h2>
        <button
          type="button"
          className="btn"
          onClick={handleMezclar}
          disabled={!hasFiles}
        >
          <ShuffleIcon size={26} strokeWidth={2.5} />
          MEZCLAR
        </button>
      </section>

      <section className="step" aria-labelledby="step-3">
        <h2 className="step-label" id="step-3">
          Paso 3 — Descárgalas
        </h2>
        <button
          type="button"
          className="btn"
          onClick={handleDescargar}
          disabled={!mixed || zipping}
        >
          {zipping ? (
            <>
              <span className="spinner" />
              Preparando…
            </>
          ) : (
            <>
              <DownloadIcon size={26} strokeWidth={2.5} />
              DESCARGAR
            </>
          )}
        </button>

        {zipping && (
          <div className="progress">
            <div className="progress__track">
              <div className="progress__bar" style={{ width: `${progress}%` }} />
            </div>
            <span>{progress}% preparado</span>
          </div>
        )}
      </section>

      {done && (
        <p className="alert alert--success" role="status">
          <CheckCircleIcon size={22} className="alert__icon" />
          ¡Listo! Descomprime el archivo y copia las canciones a tu USB.
        </p>
      )}

      {error && (
        <p className="alert alert--error" role="alert">
          <AlertCircleIcon size={22} className="alert__icon" />
          {error}
        </p>
      )}

      {hasFiles && (
        <div className="reset-row">
          <button type="button" className="btn-reset" onClick={handleReset}>
            <RotateIcon size={18} />
            Empezar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
