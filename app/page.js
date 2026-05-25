"use client";

import { useState, useRef, useCallback } from "react";
import JSZip from "jszip";
import { Music, Shuffle, Download, CheckCircle, RotateCcw, Music2 } from "lucide-react";

const AUDIO_TYPES = ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/m4a"];
const AUDIO_EXTS = [".mp3", ".m4a"];

function isAudio(file) {
  if (AUDIO_TYPES.includes(file.type)) return true;
  const lower = file.name.toLowerCase();
  return AUDIO_EXTS.some((ext) => lower.endsWith(ext));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renamedName(index, total, originalName) {
  const width = String(total).length;
  const num = String(index + 1).padStart(width, "0");
  return `${num} - ${originalName}`;
}

export default function Home() {
  const [files, setFiles] = useState([]);
  const [mixed, setMixed] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  const addFiles = useCallback((incoming) => {
    const audio = Array.from(incoming).filter(isAudio);
    if (audio.length === 0) return;
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      const fresh = audio.filter((f) => !names.has(f.name));
      return [...prev, ...fresh];
    });
    setMixed(null);
    setDone(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleInputChange = (e) => addFiles(e.target.files);

  const handleMezclar = () => {
    if (files.length === 0) return;
    const shuffled = shuffle(files);
    const renamed = shuffled.map((file, i) => ({
      file,
      newName: renamedName(i, shuffled.length, file.name),
    }));
    setMixed(renamed);
    setDone(false);
  };

  const handleDescargar = async () => {
    if (!mixed) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      mixed.forEach(({ file, newName }) => zip.file(newName, file));
      const blob = await zip.generateAsync({ type: "blob", compression: "STORE" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "musica-mezclada.zip";
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch {
      alert("Hubo un error al preparar el archivo. Si tienes muchas canciones, intenta con menos a la vez.");
    } finally {
      setZipping(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setMixed(null);
    setDone(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <main>
      <div className="header">
        <div className="header-icon">
          <Music size={48} strokeWidth={1.8} />
        </div>
        <h1>Mezclador de Música</h1>
        <p className="subtitle">Mezcla tus canciones para que el carro las toque en desorden</p>
      </div>

      <div className="card">
        <div>
          <span className="step-label">Paso 1 — Agrega tus canciones</span>
          <div
            className={`dropzone${dragging ? " active" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Zona para arrastrar canciones"
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          >
            <div className="dropzone-icon">
              <Music2 size={52} strokeWidth={1.4} />
            </div>
            <span className="dropzone-text">Arrastra tus canciones aquí</span>
            <input
              ref={inputRef}
              type="file"
              accept="audio/*,.mp3,.m4a"
              multiple
              style={{ display: "none" }}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {files.length > 0 && (
          <div className="file-count">
            <span className="file-count-number">{files.length}</span>{" "}
            {files.length === 1 ? "canción lista" : "canciones listas"}
            {mixed && (
              <div className="file-count-mixed">
                <CheckCircle size={16} />
                ¡Mezcladas y listas para descargar!
              </div>
            )}
          </div>
        )}

        <div className="divider" />

        <div>
          <span className="step-label">Paso 2 — Mezclar</span>
          <button
            className="btn btn-mezclar"
            onClick={handleMezclar}
            disabled={files.length === 0}
            aria-label="Mezclar canciones"
          >
            <Shuffle size={26} strokeWidth={2.5} />
            MEZCLAR
          </button>
        </div>

        <div>
          <span className="step-label">Paso 3 — Descargar</span>
          <button
            className="btn btn-descargar"
            onClick={handleDescargar}
            disabled={!mixed || zipping}
            aria-label="Descargar ZIP con canciones mezcladas"
          >
            {zipping ? (
              <>
                <span className="spinner" />
                Preparando...
              </>
            ) : (
              <>
                <Download size={26} strokeWidth={2.5} />
                DESCARGAR
              </>
            )}
          </button>
        </div>

        {done && (
          <div className="success">
            <CheckCircle size={22} />
            ¡Listo! Copia estas canciones a tu USB.
          </div>
        )}

        {files.length > 0 && (
          <div className="reset-wrap">
            <button className="btn-reset" onClick={handleReset}>
              <RotateCcw size={16} />
              Empezar de nuevo
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
