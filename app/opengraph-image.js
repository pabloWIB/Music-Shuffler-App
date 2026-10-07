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
          color: "#ffffff",
          backgroundColor: "#0b0b10",
          backgroundImage:
            "radial-gradient(circle at 8% 0%, rgba(255,95,168,0.45), transparent 45%), radial-gradient(circle at 100% 30%, rgba(155,108,255,0.38), transparent 40%), radial-gradient(circle at 70% 120%, rgba(212,240,106,0.3), transparent 45%)",
        }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          {["1 · Agrega", "2 · Mezcla", "3 · Descarga"].map((label, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "14px 28px",
                fontSize: 28,
                fontWeight: 700,
                borderRadius: 999,
                color: i === 1 ? "#0b0b10" : "#ffffff",
                backgroundColor: i === 1 ? "#d4f06a" : "rgba(255,255,255,0.1)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: -3,
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 38,
            lineHeight: 1.4,
            color: "#bdbdcb",
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
