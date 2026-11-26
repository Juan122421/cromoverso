import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./MenuMovil.css";
import Icono from "../Icono/Icono.jsx";
import Boton from "../Boton/Boton.jsx";
import Marca from "../Marca/Marca.jsx";
import SelectorIdioma from "../SelectorIdioma/SelectorIdioma.jsx";
import BotonAccesibilidad from "../BotonAccesibilidad/BotonAccesibilidad.jsx";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import { useSesion } from "../../context/SesionContext.jsx";
import { useCerrarSesion } from "../../hooks/useCerrarSesion.js";
import { DESTINOS } from "../../config/destinos.js";
import { textoDeError } from "../../utils/errores.js";
import { iniciales, nombreVisible } from "../../utils/usuario.js";

const ENFOCABLES = 'a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])';
const ESCRITORIO = "(min-width: 56.25rem)";

export default function MenuMovil({ abierto, onCerrar, botonRef }) {
  const { textos } = usePreferencias();
  const { usuario } = useSesion();
  const { cerrar, enviando, error } = useCerrarSesion();
  const panel = useRef(null);
  const botonCerrar = useRef(null);
  const t = textos?.menuMovil;
  const logo = textos?.navbar?.logo;

  useEffect(() => {
    if (!abierto) return undefined;
    const raiz = panel.current;
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // el fondo no se desplaza
    botonCerrar.current?.focus();

    function alPulsar(evento) {
      if (evento.key === "Escape") {
        evento.preventDefault();
        onCerrar();
        return;
      }
      if (evento.key !== "Tab") return;
      // Foco atrapado: Tab y Shift+Tab dan la vuelta dentro del panel
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

    const mediaEscritorio = window.matchMedia(ESCRITORIO);
    const alCambiarTamano = (evento) => {
      if (evento.matches) onCerrar(); // al pasar a escritorio el menú se cierra
    };

    document.addEventListener("keydown", alPulsar);
    mediaEscritorio.addEventListener("change", alCambiarTamano);

    return () => {
      document.body.style.overflow = overflowPrevio;
      document.removeEventListener("keydown", alPulsar);
      mediaEscritorio.removeEventListener("change", alCambiarTamano);
      botonRef.current?.focus(); // devuelve el foco al botón que lo abrió
    };
  }, [abierto, onCerrar, botonRef]);

  if (!t || !logo) return null;
  const enlaces = Object.keys(DESTINOS).filter((clave) => t.enlaces?.[clave]);
  const nombre = nombreVisible(usuario);

  async function salir() {
    if (await cerrar()) onCerrar();
  }

  return (
    <div
      id="menu-movil"
      ref={panel}
      className="menu-movil"
      role="dialog"
      aria-modal="true"
      aria-label={logo.texto}
      hidden={!abierto}
    >
      <div className="menu-movil__cabecera">
        <Marca texto={logo.texto} aria={logo.aria} onClick={onCerrar} />
        <button
          ref={botonCerrar}
          type="button"
          className="menu-movil__cerrar"
          aria-label={t.cerrar}
          onClick={onCerrar}
        >
          <Icono nombre="cerrar" tamano={22} />
        </button>
      </div>

      <nav className="menu-movil__enlaces">
        <ul>
          {enlaces.map((clave) => (
            <li key={clave}>
              <NavLink
                className="menu-movil__enlace"
                to={DESTINOS[clave].to}
                end={clave === "inicio"}
                onClick={onCerrar}
              >
                {({ isActive }) => (
                  <>
                    <span className="menu-movil__icono">
                      <Icono nombre={DESTINOS[clave].icono} tamano={24} />
                    </span>
                    <span className="menu-movil__texto">{t.enlaces[clave]}</span>
                    {isActive ? (
                      <span className="menu-movil__aqui">{t.aria.estasAqui}</span>
                    ) : (
                      <span className="menu-movil__chevron">
                        <Icono nombre="chevronDer" tamano={20} />
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="menu-movil__preferencias">
        <div className="menu-movil__fila">
          <span>{t.secciones.idioma}</span>
          <SelectorIdioma />
        </div>
        <div className="menu-movil__fila">
          <span>{t.secciones.accesibilidad}</span>
          <BotonAccesibilidad />
        </div>
      </div>

      {usuario && error && (
        <p className="menu-movil__error" role="alert">
          <Icono nombre="alerta" tamano={14} />
          {textoDeError(error, textos)}
        </p>
      )}

      {usuario ? (
        <div className="menu-movil__sesion menu-movil__sesion--activa">
          <span className="menu-movil__avatar" aria-hidden="true">
            {iniciales(nombre)}
          </span>
          <div className="menu-movil__usuario">
            <p className="menu-movil__nombre">{nombre}</p>
            <p className="menu-movil__alias">@{usuario.alias}</p>
          </div>
          <Boton variante="secundario" tamano="p" icono="salir" cargando={enviando} onClick={salir}>
            {t.botones.cerrarSesion}
          </Boton>
        </div>
      ) : (
        <div className="menu-movil__sesion">
          <Boton variante="secundario" tamano="m" to="/ingresar" onClick={onCerrar}>
            {t.botones.ingresar}
          </Boton>
          <Boton tamano="m" to="/registro" onClick={onCerrar}>
            {t.botones.crearCuenta}
          </Boton>
        </div>
      )}
    </div>
  );
}