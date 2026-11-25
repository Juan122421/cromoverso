import "./Casilla.css";
import Icono from "../Icono/Icono.jsx";

// Casilla de verificación: caja de 22 px y área táctil de 44 px (el input real, invisible, la cubre)
export default function Casilla({ id, checked, onChange, error, children, ...resto }) {
  return (
    <label className={`casilla${error ? " casilla--error" : ""}`} htmlFor={id}>
      <input
        id={id}
        className="casilla__entrada"
        type="checkbox"
        checked={checked}
        onChange={onChange}
        {...resto}
      />
      <span className="casilla__caja" aria-hidden="true">
        <Icono nombre="check" tamano={14} />
      </span>
      <span className="casilla__texto">{children}</span>
    </label>
  );
}