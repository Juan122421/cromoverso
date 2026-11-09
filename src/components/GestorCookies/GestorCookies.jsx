import { useState } from "react";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import BannerCookies from "../BannerCookies/BannerCookies.jsx";
import "./GestorCookies.css";

export default function GestorCookies() {
  const { textos, consentimiento, guardarConsentimiento, errorCookies } =
    usePreferencias();
  const [guardado, setGuardado] = useState(false);
  const banner = textos?.cookies?.banner;

  function decidir(permitir) {
    if (guardarConsentimiento(permitir)) {
      setGuardado(true);
      // El botón pulsado desaparece: llevamos el foco al contenido para no perderlo
      document.getElementById("contenido")?.focus();
    }
  }

  return (
    <>
      {!consentimiento && banner && (
        <BannerCookies
          textos={banner}
          onAceptar={() => decidir(true)}
          onRechazar={() => decidir(false)}
        />
      )}
      {errorCookies && textos?.errores?.generico && (
        <p className="error-cookies" role="alert">
          {textos.errores.generico}
        </p>
      )}
      {/* Anuncia la decisión a los lectores de pantalla */}
      <span className="solo-lectores" role="status">
        {guardado ? textos?.estados?.mensajes?.guardado : ""}
      </span>
    </>
  );
}