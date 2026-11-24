import { useRef } from "react";
import "./EsqueletoDetalle.css";
import Esqueleto, { EsqueletoCarta } from "../Esqueleto/Esqueleto.jsx";
import Icono from "../Icono/Icono.jsx";
import { useDialogo } from "../../hooks/useDialogo.js";
import { useMediaQuery } from "../../hooks/useMediaQuery.js";
// Reutiliza las clases del diálogo real
import "../DetalleCromo/DetalleCromo.css";

const ESCRITORIO = "(min-width: 56.25rem)";
// Color neutro: todavía no se sabe de qué mundo es el cromo
const NEUTRO = {
  "--mundo-color": "var(--borde-sutil)",
  "--mundo-suave": "var(--fondo-sutil)",
};

// Diálogo del detalle mientras llega el cromo.
// texto: estados.cargando · textoCerrar: paginas.detalleCromo.botones.cerrar (los dos vienen de la API)
export default function EsqueletoDetalle({ texto, textoCerrar, onCerrar }) {
  const escritorio = useMediaQuery(ESCRITORIO);
  const raiz = useRef(null);
  const botonCerrar = useRef(null);
  // El foco y Escape funcionan desde el primer momento: nadie queda atrapado esperando
  useDialogo({ raiz, inicial: botonCerrar, onCerrar });

  const cerrar = (
    <button
      ref={botonCerrar}
      type="button"
      className="detalle__cerrar"
      aria-label={textoCerrar}
      onClick={onCerrar}
    >
      <Icono nombre="cerrar" tamano={escritorio ? 20 : 22} />
    </button>
  );

  const poder = (
    <div className="esq-detalle__poder" aria-hidden="true">
      <Esqueleto ancho="4rem" alto="0.875rem" />
      <Esqueleto ancho="min(15rem, 80%)" alto="1.5rem" />
    </div>
  );

  const atributos = (
    <div className="detalle__atributos" aria-hidden="true">
      <Esqueleto ancho="7rem" alto="1.375rem" />
      <div className="detalle__atributos-lista">
        {[0, 1, 2, 3].map((fila) => (
          <div key={fila} className="detalle__atributo">
            <Esqueleto className="esq-detalle__etiqueta" />
            <Esqueleto className="esq-detalle__barra" />
            <Esqueleto className="esq-detalle__valor" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="detalle" ref={raiz} style={NEUTRO}>
      <div className="detalle__velo" aria-hidden="true" onClick={onCerrar} />

      <div
        className="detalle__dialogo"
        role="dialog"
        aria-modal="true"
        aria-busy="true"
        aria-label={texto}
      >
        <p className="solo-lectores" role="status">
          {texto}
        </p>

        {escritorio ? (
          <>
            <div className="detalle__carta" aria-hidden="true">
              <EsqueletoCarta tamano="g" />
            </div>

            <div className="detalle__info">
              <div className="detalle__etiquetas">
                <Esqueleto ancho="5rem" alto="1.5625rem" className="esqueleto--pildora" />
                <Esqueleto ancho="6rem" alto="1.5rem" className="esqueleto--pildora" />
                <Esqueleto ancho="3.5rem" alto="1.5rem" className="esqueleto--pildora" />
                <span className="detalle__espacio" />
                {cerrar}
              </div>
              <div className="detalle__titulo" aria-hidden="true">
                <Esqueleto ancho="12rem" alto="1rem" />
                <Esqueleto ancho="min(18rem, 80%)" alto="2.875rem" />
              </div>
              {poder}
              <div className="esq-detalle__texto" aria-hidden="true">
                <Esqueleto alto="1.25rem" />
                <Esqueleto ancho="70%" alto="1.25rem" />
              </div>
              {atributos}
            </div>
          </>
        ) : (
          <>
            <span className="detalle__asa" aria-hidden="true" />
            <div className="detalle__encabezado">{cerrar}</div>

            <div className="detalle__identidad" aria-hidden="true">
              <div className="detalle__carta-movil">
                <EsqueletoCarta tamano="m" />
              </div>
              <div className="detalle__datos">
                <Esqueleto ancho="40%" alto="1rem" />
                <Esqueleto alto="1.625rem" />
                <Esqueleto ancho="80%" alto="1.25rem" />
                <Esqueleto ancho="5rem" alto="1.5625rem" className="esqueleto--pildora" />
              </div>
            </div>
            {poder}
            {atributos}
          </>
        )}
      </div>
    </div>
  );
}