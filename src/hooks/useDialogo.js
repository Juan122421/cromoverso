import { useEffect, useRef } from "react";

const ENFOCABLES =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

// raiz: ref del contenedor · inicial: ref del elemento que recibe el foco al abrir
// onCerrar: se llama con Escape · retorno: función que devuelve el elemento al que vuelve el foco
export function useDialogo({ raiz, inicial, onCerrar, retorno }) {
  const cerrar = useRef(onCerrar);
  const devolver = useRef(retorno);

  // Siempre se usan las versiones más recientes sin reiniciar el efecto principal
  useEffect(() => {
    cerrar.current = onCerrar;
    devolver.current = retorno;
  });

  useEffect(() => {
    const contenedor = raiz.current;
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // el fondo no se desplaza
    inicial.current?.focus();

    function alPulsar(evento) {
      if (evento.key === "Escape") {
        evento.preventDefault();
        cerrar.current();
        return;
      }
      if (evento.key !== "Tab") return;
      // Foco atrapado: Tab y Shift+Tab dan la vuelta dentro del diálogo
      const items = [...contenedor.querySelectorAll(ENFOCABLES)];
      if (items.length === 0) return;
      const primero = items[0];
      const ultimo = items[items.length - 1];
      const dentro = contenedor.contains(document.activeElement);
      if (evento.shiftKey && (!dentro || document.activeElement === primero)) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && (!dentro || document.activeElement === ultimo)) {
        evento.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", alPulsar);
    return () => {
      document.body.style.overflow = overflowPrevio;
      document.removeEventListener("keydown", alPulsar);
      devolver.current?.()?.focus(); // el foco vuelve al cromo que se abrió
    };
  }, [raiz, inicial]);
}