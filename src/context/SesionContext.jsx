import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alNoAutenticado, eliminar, enviar, pedir } from "../services/api.js";

const SesionContext = createContext(null);
// Al volver a la pestaña se confirma que la sesión sigue viva, pero no más de una vez cada 15 s
const REVALIDAR_CADA = 15000;

// La sesión vive en la cookie httpOnly «sesion» que pone la API: JavaScript nunca ve el token.
// Aquí solo guardamos quién es la persona (el usuario que devuelve la API).
export function SesionProvider({ children }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [verificando, setVerificando] = useState(true);
  const usuarioRef = useRef(null); // copia síncrona: los oyentes necesitan el valor actual
  const ultimaComprobacion = useRef(0);

  const fijarUsuario = useCallback((siguiente) => {
    usuarioRef.current = siguiente;
    setUsuario(siguiente);
  }, []);

  // Al cargar la página se pregunta a la API si ya hay una sesión abierta (si no, responde 401)
  useEffect(() => {
    const controlador = new AbortController();
    pedir("/sesion", controlador.signal)
      .then((datos) => fijarUsuario(datos?.usuario ?? null))
      .catch((fallo) => {
        if (fallo.name !== "AbortError") fijarUsuario(null);
      })
      .finally(() => {
        if (!controlador.signal.aborted) {
          ultimaComprobacion.current = Date.now();
          setVerificando(false);
        }
      });
    return () => controlador.abort();
  }, [fijarUsuario]);

  // 401 no_autenticado con la sesión abierta = la sesión venció: se lleva a ingresar
  useEffect(
    () =>
      alNoAutenticado(() => {
        if (!usuarioRef.current) return; // un visitante no tiene sesión que vencer
        fijarUsuario(null);
        navigate("/ingresar", { replace: true, state: { sesionVencida: true } });
      }),
    [fijarUsuario, navigate],
  );

  // Al volver a la pestaña se confirma la sesión; si venció, el oyente de arriba redirige
  useEffect(() => {
    function comprobar() {
      if (document.visibilityState !== "visible" || !usuarioRef.current) return;
      if (Date.now() - ultimaComprobacion.current < REVALIDAR_CADA) return;
      ultimaComprobacion.current = Date.now();
      pedir("/sesion")
        .then((datos) => {
          if (datos?.usuario) fijarUsuario(datos.usuario);
        })
        .catch(() => {}); // sin red u otro error: no se toca la sesión
    }
    document.addEventListener("visibilitychange", comprobar);
    window.addEventListener("focus", comprobar);
    return () => {
      document.removeEventListener("visibilitychange", comprobar);
      window.removeEventListener("focus", comprobar);
    };
  }, [fijarUsuario]);

  const iniciarSesion = useCallback(
    async (correo, clave) => {
      const datos = await enviar("/sesion", { correo, clave }); // 201 { usuario, token }
      ultimaComprobacion.current = Date.now();
      fijarUsuario(datos.usuario);
      return datos.usuario;
    },
    [fijarUsuario],
  );

  const cerrarSesion = useCallback(async () => {
    await eliminar("/sesion"); // 204: la API borra la cookie
    fijarUsuario(null);
  }, [fijarUsuario]);

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