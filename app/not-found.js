import Link from "next/link";

export const metadata = {
  title: "Página no encontrada",
  description:
    "Esta dirección no existe en el Mezclador de Música. Vuelve al inicio para mezclar tus canciones y descargarlas en un ZIP para el USB del carro.",
};

export default function NotFound() {
  return (
    <div className="page">
      <main className="site-main notice">
        <p className="notice__code" aria-hidden="true">
          404
        </p>
        <h1>Esta página no existe</h1>
        <p>
          La dirección que abriste no corresponde a ninguna parte del
          mezclador. Vuelve al inicio para agregar tus canciones.
        </p>
        <Link className="btn btn--secondary notice__action" href="/">
          Volver al inicio
        </Link>
      </main>
    </div>
  );
}
