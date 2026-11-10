import { useEffect, useState } from "react";
import { API_URL } from "../config/api.js";

const API = `${API_URL}/textos`;
// Solo pedimos lo que la interfaz usa (el contrato permite ?seccion=)
const SECCIONES = "navbar,menuMovil,idioma,cookies,estados,errores,general";

// Un texto es válido solo si es string y no está vacío
const esTexto = (valor) => typeof valor === "string" && valor.trim() !== "";
const hayTextos = (objeto) => {
  const valores = Object.values(objeto ?? {});
  return valores.length > 0 && valores.every(esTexto);
};

function validarTextos(datos) {
  const t = datos?.textos;
  const requeridas = {
    "navbar.logo.texto": t?.navbar?.logo?.texto,
    "navbar.logo.aria": t?.navbar?.logo?.aria,
    "navbar.buscador.placeholder": t?.navbar?.buscador?.placeholder,
    "navbar.buscador.aria": t?.navbar?.buscador?.aria,
    "navbar.botones.ingresar": t?.navbar?.botones?.ingresar,
    "navbar.botones.crearCuenta": t?.navbar?.botones?.crearCuenta,
    "navbar.aria.accesibilidad": t?.navbar?.aria?.accesibilidad,
    "menuMovil.abrir": t?.menuMovil?.abrir,
    "menuMovil.cerrar": t?.menuMovil?.cerrar,
    "idioma.etiqueta": t?.idioma?.etiqueta,
    "cookies.banner.titulo": t?.cookies?.banner?.titulo,
    "cookies.banner.texto": t?.cookies?.banner?.texto,
    "cookies.banner.botones.aceptar": t?.cookies?.banner?.botones?.aceptar,
    "cookies.banner.botones.rechazar": t?.cookies?.banner?.botones?.rechazar,
    "estados.mensajes.guardado": t?.estados?.mensajes?.guardado,
    "errores.generico": t?.errores?.generico,
    "general.aria.saltarAlContenido": t?.general?.aria?.saltarAlContenido,
  };

  const faltantes = Object.entries(requeridas)
    .filter(([, valor]) => !esTexto(valor))
    .map(([clave]) => clave);

  // Los enlaces cambian de un sprint a otro: basta con que haya al menos uno
  if (!hayTextos(t?.navbar?.enlaces)) faltantes.push("navbar.enlaces");
  // Los idiomas del selector salen de la API
  if (!hayTextos(t?.idioma?.codigos)) faltantes.push("idioma.codigos");
  if (!hayTextos(t?.idioma?.opciones)) faltantes.push("idioma.opciones");

  if (faltantes.length) {
    throw new Error(`Faltan textos en la respuesta: ${faltantes.join(", ")}`);
  }
  return t;
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

    async function cargarTextos() {
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

    cargarTextos();
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