import { Link } from "react-router-dom";
import "./TarjetaMundo.css";
import Icono from "../Icono/Icono.jsx";
import { iconoDeFigura } from "../../config/mundos.js";

// Fondo suave de cada mundo (tokens de Figma). Si el id no está aquí,
// el CSS calcula el fondo mezclando el color del mundo con blanco.
const SUAVES = {
  neon: "var(--mundo-neon-suave)",
  coral: "var(--mundo-coral-suave)",
  bosque: "var(--mundo-bosque-suave)",
  forja: "var(--mundo-forja-suave)",
  orbita: "var(--mundo-orbita-suave)",
  niebla: "var(--mundo-niebla-suave)",
};

export default function TarjetaMundo({ mundo, etiqueta, cantidad }) {
  const estilo = { "--mundo-color": mundo.color };
  if (SUAVES[mundo.id]) estilo["--mundo-suave"] = SUAVES[mundo.id];

  return (
    <Link className="tarjeta-mundo" to={`/mundos/${mundo.id}`} style={estilo}>
      <span className="tarjeta-mundo__arriba">
        <span className="tarjeta-mundo__emblema" aria-hidden="true">
          <Icono nombre={iconoDeFigura(mundo.figura)} tamaño={22} />
          <Icono nombre={mundo.figura} tamano={22} />
        </span>
        {etiqueta && <span className="tarjeta-mundo__etiqueta">{etiqueta}</span>}
      </span>
      <span className="tarjeta-mundo__nombre">{mundo.nombre}</span>
      <span className="tarjeta-mundo__cantidad">{cantidad}</span>
    </Link>
  );
}