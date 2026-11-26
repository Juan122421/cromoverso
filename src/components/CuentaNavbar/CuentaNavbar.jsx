import "./CuentaNavbar.css";
import Boton from "../Boton/Boton.jsx";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import { useSesion } from "../../context/SesionContext.jsx";

// Provisional: avatar, nombre y botón para salir. El menú de cuenta completo llega con su historia.
export default function CuentaNavbar() {
  const { textos } = usePreferencias();
  const { usuario, cerrarSesion } = useSesion();
  const t = textos?.navbar?.usuario;
  if (!usuario || !t) return null;

  const nombre = usuario.nombre?.trim() || usuario.alias;
  const inicial = nombre.charAt(0).toUpperCase();

  async function salir() {
    try {
      await cerrarSesion();
    } catch (fallo) {
      console.error("No se pudo cerrar la sesión:", fallo);
    }
  }

  return (
    <div className="cuenta-navbar" role="group" aria-label={t.menu}>
      <span className="cuenta-navbar__avatar" aria-hidden="true">
        {inicial}
      </span>
      {/* En móvil solo lo oyen los lectores de pantalla; en escritorio también se ve */}
      <span className="cuenta-navbar__nombre">{nombre.split(" ")[0]}</span>
      <Boton variante="secundario" tamano="p" className="solo-escritorio" onClick={salir}>
        {t.cerrarSesion}
      </Boton>
    </div>
  );
}