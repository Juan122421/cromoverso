import { createContext, useContext, useEffect, useState } from "react";
import { useTextos } from "../hooks/useTextos.js";
import { guardarCookie, leerCookie } from "../utils/cookies.js";

const COOKIE_CONSENTIMIENTO = "consentimiento";
const COOKIE_IDIOMA = "idioma";
const IDIOMAS = ["es", "en"];
const IDIOMA_POR_DEFECTO = "es";

const PreferenciasContext = createContext(null);

const consentimientoAceptado = () =>
  leerCookie(COOKIE_CONSENTIMIENTO) === "aceptado";

// El idioma guardado solo se usa si la persona aceptó las cookies
function leerIdiomaGuardado() {
  if (!consentimientoAceptado()) return IDIOMA_POR_DEFECTO;
  const guardado = leerCookie(COOKIE_IDIOMA);
  return IDIOMAS.includes(guardado) ? guardado : IDIOMA_POR_DEFECTO;
}

export function PreferenciasProvider({ children }) {
  const [idioma, setIdioma] = useState(leerIdiomaGuardado);
  const [textoGrande, setTextoGrande] = useState(false);
  const { textos, cargando, error, recargar } = useTextos(idioma);

  // <html lang> cambia con el idioma
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
    // Se lee la cookie en el momento: la decisión pudo cambiar desde la última visita
    if (consentimientoAceptado()) guardarCookie(COOKIE_IDIOMA, nuevo);
  }

  const valor = {
    idioma,
    cambiarIdioma,
    textoGrande,
    alternarTexto: () => setTextoGrande((actual) => !actual),
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