import { createContext, useContext, useEffect, useState } from "react";
import { useTextos } from "../hooks/useTextos.js";
import { borrarCookie,guardarCookie, leerCookie } from "../utils/cookies.js";

const COOKIE_CONSENTIMIENTO = "consentimiento";
const COOKIE_IDIOMA = "idioma";
const IDIOMAS = ["es", "en"];
const IDIOMA_POR_DEFECTO = "es";
const CLAVE_ACCESIBILIDAD = "accesibilidad";
const TAMANOS_TEXTO = ["normal", "grande", "muyGrande"];

const ACCESIBILIDAD_INICIAL = {
  tamanoTexto: "normal",
  altoContraste: false,
  reducirMovimiento: false,
  subrayarEnlaces: false,
  fuenteLecturaFacil: false,
};

const PreferenciasContext = createContext(null);

function leerConsentimiento(){
  const valor = leerCookie(COOKIE_CONSENTIMIENTO);
  return valor === "aceptado"|| valor ==="rechazado" ? valor:null;
}

// El idioma guardado solo se usa si la persona aceptó las cookies
function leerIdiomaGuardado() {
  if (leerConsentimiento() !== "aceptado") return IDIOMA_POR_DEFECTO;
  const guardado = leerCookie(COOKIE_IDIOMA);
  return IDIOMAS.includes(guardado) ? guardado : IDIOMA_POR_DEFECTO;
}

function leerAccesibilidad() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_ACCESIBILIDAD));
    if (!guardado || typeof guardado !== "object") return ACCESIBILIDAD_INICIAL;
    return {
      ...ACCESIBILIDAD_INICIAL,
      ...guardado,
      tamanoTexto: TAMANOS_TEXTO.includes(guardado.tamanoTexto)
        ? guardado.tamanoTexto
        : "normal",
      altoContraste: Boolean(guardado.altoContraste),
      reducirMovimiento: Boolean(guardado.reducirMovimiento),
      subrayarEnlaces: Boolean(guardado.subrayarEnlaces),
      fuenteLecturaFacil: Boolean(guardado.fuenteLecturaFacil),
    };
  } catch {
    return ACCESIBILIDAD_INICIAL;
  }
}

function aplicarAccesibilidad(prefs) {
  const raiz = document.documentElement;
  raiz.dataset.tamanoTexto = prefs.tamanoTexto;
  raiz.dataset.altoContraste = String(prefs.altoContraste);
  raiz.dataset.reducirMovimiento = String(prefs.reducirMovimiento);
  raiz.dataset.subrayarEnlaces = String(prefs.subrayarEnlaces);
  raiz.dataset.fuenteLecturaFacil = String(prefs.fuenteLecturaFacil);
}

export function PreferenciasProvider({ children }) {
  const [idioma, setIdioma] = useState(leerIdiomaGuardado);
  const [consentimiento,setConsentimiento] = useState(leerConsentimiento)
  const [errorCookies,setErrorCookies] = useState(false)
  const [accesibilidad, setAccesibilidad] = useState(leerAccesibilidad);
  const [panelAccesibilidad, setPanelAccesibilidad] = useState(false);
  const { textos, cargando, error, recargar } = useTextos(idioma);

  useEffect(() => {
    document.documentElement.lang = idioma === "es" ? "es-CO" : "en";
  }, [idioma]);

  useEffect(() => {
    aplicarAccesibilidad(accesibilidad);
    try {
      localStorage.setItem(CLAVE_ACCESIBILIDAD, JSON.stringify(accesibilidad));
    } catch {
      // Si el navegador bloquea localStorage, las opciones siguen valiendo en esta visita
    }
  }, [accesibilidad]);

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

  function cambiarAccesibilidad(cambios) {
    setAccesibilidad((actual) => ({ ...actual, ...cambios }));
  }

  function restablecerAccesibilidad() {
    setAccesibilidad(ACCESIBILIDAD_INICIAL);
  }

  const valor = {
    idioma,
    cambiarIdioma,
    accesibilidad,
    cambiarAccesibilidad,
    restablecerAccesibilidad,
    panelAccesibilidad,
    abrirPanelAccesibilidad: () => setPanelAccesibilidad(true),
    cerrarPanelAccesibilidad: () => setPanelAccesibilidad(false),
    alternarPanelAccesibilidad: () => setPanelAccesibilidad((abierto) => !abierto),
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
