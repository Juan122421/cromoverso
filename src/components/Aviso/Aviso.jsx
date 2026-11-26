import "./Aviso.css";
import Icono from "../Icono/Icono.jsx";

// Mensaje de estado dentro de un formulario. Siempre lleva icono y texto, nunca solo color.
// Los errores van con role="alert" (se anuncian solos).
export default function Aviso({
  titulo,
  children,
  anunciar = true,
  className = ""
}) {
  return (
    <div
      className={`aviso ${className}`.trim()}
      role={anunciar ? "alert" : undefined}
      aria-hidden={anunciar ? undefined : true}
    >
      <span className="aviso__icono" aria-hidden="true">
        <Icono nombre="alerta" tamano={20} />
      </span>

      <div className="aviso__contenido">
        <p className="aviso__titulo">{titulo}</p>
        {children && <p className="aviso__texto">{children}</p>}
      </div>
    </div>
  );
}