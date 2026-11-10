import { useParams } from "react-router-dom";
import { usePreferencias } from "../context/PreferenciasContext.jsx";

// Provisional: la vista real llega con la HU-04
export default function CatalogoMundo() {
  const { id } = useParams(); // lee el :id de la URL
  const { textos } = usePreferencias();
  return (
    <section className="pagina">
      <h1>{textos?.navbar?.enlaces?.mundos}</h1>
      <p>{id}</p>
    </section>
  );
}