import { Link } from "react-router-dom";
import "./Marca.css";
import Icono from "../Icono/Icono.jsx";

export default function Marca({ texto, aria, to = "/", inversa = false, decorativa = false, onClick }) {
  const clases = `marca${inversa ? " marca--inversa" : ""}`;
  const contenido = (
    <>
      <span className="marca__emblema" aria-hidden="true">
        <span className="marca__estrella">
          <Icono nombre="estrella" tamano="100%" />
        </span>
      </span>
      <span>{texto}</span>
    </>
  );

  // Sin enlace: el logo solo decora (por ejemplo, el escenario de la pantalla de ingreso)
  if (decorativa) {
    return (
      <span className={clases} aria-hidden="true">
        {contenido}
      </span>
    );
  }

  return (
    <Link className={clases} to={to} aria-label={aria} onClick={onClick}>
      {contenido}
    </Link>
  );
}