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
          background: "#f6f4ef",
          borderBottom: "24px solid #002ba4",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#002ba4",
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
            color: "#16150f",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 38,
            lineHeight: 1.4,
            color: "#4b483f",
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
