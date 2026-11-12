import { Navigate, Routes, Route } from "react-router-dom";
import { PreferenciasProvider } from "./context/PreferenciasContext.jsx";
import { MUNDO_INICIAL } from "./config/destinos.js";
import LayoutPublico from "./components/LayoutPublico/LayoutPublico.jsx";
import Inicio from "./pages/Inicio.jsx";
import CatalogoMundo from "./pages/CatalogoMundo.jsx";
import Provisional from "./pages/Provisional.jsx";
import NoEncontrado from "./pages/NoEncontrado.jsx";
import DetalleProvisional from "./pages/DetalleProvisional.jsx";

function App() {
  return (
    <PreferenciasProvider>
      <Routes>
        {/* El layout se dibuja siempre; cada ruta se pinta dentro de su <Outlet /> */}
        <Route element={<LayoutPublico />}>
          <Route index element={<Inicio />} />
          <Route
            path="mundos"
            element={<Navigate to={`/mundos/${MUNDO_INICIAL}`} replace />}
          />
          <Route path="mundos/:id" element={<CatalogoMundo />} />
          <Route path="cromos/:id" element={<DetalleProvisional />} />
          <Route path="ingresar" element={<Provisional grupo="botones" clave="ingresar" />} />
          <Route path="registro" element={<Provisional grupo="botones" clave="crearCuenta" />} />
          <Route path="*" element={<NoEncontrado />} />
        </Route>
      </Routes>
    </PreferenciasProvider>
  );
}

export default App;