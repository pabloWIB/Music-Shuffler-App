import { ImageResponse } from "next/og";
import { site } from "../lib/site";

export const alt =
  "Mezclador de Música: mezcla tus canciones para el USB del carro";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Rendered to a real PNG at build time and exposed as og:image / twitter:image. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 32,
          padding: 96,
          background: "#f1f5f9",
          borderBottom: "24px solid #1e40af",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#1e40af",
          }}
        >
          001 · 002 · 003
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 86,
            fontWeight: 800,
            letterSpacing: -2,
            color: "#0f172a",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 38,
            lineHeight: 1.4,
            color: "#414f61",
            maxWidth: 900,
          }}
        >
          Renombra tus canciones con números al azar y descárgalas en un ZIP
          para que el USB del carro las toque mezcladas.
        </div>
      </div>
    ),
    size
  );
}
