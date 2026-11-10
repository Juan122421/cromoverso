import { usePreferencias } from "../context/PreferenciasContext.jsx";

// Página de relleno para rutas cuya vista aún no existe.
// El título sale de la API (clave dentro de navbar.enlaces o navbar.botones).
export default function Provisional({ grupo = "enlaces", clave, detalle }) {
  const { textos } = usePreferencias();
  return (
    <section className="pagina">
      <h1>{textos?.navbar?.[grupo]?.[clave]}</h1>
      {detalle && <p>{detalle}</p>}
    </section>
  );
}