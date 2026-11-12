import "./EtiquetaRareza.css";
import Icono from "../Icono/Icono.jsx";

// rareza: "comun" | "rara" | "epica" | "legendaria". El icono sale de GET /rarezas.
export default function EtiquetaRareza({ rareza, icono, texto, className = "" }) {
  return (
    <span className={`etiqueta-rareza etiqueta-rareza--${rareza} ${className}`.trim()}>
      <span className="etiqueta-rareza__icono" aria-hidden="true">
        <Icono nombre={icono} tamano={14} />
      </span>
      {texto}
    </span>
  );
}