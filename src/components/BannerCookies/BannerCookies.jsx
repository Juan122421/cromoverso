import "./BannerCookies.css";
import Boton from "../Boton/Boton.jsx";

// Rechazar y Aceptar tienen el mismo tamaño (M); solo cambia el color, como en Figma
export default function BannerCookies({ textos, onAceptar, onRechazar }) {
  return (
    <section className="banner-cookies" aria-labelledby="banner-cookies-titulo">
      <div className="banner-cookies__texto">
        <h2 id="banner-cookies-titulo" className="banner-cookies__titulo">
          {textos.titulo}
        </h2>
        <p className="banner-cookies__descripcion">{textos.texto}</p>
      </div>
      <div className="banner-cookies__acciones">
        <Boton variante="secundario" tamano="m" onClick={onRechazar}>
          {textos.botones.rechazar}
        </Boton>
        <Boton variante="primario" tamano="m" onClick={onAceptar}>
          {textos.botones.aceptar}
        </Boton>
      </div>
    </section>
  );
}