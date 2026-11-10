import "./BotonAccesibilidad.css";
import Icono from "../Icono/Icono.jsx";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";

// Provisional: alterna el tamaño del texto. Lo reemplaza el panel de accesibilidad.
export default function BotonAccesibilidad({ className = "" }) {
  const { textos, textoGrande, alternarTexto } = usePreferencias();
  const etiqueta = textos?.navbar?.aria?.accesibilidad;
  if (!etiqueta) return null;

  return (
    <button
      type="button"
      className={`boton-accesibilidad ${className}`.trim()}
      aria-label={etiqueta}
      aria-pressed={textoGrande}
      onClick={alternarTexto}
    >
      <Icono nombre="accesibilidad" tamano={20} />
    </button>
  );
}