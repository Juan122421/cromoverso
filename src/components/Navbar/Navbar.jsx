import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import Icono from "../Icono/Icono.jsx";
import Boton from "../Boton/Boton.jsx";
import MenuMovil from "../MenuMovil/MenuMovil.jsx";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import SelectorIdioma from "../SelectorIdioma/SelectorIdioma.jsx";
import { Link, NavLink } from "react-router-dom";
const DESTINOS = {
    inicio: "/",
    mundos: "/mundos",
};

const Navbar = () => {
    const {
        textos, cargando, error, recargar,
        idioma, textoGrande, alternarTexto,
    } = usePreferencias();
    const [abierto, setAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const botonMenu = useRef(null);
    const campoBusqueda = useRef(null);
    const nav = textos?.navbar;
    const ingles = idioma === "en";
    const abrir = textos?.menuMovil?.abrir ?? (ingles ? "Open menu" : "Abrir menú");
    const cerrar = textos?.menuMovil?.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");
    const enlaces = Object.keys(DESTINOS).filter((clave) => nav?.enlaces?.[clave]);

    function abrirBusqueda() {
        setAbierto(true);
        requestAnimationFrame(() => campoBusqueda.current?.focus());
    }

    function buscar(evento) {
        evento.preventDefault();
        const consulta = busqueda.trim();
        if (!consulta) return;
       // La busqueda la conectamos más adelante
        setAbierto(false);
    }

    return (
        <header className="navbar">
            <nav
                className="navbar-interior"
                aria-label={ingles ? "Main navigation" : "Navegación principal"}
            >
                <Link
                    to ="/"
                    className="navbar-marca"
                    aria-label={nav?.logo?.aria ?? "Cromoverso"}
                    onClick={() => setAbierto(false)}
                >
                    <span className="navbar-simbolo" aria-hidden="true">
                        <Icono nombre="estrella" />
                    </span>
                    <span>{nav?.logo?.texto ?? "cromoverso"}</span>

                </Link>
                {/* Acciones del navbar móvil */}
                <div className="navbar-movil-acciones">
                    <button
                    type="button"
                    className="navbar-icono"
                    aria-label={nav?.buscador?.aria ?? (ingles ? "Search" : "Buscar")}
                    onClick={abrirBusqueda}
                >
                    <Icono nombre="buscar" />
                </button>

                <MenuMovil
                        abierto={abierto}
                        onAlternar={() => setAbierto((valor) => !valor)}
                        menuId="navbar-panel"
                        botonRef={botonMenu}
                        etiquetaAbrir={abrir}
                        etiquetaCerrar={cerrar}
                     />
                </div>

                <div
                    id="navbar-panel"
                    className={`navbar-panel${abierto ? " is-abierto" : ""}`}
                    aria-busy={cargando}
                >
                    {/* Estos dos mensajes van a mano: sin textos de la API no hay de dónde sacarlos */}
                    {cargando && !nav && (
                        <p className="navbar-estado" role="status">
                            {ingles ? "Loading navigation…" : "Cargando navegación…"}
                        </p>
                    )}
                    {error && !nav && (
                        <div className="navbar-estado" role="alert">
                            <p>{ingles ? "Navigation could not be loaded." : "No pudimos cargar el menú."}</p>
                            <button type="button" onClick={recargar}>
                                {ingles ? "Try again" : "Reintentar"}
                            </button>
                        </div>
                    )}

                    {nav && (
                        <>
                            <ul className="navbar-enlaces">
                                {enlaces.map((clave) => (
                                    <li key={clave}>
                                        <NavLink
                                            href={DESTINOS[clave]}
                                            end ={clave==="inicio"}
                                            onClick={() => setAbierto(false)}
                                        >
                                            {nav.enlaces[clave]}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>

                            <form className="navbar-buscador" role="search" aria-label={nav.buscador.aria} onSubmit={buscar}>
                                <button type="submit" aria-label={nav.buscador.aria}>
                                    <Icono nombre="buscar" />
                                </button>
                                <input
                                    ref={campoBusqueda}
                                    type="search"
                                    value={busqueda}
                                    onChange={(evento) => setBusqueda(evento.target.value)}
                                    placeholder={nav.buscador.placeholder}
                                    aria-label={nav.buscador.aria}
                                    required
                                />
                            </form>
                        </>
                    )}

                    <div className="navbar-utilidades">
                        <SelectorIdioma />
                        <button
                            className="navbar-icono navbar-accesibilidad"
                            type="button"
                            aria-label={nav?.aria?.accesibilidad ?? (ingles ? "Accessibility" : "Accesibilidad")}
                            aria-pressed={textoGrande}
                            onClick={alternarTexto}
                        >
                            <Icono nombre="accesibilidad" />
                        </button>

                        {nav && (
                            <>
                                <Boton variante="secundario" tamaño="p" to="/ingresar" onClick={() => setAbierto(false)}>
                                    {nav.botones.ingresar}
                                </Boton>
                                <Boton tamaño="p" to="/registro" onClick={() => setAbierto(false)}>
                                    {nav.botones.crearCuenta}
                                </Boton>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;