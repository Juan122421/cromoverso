import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { eliminar, enviar, pedir } from "../services/api.js";

const SesionContext = createContext(null);

// La sesión vive en la cookie httpOnly «sesion» que pone la API: JavaScript nunca ve el token.
// Aquí solo guardamos quién es la persona (el usuario que devuelve la API).
export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [verificando, setVerificando] = useState(true);

  // Al cargar la página se pregunta a la API si ya hay una sesión abierta (si no, responde 401)
  useEffect(() => {
    const controlador = new AbortController();
    pedir("/sesion", controlador.signal)
      .then((datos) => setUsuario(datos?.usuario ?? null))
      .catch((fallo) => {
        if (fallo.name !== "AbortError") setUsuario(null);
      })
      .finally(() => {
        if (!controlador.signal.aborted) setVerificando(false);
      });
    return () => controlador.abort();
  }, []);

  const iniciarSesion = useCallback(async (correo, clave) => {
    const datos = await enviar("/sesion", { correo, clave }); // 201 { usuario, token }
    setUsuario(datos.usuario);
    return datos.usuario;
  }, []);

  const cerrarSesion = useCallback(async () => {
    await eliminar("/sesion"); // 204
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, verificando, iniciarSesion, cerrarSesion }),
    [usuario, verificando, iniciarSesion, cerrarSesion],
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  const contexto = useContext(SesionContext);
  if (!contexto) throw new Error("useSesion debe usarse dentro de <SesionProvider>");
  return contexto;
}