import { useEffect, useState } from "react";

// Pide datos a la API y entrega { datos, cargando, error, codigo, reintentar }.
// "cargar" recibe la señal de cancelación y devuelve una promesa.
export function useDatos(cargar, dependencias = []) {
  const [estado, setEstado] = useState({
    datos: null,
    cargando: true,
    error: false,
    codigo: null,
  });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    let vigente = true;
    // Se conservan los datos anteriores mientras llegan los nuevos
    setEstado((previo) => ({ ...previo, cargando: true, error: false, codigo: null }));

    cargar(controlador.signal)
      .then((datos) => {
        if (vigente) setEstado({ datos, cargando: false, error: false, codigo: null });
      })
      .catch((fallo) => {
        if (!vigente || fallo.name === "AbortError") return;
        console.error("Error al cargar los datos:", fallo);
        setEstado({ datos: null, cargando: false, error: true, codigo: fallo.estado ?? null });
      });

    return () => {
      vigente = false;
      controlador.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, intento]);

  return { ...estado, reintentar: () => setIntento((valor) => valor + 1) };
}