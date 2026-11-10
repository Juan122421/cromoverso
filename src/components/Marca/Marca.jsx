import { Link } from "react-router-dom";
import "./Marca.css";
import Icono from "../Icono/Icono.jsx";

export default function Marca({ texto, aria, to = "/", inversa = false, onClick }) {
  return (
    <Link
      className={`marca${inversa ? " marca--inversa" : ""}`}
      to={to}
      aria-label={aria}
      onClick={onClick}
    >
      <span className="marca__emblema" aria-hidden="true">
        <span className="marca__estrella">
          <Icono nombre="estrella" tamano="100%" />
        </span>
      </span>
      <span>{texto}</span>
    </Link>
  );
}