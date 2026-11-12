import { useEffect, useRef } from "react";
import "./PanelAccesibilidad.css";
import Icono from "../Icono/Icono.jsx";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";

const ENFOCABLES = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const TAMANOS = ["normal", "grande", "muyGrande"];

function Interruptor({ marcado, onCambiar, etiqueta }) {
  return (
    <button
      type="button"
      className={`panel-a11y__switch${marcado ? " is-encendido" : ""}`}
      role="switch"
      aria-checked={marcado}
      aria-label={etiqueta}
      onClick={onCambiar}
    />
  );
}

export default function PanelAccesibilidad() {
  const {
    textos,
    accesibilidad,
    cambiarAccesibilidad,
    restablecerAccesibilidad,
    panelAccesibilidad,
    cerrarPanelAccesibilidad,
  } = usePreferencias();
  const dialogo = useRef(null);
  const cerrar = useRef(null);
  const t = textos?.accesibilidad;

  useEffect(() => {
    if (!panelAccesibilidad) return undefined;
    const raiz = dialogo.current;
    cerrar.current?.focus();

    function alPulsar(evento) {
      if (evento.key === "Escape") {
        evento.preventDefault();
        cerrarPanelAccesibilidad();
        return;
      }
      if (evento.key !== "Tab" || !raiz) return;
      const items = [...raiz.querySelectorAll(ENFOCABLES)];
      if (items.length === 0) return;
      const primero = items[0];
      const ultimo = items[items.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", alPulsar);
    return () => document.removeEventListener("keydown", alPulsar);
  }, [panelAccesibilidad, cerrarPanelAccesibilidad]);

  if (!t) return null;

  const ayuda = (clave) => t[clave]?.ayuda;
  const etiquetaSwitch = (clave, marcado) =>
    `${t[clave].titulo}: ${marcado ? t.etiquetas.encendido : t.etiquetas.apagado}`;

  return (
    <div
      className="panel-a11y"
      hidden={!panelAccesibilidad}
    >
      <button
        type="button"
        className="panel-a11y__fondo"
        tabIndex={-1}
        aria-label={textos?.menuMovil?.cerrar ?? t.titulo}
        onClick={cerrarPanelAccesibilidad}
      />
      <div
        id="panel-accesibilidad"
        ref={dialogo}
        className="panel-a11y__dialogo"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-a11y-titulo"
      >
        <div className="panel-a11y__cabecera">
          <h2 id="panel-a11y-titulo" className="panel-a11y__titulo">
            {t.titulo}
          </h2>
          <button
            ref={cerrar}
            type="button"
            className="panel-a11y__cerrar"
            aria-label={textos?.menuMovil?.cerrar}
            onClick={cerrarPanelAccesibilidad}
          >
            <Icono nombre="cerrar" tamano={18} />
          </button>
        </div>

        <fieldset className="panel-a11y__grupo">
          <legend className="panel-a11y__leyenda">{t.tamanoTexto.titulo}</legend>
          <div className="panel-a11y__tamanos" role="group" aria-label={t.tamanoTexto.titulo}>
            {TAMANOS.map((clave) => (
              <button
                type="button"
                key={clave}
                className="panel-a11y__tamano"
                aria-pressed={accesibilidad.tamanoTexto === clave}
                onClick={() => cambiarAccesibilidad({ tamanoTexto: clave })}
              >
                {t.tamanoTexto.opciones[clave]}
              </button>
            ))}
          </div>
        </fieldset>

        <ul className="panel-a11y__opciones">
          {["altoContraste", "reducirMovimiento", "subrayarEnlaces", "fuenteLecturaFacil"].map((clave) => (
            <li key={clave} className="panel-a11y__fila">
              <div className="panel-a11y__textos">
                <p className="panel-a11y__nombre">{t[clave].titulo}</p>
                {ayuda(clave) && <p className="panel-a11y__ayuda">{ayuda(clave)}</p>}
              </div>
              <Interruptor
                marcado={accesibilidad[clave]}
                onCambiar={() => cambiarAccesibilidad({ [clave]: !accesibilidad[clave] })}
                etiqueta={etiquetaSwitch(clave, accesibilidad[clave])}
              />
            </li>
          ))}
        </ul>

        <div className="panel-a11y__pie">
          <a className="panel-a11y__declaracion" href="#contenido" onClick={cerrarPanelAccesibilidad}>
            {t.enlaces.declaracion}
          </a>
          <button
            type="button"
            className="panel-a11y__restablecer"
            onClick={restablecerAccesibilidad}
          >
            {t.botones.restablecer}
          </button>
        </div>
      </div>
    </div>
  );
}
