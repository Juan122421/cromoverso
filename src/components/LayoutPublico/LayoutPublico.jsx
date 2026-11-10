import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import GestorCookies from "../GestorCookies/GestorCookies.jsx";
import SaltarContenido from "../SaltarContenido/SaltarContenido.jsx";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import "./LayoutPublico.css";

export default function LayoutPublico() {
  const { textos } = usePreferencias();
  const { pathname } = useLocation();
  const textoSaltar = textos?.general?.aria?.saltarAlContenido;
  // El inicio tiene portada oscura: en móvil su encabezado es oscuro
  const tono = pathname === "/" ? "oscuro" : "claro";

  // Al cambiar de vista se vuelve al inicio de la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="landing">
      {textoSaltar && <SaltarContenido texto={textoSaltar} />}
      {/* El aviso va antes del navbar para que el teclado llegue a él primero */}
      <GestorCookies />
      <Navbar tono={tono} />
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}