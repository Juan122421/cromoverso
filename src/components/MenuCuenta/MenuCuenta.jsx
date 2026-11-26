import { useEffect, useId, useRef, useState } from "react";
import "./MenuCuenta.css";
import Icono from "../Icono/Icono.jsx";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import { useSesion } from "../../context/SesionContext.jsx";
import { useCerrarSesion } from "../../hooks/useCerrarSesion.js";
import { textoDeError } from "../../utils/errores.js";
import { iniciales, nombreVisible } from "../../utils/usuario.js";

// Botón de cuenta del navbar de escritorio. Abre el menú con el nombre, el correo y «Cerrar sesión».
export default function MenuCuenta({ className = "" }) {
  const { textos } = usePreferencias();
  const { usuario } = useSesion();
  const { cerrar, enviando, error } = useCerrarSesion();
  const [abierto, setAbierto] = useState(false);
  const raiz = useRef(null);
  const boton = useRef(null);
  const opcion = useRef(null);
  const idPanel = useId();
  const t = textos?.navbar?.usuario;

  // Abierto: el foco pasa a la opción; Escape devuelve el foco al botón y un clic fuera cierra
  useEffect(() => {
    if (!abierto) return undefined;
    opcion.current?.focus();

    function alPulsar(evento) {
      if (evento.key !== "Escape") return;
      evento.preventDefault();
      setAbierto(false);
      boton.current?.focus();
    }
    function alPulsarFuera(evento) {
      if (!raiz.current?.contains(evento.target)) setAbierto(false);
    }
    document.addEventListener("keydown", alPulsar);
    document.addEventListener("pointerdown", alPulsarFuera);
    return () => {
      document.removeEventListener("keydown", alPulsar);
      document.removeEventListener("pointerdown", alPulsarFuera);
    };
  }, [abierto]);

  // Con Tab, si el foco sale del menú hacia otro elemento, se cierra
  function alSalirElFoco(evento) {
    if (evento.relatedTarget && !raiz.current?.contains(evento.relatedTarget)) setAbierto(false);
  }

  if (!usuario || !t) return null;
  const nombre = nombreVisible(usuario);
  const siglas = iniciales(nombre);

  return (
    <div ref={raiz} className={`menu-cuenta ${className}`.trim()} onBlur={alSalirElFoco}>
      <button
        ref={boton}
        type="button"
        className="menu-cuenta__boton"
        aria-label={`${t.menu}: ${nombre}`}
        aria-expanded={abierto}
        aria-controls={idPanel}
        onClick={() => setAbierto((actual) => !actual)}
      >
        {siglas}
      </button>

      <div id={idPanel} className="menu-cuenta__panel" role="group" aria-label={t.menu} hidden={!abierto}>
        <div className="menu-cuenta__persona">
          <span className="menu-cuenta__avatar" aria-hidden="true">
            {siglas}
          </span>
          <div className="menu-cuenta__datos">
            <p className="menu-cuenta__nombre">{nombre}</p>
            <p className="menu-cuenta__correo">{usuario.correo}</p>
          </div>
        </div>

        <div className="menu-cuenta__divisor" aria-hidden="true" />

        <button
          ref={opcion}
          type="button"
          className="menu-cuenta__opcion"
          disabled={enviando}
          aria-busy={enviando || undefined}
          onClick={cerrar}
        >
          <Icono nombre="salir" tamano={18} />
          {t.cerrarSesion}
        </button>

        {error && (
          <p className="menu-cuenta__error" role="alert">
            <Icono nombre="alerta" tamano={14} />
            {textoDeError(error, textos)}
          </p>
        )}
      </div>
    </div>
  );
}