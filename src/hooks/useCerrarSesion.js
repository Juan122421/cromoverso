import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSesion } from "../context/SesionContext.jsx";

// Cierra la sesión (DELETE /sesion) y vuelve al inicio como visitante.
// Devuelve { cerrar, enviando, error }; cerrar() responde true si se cerró.
export function useCerrarSesion() {
  const { cerrarSesion } = useSesion();
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const enCurso = useRef(false); // evita enviar dos veces aunque React aún no haya repintado

  const cerrar = useCallback(async () => {
    if (enCurso.current) return false;
    enCurso.current = true;
    setEnviando(true);
    setError(null);
    try {
      await cerrarSesion();
      navigate("/", { replace: true });
      // El botón que tenía el foco desaparece con la sesión: el foco pasa al contenido
      window.requestAnimationFrame(() => document.getElementById("contenido")?.focus());
      return true;
    } catch (fallo) {
      setError(fallo); // la sesión sigue abierta: se muestra el error y se puede reintentar
      return false;
    } finally {
      enCurso.current = false;
      setEnviando(false);
    }
  }, [cerrarSesion, navigate]);

  return { cerrar, enviando, error };
}