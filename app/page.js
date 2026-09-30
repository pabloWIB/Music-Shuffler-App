import { MusicMixer } from "../components/music-mixer";
import { site } from "../lib/site";

export default function HomePage() {
  return (
    <div className="page">
      <header className="site-header">
        <h1>{site.name}</h1>
        <p className="site-header__lead">
          Cambia el orden de tus canciones para que el radio del carro las toque
          mezcladas y no agrupadas por género.
        </p>
        <p className="site-header__privacy">
          Nada se sube a internet: todo pasa en tu computador.
        </p>
      </header>

      <main className="site-main">
        <MusicMixer />
      </main>

      <footer className="site-footer">
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
          ·{" "}
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
