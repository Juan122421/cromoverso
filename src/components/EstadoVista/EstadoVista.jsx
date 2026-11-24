import "./EstadoVista.css";
import Icono from "../Icono/Icono.jsx";

// Tarjeta para los estados vacío y error de una vista.
// tono: "neutro" | "error" · rol: "alert" (error) o "status" (vacío)
export default function EstadoVista({ icono, titulo, texto, tono = "neutro", rol, children }) {
  return (
    <div className={`estado-vista estado-vista--${tono}`} role={rol}>
      {icono && (
        <span className="estado-vista__icono" aria-hidden="true">
          <Icono nombre={icono} tamano={28} />
        </span>
      )}
      <h2 className="estado-vista__titulo">{titulo}</h2>
      {texto && <p className="estado-vista__texto">{texto}</p>}
      {children && <div className="estado-vista__acciones">{children}</div>}
    </div>
  );
}