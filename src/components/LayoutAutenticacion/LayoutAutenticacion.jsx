import { Outlet } from "react-router-dom";
import GestorCookies from "../GestorCookies/GestorCookies.jsx";
import SaltarContenido from "../SaltarContenido/SaltarContenido.jsx";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";

// Layout de las pantallas de ingreso y registro: pantalla dividida, sin navbar ni pie (Figma)
export default function LayoutAutenticacion() {
  const { textos } = usePreferencias();
  const textoSaltar = textos?.general?.aria?.saltarAlContenido;

  return (
    <>
      {textoSaltar && <SaltarContenido texto={textoSaltar} />}
      <GestorCookies />
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
    </>
  );
}