import "./BotonAccesibilidad.css";
import Icono from "../Icono/Icono.jsx";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";

export default function BotonAccesibilidad({ className = "", onAntesDeAbrir }) {
  const { textos, panelAccesibilidad, alternarPanelAccesibilidad } = usePreferencias();
  const etiqueta =
    textos?.accesibilidad?.botones?.abrir ?? textos?.navbar?.aria?.accesibilidad;
  if (!etiqueta) return null;

  return (
    <button
      type="button"
      className={`boton-accesibilidad ${className}`.trim()}
      aria-label={etiqueta}
      aria-expanded={panelAccesibilidad}
      aria-controls="panel-accesibilidad"
      onClick={() => {
        if (!panelAccesibilidad) onAntesDeAbrir?.();
        alternarPanelAccesibilidad();
      }}
    >
      <Icono nombre="accesibilidad" tamano={20} />
    </button>
  );
}
