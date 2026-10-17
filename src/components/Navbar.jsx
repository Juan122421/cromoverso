import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import Icono from "./Icono.jsx";

const DESTINOS = {
    album: "#album",
    sobres: "#sobres",
    intercambios: "#intercambios",
    mundos: "#mundos",
    ranking: "#ranking",
};

const Navbar = ({
    textos, cargando, error, recargar,
    idioma, onBuscar, textoGrande, alternarTexto, cambiarIdioma, activo,
}) => {
    const [abierto, setAbierto] = useState(false); 
    const [busqueda, setBusqueda] = useState("");
    const botonMenu = useRef(null);
    const campoBusqueda = useRef(null);
    const nav = textos?.navbar;
    const ingles = idioma === "en";

    const abrir = textos?.menuMovil?.abrir ?? (ingles ? "Open menu" : "Abrir menú");
    const cerrar = textos?.menuMovil?.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");
    const etiquetaAccesibilidad =
        nav?.aria?.accesibilidad ??
        textos?.accesibilidad?.titulo ??
        (ingles ? "Accessibility" : "Accesibilidad");

    const enlaces = Object.keys(DESTINOS).filter((clave) => nav?.enlaces?.[clave]);

    useEffect(() => {
        if (!abierto) return;
        function cerrarConEscape(evento) {
            if (evento.key === "Escape") {
                setAbierto(false);
                botonMenu.current?.focus();
            }
        }
        document.addEventListener("keydown", cerrarConEscape);
        return () => document.removeEventListener("keydown", cerrarConEscape);
    }, [abierto]);

    function abrirBusqueda() {
        setAbierto(true);
        requestAnimationFrame(() => campoBusqueda.current?.focus());
    }

    function buscar(evento) {
        evento.preventDefault();
        const consulta = busqueda.trim();
        if (!consulta) return;
        onBuscar?.(consulta);
        setAbierto(false);
    }

    return (
        <header className="navbar">
            <nav
                className="navbar-interior"
                aria-label={nav?.aria?.menu ?? (ingles ? "Main navigation" : "Navegación principal")}
            >
                <a
                    href="#inicio"
                    className="navbar-marca"
                    aria-label={nav?.logo?.aria ?? "Cromoverso"}
                    onClick={() => setAbierto(false)}
                >
                    <span className="navbar-simbolo" aria-hidden="true">
                        <Icono nombre="estrella" />
                    </span>
                    <span>{nav?.logo?.texto ?? "cromoverso"}</span>
                </a>

                <div className="navbar-movil-acciones">
                    <button
                        type="button"
                        className="navbar-icono"
                        aria-label={nav?.buscador?.aria ?? (ingles ? "Search" : "Buscar")}
                        onClick={abrirBusqueda}
                    >
                        <Icono nombre="buscar" />
                    </button>
                    <button
                        type="button"
                        ref={botonMenu}
                        className="navbar-icono"
                        aria-label={abierto ? cerrar : abrir}
                        aria-expanded={abierto}
                        aria-controls="navbar-panel"
                        onClick={() => setAbierto((valor) => !valor)}
                    >
                        <Icono nombre={abierto ? "cerrar" : "menu"} />
                    </button>
                </div>

                <div
                    id="navbar-panel"
                    className={`navbar-panel${abierto ? " is-abierto" : ""}`}
                    aria-busy={cargando}
                >
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
                                        <a
                                            href={DESTINOS[clave]}
                                            aria-current={activo === clave ? "page" : undefined}
                                            onClick={() => setAbierto(false)}
                                        >
                                            {nav.enlaces[clave]}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            <form className="navbar-buscador" role="search" aria-label={nav.buscador.aria} onSubmit={buscar}>
                                <button type="submit" aria-label={nav.buscador.boton}>
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
                        <label className="navbar-idioma">
                            <Icono nombre="idioma" />
                            <select
                                value={idioma}
                                onChange={(evento) => cambiarIdioma(evento.target.value)}
                                aria-label={nav?.aria?.idioma ?? (ingles ? "Change language" : "Cambiar idioma")}
                            >
                                <option value="es">ES</option>
                                <option value="en">EN</option>
                            </select>
                            <Icono nombre="chevron" />
                        </label>

                        <button
                            className="navbar-icono navbar-accesibilidad"
                            type="button"
                            aria-label={etiquetaAccesibilidad}
                            aria-pressed={textoGrande}
                            onClick={alternarTexto}
                        >
                            <Icono nombre="accesibilidad" />
                        </button>

                        {nav && (
                            <>
                                <a className="navbar-accion navbar-accion-secundaria" href="#ingresar" onClick={() => setAbierto(false)}>
                                    {nav.botones.ingresar}
                                </a>
                                <a className="navbar-accion" href="#registro" onClick={() => setAbierto(false)}>
                                    {nav.botones.crearCuenta}
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;