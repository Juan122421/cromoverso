import { API_URL } from "../config/api.js";
import { cabecerasDeSimulacion } from "./simulacion.js";

// Error de una petición a la API:
//  · estado       → código HTTP (404, 503…)
//  · codigo       → código de la API (credenciales_invalidas…): sirve para buscar textos.errores[codigo]
//  · campos       → mensajes por campo (errores 422)
//  · reintentarEn → segundos que pide esperar la API (errores 429)
//  · sinConexion  → no hubo respuesta (sin red)
export class ErrorDeApi extends Error {
  constructor(
    mensaje,
    { estado = null, codigo = null, campos = null, reintentarEn = null, sinConexion = false } = {},
  ) {
    super(mensaje);
    this.name = "ErrorDeApi";
    this.estado = estado;
    this.codigo = codigo;
    this.campos = campos;
    this.reintentarEn = reintentarEn;
    this.sinConexion = sinConexion;
  }
}

// Quien quiera enterarse de que la sesión venció se suscribe aquí (patrón de observador)
const oyentesNoAutenticado = new Set();
export function alNoAutenticado(oyente) {
  oyentesNoAutenticado.add(oyente);
  return () => oyentesNoAutenticado.delete(oyente); // devuelve la función para darse de baja
}

async function solicitar(ruta, { metodo = "GET", cuerpo, signal } = {}) {
  const cabeceras = { ...cabecerasDeSimulacion() };
  if (cuerpo !== undefined) cabeceras["Content-Type"] = "application/json";

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
      signal,
    });
  } catch (fallo) {
    if (fallo.name === "AbortError") throw fallo; // petición cancelada a propósito
    throw new ErrorDeApi(`Sin respuesta en ${ruta}`, { sinConexion: true });
  }

  if (respuesta.status === 204) return null; // sin contenido (por ejemplo, cerrar sesión)

  let datos = null;
  try {
    datos = await respuesta.json();
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    // Todos los errores de la API tienen la misma forma: { error: { codigo, mensaje, campos } }
    const codigo = datos?.error?.codigo ?? null;
    const espera = Number.parseInt(respuesta.headers.get("Retry-After"), 10);

    // 401 no_autenticado: no hay sesión o ya venció. Se avisa a quien la esté vigilando.
    if (respuesta.status === 401 && codigo === "no_autenticado") {
      oyentesNoAutenticado.forEach((oyente) => oyente({ ruta, metodo }));
    }

    throw new ErrorDeApi(`HTTP ${respuesta.status} en ${ruta}`, {
      estado: respuesta.status,
      codigo,
      campos: datos?.error?.campos ?? null,
      reintentarEn: Number.isFinite(espera) ? espera : null,
    });
  }
  if (datos === null) {
    throw new ErrorDeApi(`Respuesta inválida en ${ruta}`, {
      estado: respuesta.status,
      codigo: "respuesta_invalida",
    });
  }
  return datos;
}

export const pedir = (ruta, signal) => solicitar(ruta, { signal });
export const enviar = (ruta, cuerpo, { metodo = "POST", signal } = {}) =>
  solicitar(ruta, { metodo, cuerpo, signal });
export const eliminar = (ruta, signal) => solicitar(ruta, { metodo: "DELETE", signal });