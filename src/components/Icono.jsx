import Estrella from "../assets/icons/estrella.svg?react";
import Buscar from "../assets/icons/buscar.svg?react";
import Idioma from "../assets/icons/globo.svg?react";
import Chevron from "../assets/icons/chevronAbajo.svg?react";
import Accesibilidad from "../assets/icons/accesibilidad.svg?react";
import Menu from "../assets/icons/menu.svg?react";
import Cerrar from "../assets/icons/cerrar.svg?react";

const ICONOS = {
    estrella: Estrella,
    buscar: Buscar,
    idioma: Idioma,
    chevron: Chevron,
    accesibilidad: Accesibilidad,
    menu: Menu,
    cerrar: Cerrar,
};

export default function Icono({ nombre, tamano = 20 }) {
    const Componente = ICONOS[nombre];
    if (!Componente) return null;
    return <Componente width={tamano} height={tamano} aria-hidden="true" focusable="false" />;
}