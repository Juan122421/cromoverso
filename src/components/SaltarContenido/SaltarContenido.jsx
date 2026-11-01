import "./SaltarContenido.css";

export default function SaltarContenido({ texto }) {
  return (
    <a className="saltar-contenido" href="#contenido">
      {texto}
    </a>
  );
}