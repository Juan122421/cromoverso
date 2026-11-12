import { useParams } from "react-router-dom";

// Provisional: el detalle de un cromo se construye en el sprint 2
export default function DetalleProvisional() {
  const { id } = useParams();
  return (
    <section className="pagina">
      <h1>{id}</h1>
    </section>
  );
}