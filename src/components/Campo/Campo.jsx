import "./Campo.css";
import Icono from "../Icono/Icono.jsx";

// Campo de formulario: etiqueta visible asociada, caja y mensaje (error o ayuda).
// "acciones" es un espacio dentro de la caja (por ejemplo, el botón del ojo).
export default function Campo({
  id,
  etiqueta,
  tipo = "text",
  valor,
  onChange,
  placeholder,
  error,
  ayuda,
  inputRef,
  acciones,
  className = "",
  ...resto
}) {
  const idMensaje = `${id}-mensaje`;
  const mensaje = error ?? ayuda;

  return (
    <div className={`campo${error ? " campo--error" : ""} ${className}`.trim()}>
      <label className="campo__etiqueta" htmlFor={id}>
        {etiqueta}
      </label>
      <div className="campo__control">
        <input
          ref={inputRef}
          id={id}
          className={`campo__entrada${acciones ? " campo__entrada--con-accion" : ""}`}
          type={tipo}
          value={valor}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={mensaje ? idMensaje : undefined}
          {...resto}
        />
        {acciones}
      </div>
      {mensaje && (
        <p id={idMensaje} className={`campo__mensaje${error ? " campo__mensaje--error" : ""}`}>
          {error && <Icono nombre="alerta" tamano={14} />}
          {mensaje}
        </p>
      )}
    </div>
  );
}