import { useEffect } from "react";

// Título de la pestaña y descripción de la página (vienen de la API: paginas.xxx.seo)
export function useTitulo(titulo, descripcion) {
  useEffect(() => {
    if (titulo) document.title = titulo;
  }, [titulo]);

  useEffect(() => {
    if (!descripcion) return undefined;
    let meta = document.querySelector('meta[name="description"]');
    const creada = !meta;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    const previa = meta.getAttribute("content");
    meta.setAttribute("content", descripcion);
    return () => {
      if (creada) meta.remove();
      else if (previa !== null) meta.setAttribute("content", previa);
    };
  }, [descripcion]);
}