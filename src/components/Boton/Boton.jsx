import { Link } from "react-router-dom";
import "./Boton.css";
import Icono from "../Icono/Icono.jsx";

const TAMANO_ICONO = { g: 20, m: 18, p: 16 };

export default function Boton({
  variante = "primario", // primario | acento | secundario | fantasma
  tamano = "m", // g | m | p
  icono,
  iconoAlFinal = false, // true: el icono va después del texto
  deshabilitado = false,
  cargando = false, // enviando: deshabilitado, con indicador y aria-busy
  to, // ruta interna del router: "/ingresar"
  href, // enlace externo o ancla
  type = "button",
  className = "",
  children,
  ...resto
}) {
  const clases = `boton boton--${variante} boton--${tamano}${cargando ? " boton--cargando" : ""} ${className}`.trim();
  const iconoJsx =
    icono && !cargando ? <Icono nombre={icono} tamano={TAMANO_ICONO[tamano]} /> : null;
  const contenido = (
    <>
      {cargando && <span className="boton__indicador" aria-hidden="true" />}
      {!iconoAlFinal && iconoJsx}
      {children}
      {iconoAlFinal && iconoJsx}
    </>
  );

  if (to) {
    return (
      <Link className={clases} to={to} {...resto}>
        {contenido}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        className={clases}
        href={deshabilitado ? undefined : href}
        aria-disabled={deshabilitado || undefined}
        {...resto}
      >
        {contenido}
      </a>
    );
  }

  return (
    <button
      className={clases}
      type={type}
      disabled={deshabilitado || cargando}
      aria-busy={cargando || undefined}
      {...resto}
    >
      {contenido}
    </button>
  );
}