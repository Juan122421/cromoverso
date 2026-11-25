import { Routes, Route } from "react-router-dom";
import { PreferenciasProvider } from "./context/PreferenciasContext.jsx";
import { SesionProvider } from "./context/SesionContext.jsx";
import LayoutPublico from "./components/LayoutPublico/LayoutPublico.jsx";
import LayoutAutenticacion from "./components/LayoutAutenticacion/LayoutAutenticacion.jsx";
import Inicio from "./pages/Inicio.jsx";
import CatalogoMundo from "./pages/CatalogoMundo.jsx";
import IrAlPrimerMundo from "./pages/IrAlPrimerMundo.jsx";
import Ingresar from "./pages/Ingresar.jsx";
import RecuperarClaveProvisional from "./pages/RecuperarClaveProvisional.jsx";
import Provisional from "./pages/Provisional.jsx";
import NoEncontrado from "./pages/NoEncontrado.jsx";

function App() {
  return (
    <PreferenciasProvider>
      <SesionProvider>
        <Routes>
          {/* Pantalla dividida del diseño: sin navbar ni pie */}
          <Route element={<LayoutAutenticacion />}>
            <Route path="ingresar" element={<Ingresar />} />
          </Route>

          <Route element={<LayoutPublico />}>
            <Route index element={<Inicio />} />
            <Route path="mundos" element={<IrAlPrimerMundo />} />
            <Route path="mundos/:id" element={<CatalogoMundo />} />
            <Route path="cromos/:cromoId" element={<CatalogoMundo />} />
            <Route path="registro" element={<Provisional grupo="botones" clave="crearCuenta" />} />
            <Route path="recuperar-clave" element={<RecuperarClaveProvisional />} />
            <Route path="*" element={<NoEncontrado />} />
          </Route>
        </Routes>
      </SesionProvider>
    </PreferenciasProvider>
  );
}

export default App;