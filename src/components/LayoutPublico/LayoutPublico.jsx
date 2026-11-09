import Navbar from "../Navbar/Navbar.jsx";
import "./LayoutPublico.css";
import GestorCookies from "../GestorCookies/GestorCookies.jsx";

export default function LayoutPublico({ children }) {
  return (
    <div className="landing">
      <GestorCookies />
      <Navbar />
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}