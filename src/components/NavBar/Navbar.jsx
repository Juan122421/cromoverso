import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import Icono from "../Icono/Icono.jsx";
import Boton from "../Boton/Boton.jsx";
import MenuMovil from "../MenuMovil/MenuMovil.jsx";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";

const DESTINOS = {
    inicio: "#inicio",
    mundos: "#mundos",
};

// Provisional: cuando haya enrutamiento real, la sección activa sale de la ruta
function leerSeccion() {
    return window.location.hash.slice(1) || "inicio";
}

const Navbar = () => {
    const {
        textos, cargando, error, recargar,
        idioma, cambiarIdioma, textoGrande, alternarTexto,
    } = usePreferencias();
    const [activo, setActivo] = useState(leerSeccion);
    const [abierto, setAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const botonMenu = useRef(null);
    const campoBusqueda = useRef(null);
    const nav = textos?.navbar;
    const ingles = idioma === "en";
    const abrir = textos?.menuMovil?.abrir ?? (ingles ? "Open menu" : "Abrir menú");
    const cerrar = textos?.menuMovil?.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");
    const enlaces = Object.keys(DESTINOS).filter((clave) => nav?.enlaces?.[clave]);


    useEffect(() => {
        const actualizar = () => setActivo(leerSeccion());
        window.addEventListener("hashchange", actualizar);
        return () => window.removeEventListener("hashchange", actualizar);
    }, []);

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
                            aria-label={nav?.aria?.accesibilidad ?? (ingles ? "Accessibility" : "Accesibilidad")}
                            aria-pressed={textoGrande}
                            onClick={alternarTexto}
                        >
                            <Icono nombre="accesibilidad" />
                        </button>

                        {nav && (
                            <>
                                <Boton variante="secundario" tamano="p" href="#ingresar" onClick={() => setAbierto(false)}>
                                    {nav.botones.ingresar}
                                </Boton>
                                <Boton tamano="p" href="#registro" onClick={() => setAbierto(false)}>
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