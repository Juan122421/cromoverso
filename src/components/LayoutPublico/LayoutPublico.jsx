import Navbar from "../Navbar/Navbar.jsx";
import "./LayoutPublico.css";

export default function LayoutPublico({ children }) {
  return (
    <div className="landing">
      {/* <SaltarContenido /> se conecta cuando sepamos la clave del texto (ver abajo) */}
      <Navbar />
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      {/* <Footer /> y <GestorCookies /> llegan con el siguiente grupo de archivos */}
    </div>
  );
}