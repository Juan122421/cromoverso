import { useEffect, useState } from "react";

const API = "https://yanethm-cromoverso-api.fly.dev/api/v1/textos";
const SECCIONES = "navbar,menuMovil,accesibilidad";
const CLAVES_MENU = ["album", "sobres", "intercambios", "mundos", "ranking"];

function validarTextos(datos) {
  const textos = datos?.textos;
  const nav = textos?.navbar;
  const requeridas = {
    "navbar.logo.texto": nav?.logo?.texto,
    "navbar.logo.aria": nav?.logo?.aria,
    ...Object.fromEntries(
      CLAVES_MENU.map((c) => [`navbar.enlaces.${c}`, nav?.enlaces?.[c]])
    ),
    "navbar.buscador.placeholder": nav?.buscador?.placeholder,
    "navbar.botones.ingresar": nav?.botones?.ingresar,
    "navbar.botones.crearCuenta": nav?.botones?.crearCuenta,
    "menuMovil.abrir": textos?.menuMovil?.abrir,
    "menuMovil.cerrar": textos?.menuMovil?.cerrar,
  };

  const faltantes = Object.entries(requeridas)
    .filter(([, valor]) => !(typeof valor === "string" && valor.trim()))
    .map(([clave]) => clave);

  if (faltantes.length) {
    throw new Error(`Faltan textos en la respuesta: ${faltantes.join(", ")}`);
  }
  return textos;
}

export function useTextos(idioma) {
  const [textos, setTextos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), 12000);
    let vigente = true;
    setCargando(true);
    setError(false);

    async function cargarTextosNavbar() {
      try {
        const respuesta = await fetch(
          `${API}?idioma=${idioma}&seccion=${SECCIONES}`,
          { signal: controlador.signal }
        );
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const datos = await respuesta.json();
        const nuevosTextos = validarTextos(datos);
        if (vigente) setTextos(nuevosTextos);
      } catch (fallo) {
        if (vigente) {
          console.error("Error al cargar los textos:", fallo);
          setError(true);
        }
      } finally {
        clearTimeout(limite);
        if (vigente) setCargando(false);
      }
    }

    cargarTextosNavbar();
    return () => {
      vigente = false;
      clearTimeout(limite);
      controlador.abort();
    };
  }, [idioma, intento]);

  return {
    textos,
    cargando,
    error,
    recargar: () => setIntento((valor) => valor + 1),
  };
}