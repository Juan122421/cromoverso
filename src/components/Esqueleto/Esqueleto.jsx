import "./Esqueleto.css";

// Bloque gris animado que ocupa el lugar de un contenido que aún no llega.
// tono: "suave" (sobre fondo claro) | "inverso" (sobre fondo oscuro o de color)
export default function Esqueleto({ ancho, alto, tono = "suave", className = "" }) {
  return (
    <span
      className={`esqueleto esqueleto--${tono} ${className}`.trim()}
      style={{ width: ancho, height: alto }}
      aria-hidden="true"
    />
  );
}

// Carta en blanco. tamano: "g" | "m" | "p" | "catalogo" (p en móvil, m en escritorio)
export function EsqueletoCarta({ tamano = "catalogo" }) {
  return (
    <span className={`esqueleto-carta esqueleto-carta--${tamano}`} aria-hidden="true">
      <Esqueleto className="esqueleto-carta__arte" />
      <Esqueleto className="esqueleto-carta__linea" />
    </span>
  );
}