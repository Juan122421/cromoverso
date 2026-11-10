import { Routes, Route } from "react-router-dom";
import { PreferenciasProvider } from "./context/PreferenciasContext.jsx";
import LayoutPublico from "./components/LayoutPublico/LayoutPublico.jsx";
import Inicio from "./pages/Inicio.jsx";
import CatalogoMundo from "./pages/CatalogoMundo.jsx";
import Provisional from "./pages/Provisional.jsx";
import NoEncontrado from "./pages/NoEncontrado.jsx";

function App() {
  return (
    <PreferenciasProvider>
      <Routes>
        {/* El layout se dibuja siempre; cada ruta se pinta dentro de su <Outlet /> */}
        <Route element={<LayoutPublico />}>
          <Route index element={<Inicio />} />
          <Route path="mundos" element={<Provisional clave="mundos" />} />
          <Route path="mundos/:id" element={<CatalogoMundo />} />
          <Route path="ingresar" element={<Provisional grupo="botones" clave="ingresar" />} />
          <Route path="registro" element={<Provisional grupo="botones" clave="crearCuenta" />} />
          <Route path="*" element={<NoEncontrado />} />
        </Route>
      </Routes>
    </PreferenciasProvider>
  );
}

export default App;