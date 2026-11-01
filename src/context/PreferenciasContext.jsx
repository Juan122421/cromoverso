import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useTextos } from "../hooks/useTextos.js";

const PreferenciasContext = createContext(null);

export function PreferenciasProvider({ children }) {
  const [idioma, setIdioma] = useState("es"); // español por defecto
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

  const valor = useMemo(
    () => ({
      idioma,
      cambiarIdioma: setIdioma,
      textoGrande,
      alternarTexto: () => setTextoGrande((actual) => !actual),
      textos,
      cargando,
      error,
      recargar,
    }),
    [idioma, textoGrande, textos, cargando, error, recargar]
  );

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