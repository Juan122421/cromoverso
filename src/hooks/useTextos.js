import { useEffect, useState } from "react";

const API = "https://yanethm-cromoverso-api.fly.dev/api/v1/textos";
// Solo pedimos lo que el navbar necesita (el contrato permite ?seccion=)
const SECCIONES = "navbar,menuMovil";

function validarTextos(datos) {
  const textos = datos?.textos;
  const nav = textos?.navbar;
  const requeridas = {
    "navbar.logo.texto": nav?.logo?.texto,
    "navbar.logo.aria": nav?.logo?.aria,
    "navbar.buscador.placeholder": nav?.buscador?.placeholder,
    "navbar.buscador.aria": nav?.buscador?.aria,
    "navbar.botones.ingresar": nav?.botones?.ingresar,
    "navbar.botones.crearCuenta": nav?.botones?.crearCuenta,
    "navbar.aria.idioma": nav?.aria?.idioma,
    "navbar.aria.accesibilidad": nav?.aria?.accesibilidad,
    "menuMovil.abrir": textos?.menuMovil?.abrir,
    "menuMovil.cerrar": textos?.menuMovil?.cerrar,
  };

  // Un texto es válido solo si es string y no está vacío
  const faltantes = Object.entries(requeridas)
    .filter(([, valor]) => !(typeof valor === "string" && valor.trim()))
    .map(([clave]) => clave);

  // Los enlaces del menú cambian de un sprint a otro: basta con que haya al menos uno
  const enlaces = Object.values(nav?.enlaces ?? {});
  const enlacesValidos =
    enlaces.length > 0 &&
    enlaces.every((valor) => typeof valor === "string" && valor.trim());
  if (!enlacesValidos) faltantes.push("navbar.enlaces");

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
    // La API se apaga si no se usa: la primera petición puede tardar
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