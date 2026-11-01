import "./Boton.css";
import Icono from "../Icono/Icono.jsx";

const TAMANO_ICONO = { g: 20, m: 18, p: 16 };

export default function Boton({
  variante = "primario", // primario | acento | secundario | fantasma
  tamano = "m", // g | m | p
  icono,
  deshabilitado = false,
  href,
  type = "button",
  className = "",
  children,
  ...resto
}) {
  const clases = `boton boton--${variante} boton--${tamano} ${className}`.trim();
  const contenido = (
    <>
      {icono && <Icono nombre={icono} tamano={TAMANO_ICONO[tamano]} />}
      {children}
    </>
  );
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
    <button className={clases} type={type} disabled={deshabilitado} {...resto}>
      {contenido}
    </button>
  );
}