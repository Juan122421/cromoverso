import { Link } from "react-router-dom";
import { usePreferencias } from "../context/PreferenciasContext.jsx";
import { useTitulo } from "../hooks/useTitulo.js";

// Provisional: la recuperación de la contraseña se construye en el sprint 3
export default function RecuperarClaveProvisional() {
  const { textos } = usePreferencias();
  const t = textos?.paginas?.recuperarClave;
  useTitulo(t?.seo?.titulo, t?.seo?.descripcion);
  if (!t) return null;

  return (
    <section className="pagina">
      <h1>{t.solicitud.titulo}</h1>
      <p>{t.solicitud.texto}</p>
      <p>
        <Link to="/ingresar">{t.solicitud.enlaces.volver}</Link>
      </p>
    </section>
  );
}