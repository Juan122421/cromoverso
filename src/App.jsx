import { PreferenciasProvider } from "./context/PreferenciasContext.jsx";
import LayoutPublico from "./components/LayoutPublico/LayoutPublico.jsx";
import Boton from "./components/Boton/Boton.jsx";

function App() {
  return (
    <PreferenciasProvider>
      <LayoutPublico>
        {/* Prueba temporal: borrar cuando haya vistas. El layout ya trae <main>, por eso aquí va <section> */}
        <section
          className="contenedor"
          style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "1rem", padding: "2rem 0" }}
        >
          <Boton tamano="g" icono="destellos">Abrir sobre</Boton>
          <Boton variante="acento" icono="destellos">Abrir sobre</Boton>
          <Boton variante="secundario" tamano="p">Abrir sobre</Boton>
        </section>
      </LayoutPublico>
    </PreferenciasProvider>
  );
}

export default App;