import "./globals.css";

export const metadata = {
  title: "Mezclador de Música",
  description: "Mezcla tus canciones para el USB del carro",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
