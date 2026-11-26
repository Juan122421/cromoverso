import { Navigate } from "react-router-dom";
import EstadoError from "../components/EstadoError/EstadoError.jsx";
import { usePreferencias } from "../context/PreferenciasContext.jsx";
import { useDatos } from "../hooks/useDatos.js";
import { pedir } from "../services/api.js";
import NoEncontrado from "./NoEncontrado.jsx";

// «Mundos» del navbar abre el catálogo del primer mundo que devuelve la API
export default function IrAlPrimerMundo() {
  const { textos } = usePreferencias();
  const { datos, fallo, reintentar } = useDatos((signal) => pedir("/mundos", signal), []);

  const id = datos?.datos?.[0]?.id;
  if (id) return <Navigate to={`/mundos/${id}`} replace />;
  if (datos) return <NoEncontrado />; // la API respondió, pero sin mundos

  return (
    <section className="pagina">
      {fallo ? (
        <EstadoError fallo={fallo} conInicio onReintentar={reintentar} />
      ) : (
        <p role="status">{textos?.estados?.cargando}</p>
      )}
    </section>
  );
}