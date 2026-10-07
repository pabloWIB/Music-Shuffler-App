import { MusicMixer } from "../components/music-mixer";
import { Figure } from "../components/figure";
import { LockIcon, NoteIcon } from "../components/icons";
import { site } from "../lib/site";

export default function HomePage() {
  return (
    <>
      <div className="backdrop" aria-hidden="true">
        <Figure id="fig-lime" className="figure figure--lime" from="#2fd34a" to="#d4f06a" />
        <Figure id="fig-violet" className="figure figure--violet" from="#6d3cff" to="#d2b6ff" />
        <Figure id="fig-pink" className="figure figure--pink" from="#ff3d8b" to="#ffc2dc" />
      </div>

      <div className="page">
        <header className="site-header">
          <div className="site-header__top">
            <span className="site-header__mark" aria-hidden="true">
              <NoteIcon />
            </span>
            <p className="site-header__privacy">
              <LockIcon />
              Nada se sube a internet
            </p>
          </div>
          <h1>{site.name}</h1>
          <p className="site-header__lead">
            Cambia el orden de tus canciones para que el radio del carro las
            toque mezcladas y no agrupadas por género. Todo pasa en tu
            computador.
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
    </>
  );
}
