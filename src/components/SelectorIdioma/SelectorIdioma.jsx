import "./SelectorIdioma.css";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";

export default function SelectorIdioma({ className = "" }) {
  const { idioma, cambiarIdioma, textos } = usePreferencias();
  const t = textos?.idioma;
  if (!t) return null;

  return (
    <div
      className={`selector-idioma ${className}`.trim()}
      role="group"
      aria-label={t.etiqueta}
    >
      {Object.entries(t.codigos).map(([codigo, etiqueta]) => (
        <button
          type="button"
          key={codigo}
          lang={codigo}
          className="selector-idioma__opcion"
          aria-pressed={idioma === codigo}
          aria-label={t.opciones[codigo]}
          onClick={() => cambiarIdioma(codigo)}
        >
          {etiqueta}
        </button>
      ))}
    </div>
  );
}