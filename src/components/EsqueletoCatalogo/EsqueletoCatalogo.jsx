import Esqueleto, { EsqueletoCarta } from "../Esqueleto/Esqueleto.jsx";
import { useMediaQuery } from "../../hooks/useMediaQuery.js";
// Reutiliza las clases de la vista real (cabecera, lateral, casillas y lista)
import "../../pages/CatalogoMundo.css";

const ESCRITORIO = "(min-width: 56.25rem)";
// Color neutro: todavía no se sabe de qué mundo es
const NEUTRO = {
  "--mundo-color": "var(--fondo-inverso-2)",
  "--mundo-suave": "var(--fondo-sutil)",
};

// Las 20 cartas en blanco (también se usa dentro del catálogo al cambiar un filtro)
export function EsqueletoCartas({ cantidad = 20 }) {
  return (
    <ul className="catalogo__lista" aria-hidden="true">
      {Array.from({ length: cantidad }, (_, indice) => (
        <li key={indice}>
          <EsqueletoCarta />
        </li>
      ))}
    </ul>
  );
}

// Catálogo completo mientras llega el mundo. texto: estados.cargando (viene de la API)
export default function EsqueletoCatalogo({ texto }) {
  const escritorio = useMediaQuery(ESCRITORIO);

  return (
    <div className="catalogo" style={NEUTRO} aria-busy="true">
      <p className="solo-lectores" role="status">
        {texto}
      </p>

      <div aria-hidden="true">
        {escritorio ? (
          <header className="catalogo__cabecera catalogo__cabecera--web">
            <div className="catalogo__cabecera-interior">
              <Esqueleto tono="inverso" ancho="9.5rem" alto="1.25rem" />
              <Esqueleto tono="inverso" ancho="min(27rem, 70%)" alto="3.875rem" />
              <Esqueleto tono="inverso" ancho="min(38rem, 90%)" alto="1.75rem" />
            </div>
          </header>
        ) : (
          <header className="catalogo__cabecera catalogo__cabecera--movil">
            <div className="catalogo__encabezado">
              <Esqueleto tono="inverso" ancho="var(--objetivo-minimo)" alto="var(--objetivo-minimo)" className="esqueleto--circulo" />
              <div className="catalogo__nombres">
                <Esqueleto tono="inverso" ancho="60%" alto="1.625rem" />
                <Esqueleto tono="inverso" ancho="85%" alto="1rem" />
              </div>
              <Esqueleto tono="inverso" ancho="var(--objetivo-minimo)" alto="var(--objetivo-minimo)" className="esqueleto--circulo" />
            </div>
          </header>
        )}

        <div className="catalogo__contenido">
          {escritorio && (
            <aside className="catalogo__lateral">
              <section className="catalogo__panel">
                <Esqueleto ancho="5rem" alto="1.375rem" />
                {Array.from({ length: 6 }, (_, fila) => (
                  <Esqueleto key={fila} alto="2.75rem" />
                ))}
              </section>
              <section className="catalogo__panel">
                <Esqueleto ancho="9rem" alto="1.375rem" />
                {Array.from({ length: 4 }, (_, fila) => (
                  <Esqueleto key={fila} alto="1.5625rem" />
                ))}
              </section>
              <section className="catalogo__panel">
                <Esqueleto ancho="8rem" alto="1.375rem" />
                {Array.from({ length: 3 }, (_, fila) => (
                  <Esqueleto key={fila} alto="1.25rem" />
                ))}
              </section>
            </aside>
          )}

          <div className="catalogo__album">
            {escritorio ? (
              <div className="catalogo__herramientas">
                <Esqueleto ancho="9.75rem" alto="2.5rem" className="esqueleto--pildora" />
              </div>
            ) : (
              <div className="catalogo__filtros-movil">
                <Esqueleto ancho="9.25rem" alto="2.5rem" className="esqueleto--pildora" />
                <Esqueleto ancho="8.125rem" alto="2.5rem" className="esqueleto--pildora" />
              </div>
            )}
            <div className="catalogo__casillas">
              <EsqueletoCartas />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}