import Boton from "../components/Boton/Boton.jsx";
import { usePreferencias } from "../context/PreferenciasContext.jsx";

export default function NoEncontrado() {
  const { textos } = usePreferencias();
  const t = textos?.estados?.noEncontrado;
  if (!t) return null;

  return (
    <section className="pagina">
      <h1>{t.titulo}</h1>
      <p>{t.texto}</p>
      <Boton to="/">{t.botones.irAlInicio}</Boton>
    </section>
  );
}