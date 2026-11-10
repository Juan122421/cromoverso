import { usePreferencias } from "../context/PreferenciasContext.jsx";

// Provisional: la vista real llega con la HU-03
export default function Inicio() {
  const { textos } = usePreferencias();
  return (
    <section className="pagina">
      <h1>{textos?.navbar?.enlaces?.inicio}</h1>
    </section>
  );
}