import { useEffect, useState } from "react";

// Devuelve true mientras la pantalla cumple la consulta, por ejemplo "(min-width: 56.25rem)"
export function useMediaQuery(consulta) {
  const [coincide, setCoincide] = useState(() => window.matchMedia(consulta).matches);

  useEffect(() => {
    const media = window.matchMedia(consulta);
    const alCambiar = (evento) => setCoincide(evento.matches);
    setCoincide(media.matches);
    media.addEventListener("change", alCambiar);
    return () => media.removeEventListener("change", alCambiar);
  }, [consulta]);

  return coincide;
}