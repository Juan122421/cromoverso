import { createContext, useContext, useEffect, useState } from "react";
import { useTextos } from "../hooks/useTextos.js";
import { borrarCookie,guardarCookie, leerCookie } from "../utils/cookies.js";

const COOKIE_CONSENTIMIENTO = "consentimiento";
const COOKIE_IDIOMA = "idioma";
const IDIOMAS = ["es", "en"];
const IDIOMA_POR_DEFECTO = "es";

const PreferenciasContext = createContext(null);

function leerConsentimiento(){
  const valor = leerCookie(COOKIE_CONSENTIMIENTO);
  return valor = valor === "aceptado"|| valor ==="rechazado" ? valor:null;
}

// El idioma guardado solo se usa si la persona aceptó las cookies
function leerIdiomaGuardado() {
  if (leerConsentimiento() !== "aceptado") return IDIOMA_POR_DEFECTO;
  const guardado = leerCookie(COOKIE_IDIOMA);
  return IDIOMAS.includes(guardado) ? guardado : IDIOMA_POR_DEFECTO;
}

export function PreferenciasProvider({ children }) {
  const [idioma, setIdioma] = useState(leerIdiomaGuardado);
  const [consentimiento,setConsentimiento] = useState(leerConsentimiento)
  const [erroCookies,setErrorCookies] = useState(false)
  const [textoGrande, setTextoGrande] = useState(false);
  const { textos, cargando, error, recargar } = useTextos(idioma);

  useEffect(() => {
    document.documentElement.lang = idioma === "es" ? "es-CO" : "en";
  }, [idioma]);

  useEffect(() => {
    document.documentElement.style.fontSize = textoGrande ? "112%" : "";
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [textoGrande]);

  function cambiarIdioma(nuevo) {
    setIdioma(nuevo);
    if (leerConsentimiento() ==="aceptado") guardarCookie(COOKIE_IDIOMA, nuevo);
  }
  function guardarConsentimiento(permitir){
    const valor = permitir ? "aceptado" : "rechazado";
    guardarCookie(COOKIE_CONSENTIMIENTO, valor);
    if (leerCookie(COOKIE_CONSENTIMIENTO) !== valor) {
      setErrorCookies(true); // el navegador bloqueó la cookie
      return false;
  }
  
  if (permitir) guardarCookie(COOKIE_IDIOMA, idioma);
    else borrarCookie(COOKIE_IDIOMA);
    setConsentimiento(valor);
    setErrorCookies(false);
    return true;
  }
  const valor = {
    idioma,
    cambiarIdioma,
    textoGrande,
    alternarTexto: () => setTextoGrande((actual) => !actual),
    consentimiento,
    guardarConsentimiento,
    errorCookies,
    textos,
    cargando,
    error,
    recargar,
  };

  return (
    <PreferenciasContext.Provider value={valor}>
      {children}
    </PreferenciasContext.Provider>
  );
}

export function usePreferencias() {
  const contexto = useContext(PreferenciasContext);
  if (!contexto) {
    throw new Error("usePreferencias debe usarse dentro de <PreferenciasProvider>");
  }
  return contexto;
}