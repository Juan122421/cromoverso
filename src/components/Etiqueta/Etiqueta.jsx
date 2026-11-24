import "./Etiqueta.css";

// tono: "neutro" | "marca" | "alerta" | "mundo" (el último usa el color del mundo)
export default function Etiqueta({ tono = "neutro", className = "", children }) {
  return <span className={`etiqueta etiqueta--${tono} ${className}`.trim()}>{children}</span>;
}