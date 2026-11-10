import "./Cromo.css";
import Icono from "../Icono/Icono.jsx";

// La carta se dibuja con CSS: no hay imágenes (la API da colorBase y figura).
// tamano: "g" (portada) | "m" (catálogo web) | "p" (catálogo móvil)
export default function Cromo({
  cromo,
  tamano = "m",
  iconoRareza,
  rarezaTexto,
  detalle,
  className = "",
}) {
  const numero = String(cromo.numero).padStart(3, "0");
  const estilo = { "--cromo-color": cromo.ilustracion?.colorBase };

  return (
    <article
      className={`cromo cromo--${tamano} cromo--${cromo.rareza} ${className}`.trim()}
      style={estilo}
    >
      <div className="cromo__arte" aria-hidden="true">
        <span className="cromo__rayos" />
        <span className="cromo__halo" />
        <span className="cromo__hombros" />
        <span className="cromo__cabeza" />
        <span className="cromo__antifaz" />
        <span className="cromo__emblema">
          <Icono nombre={cromo.ilustracion?.figura ?? "estrella"} tamano="100%" />
        </span>
        {cromo.holografico && <span className="cromo__holograma" />}
      </div>

      <span className="cromo__numero">{numero}</span>

      {/* La rareza nunca va solo con color: icono + palabra (para lectores de pantalla) */}
      <span className="cromo__rareza">
        <Icono nombre={iconoRareza} tamano="100%" />
        {rarezaTexto && <span className="solo-lectores">{rarezaTexto}</span>}
      </span>

      <div className="cromo__pie">
        <p className="cromo__nombre">{cromo.nombre}</p>
        {detalle && <p className="cromo__detalle">{detalle}</p>}
      </div>
    </article>
  );
}