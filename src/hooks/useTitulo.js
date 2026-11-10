import { useEffect } from "react";

// Cambia el título de la pestaña (viene de la API: paginas.xxx.seo.titulo)
export function useTitulo(titulo) {
  useEffect(() => {
    if (titulo) document.title = titulo;
  }, [titulo]);
}