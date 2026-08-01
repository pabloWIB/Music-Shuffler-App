import { MusicMixer } from "../components/music-mixer";
import { MusicNotesIcon } from "../components/icons";
import { site } from "../lib/site";

export default function HomePage() {
  return (
    <div className="page">
      <header className="site-header">
        <span className="site-header__icon">
          <MusicNotesIcon size={32} strokeWidth={1.8} />
        </span>
        <h1>{site.name}</h1>
        <p className="site-header__subtitle">
          Mezcla tus canciones para que el carro las toque en desorden y no
          agrupadas por género.
        </p>
      </header>

      <main className="site-main">
        <MusicMixer />
      </main>

      <footer className="site-footer">
        <p>
          Tus canciones no salen de tu computador: todo el trabajo lo hace este
          navegador.
        </p>
        <p>
          Hecho por{" "}
          <a href="https://wib.digital" rel="noopener">
            Pablo Nieto Pérez
          </a>
        </p>
        <p className="site-credit">
          Built by{" "}
          <a
            href="https://wib.digital"
            target="_blank"
            rel="noopener noreferrer"
          >
            wib.digital
          </a>{" "}
          —{" "}
          <a
            href="https://www.fiverr.com/pablonietop"
            target="_blank"
            rel="noopener noreferrer"
          >
            hire me on Fiverr
          </a>
        </p>
      </footer>
    </div>
  );
}
