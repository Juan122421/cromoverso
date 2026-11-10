import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import Icono from "../Icono/Icono.jsx";
import Boton from "../Boton/Boton.jsx";
import Marca from "../Marca/Marca.jsx";
import SelectorIdioma from "../SelectorIdioma/SelectorIdioma.jsx";
import BotonAccesibilidad from "../BotonAccesibilidad/BotonAccesibilidad.jsx";
import MenuMovil from "../MenuMovil/MenuMovil.jsx";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import { DESTINOS } from "../../config/destinos.js";

// tono="oscuro" pinta el encabezado móvil oscuro (portadas oscuras).
// En escritorio el navbar siempre es blanco.
export default function Navbar({ tono = "claro" }) {
  const { textos, cargando, error, recargar, idioma } = usePreferencias();
  const [abierto, setAbierto] = useState(false);
  const botonMenu = useRef(null);
  const { pathname } = useLocation();
  const cerrarMenu = useCallback(() => setAbierto(false), []);
  const nav = textos?.navbar;
  const ingles = idioma === "en";

  // El menú móvil se cierra al navegar
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  const enlaces = Object.keys(DESTINOS).filter((clave) => nav?.enlaces?.[clave]);

  return (
    <>
      <header className={`navbar navbar--${tono}`}>
        <div className="navbar__interior">
          <div className="navbar__izquierda">
            <Marca texto={nav?.logo?.texto ?? "cromoverso"} aria={nav?.logo?.aria} />

            {nav && (
              <nav className="navbar__enlaces solo-escritorio">
                <ul>
                  {enlaces.map((clave) => (
                    <li key={clave}>
                      {/* NavLink agrega solo aria-current="page" al enlace activo */}
                      <NavLink
                        className="navbar__enlace"
                        to={DESTINOS[clave].to}
                        end={clave === "inicio"}
                      >
                        {nav.enlaces[clave]}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          {nav ? (
            <div className="navbar__derecha">
              <BotonAccesibilidad className="solo-escritorio" />
              <SelectorIdioma className="solo-escritorio" />
              <Boton variante="secundario" tamano="p" to="/ingresar">
                {nav.botones.ingresar}
              </Boton>
              <Boton tamano="p" to="/registro" className="solo-escritorio">
                {nav.botones.crearCuenta}
              </Boton>
              <button
                ref={botonMenu}
                type="button"
                className="navbar__menu solo-movil"
                aria-label={textos.menuMovil.abrir}
                aria-expanded={abierto}
                aria-controls="menu-movil"
                onClick={() => setAbierto(true)}
              >
                <Icono nombre="menu" tamano={22} />
              </button>
            </div>
          ) : (
            // Excepción a "ningún texto escrito a mano": sin respuesta de la API no hay de dónde sacarlos
            <div className="navbar__estado">
              {cargando && <p role="status">{ingles ? "Loading…" : "Cargando…"}</p>}
              {error && (
                <div role="alert">
                  <p>{ingles ? "Navigation could not be loaded." : "No pudimos cargar el menú."}</p>
                  <Boton variante="secundario" tamano="p" onClick={recargar}>
                    {ingles ? "Try again" : "Reintentar"}
                  </Boton>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {nav && <MenuMovil abierto={abierto} onCerrar={cerrarMenu} botonRef={botonMenu} />}
    </>
  );
}