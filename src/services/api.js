import { API_URL } from "../config/api.js";
import { cabecerasDeSimulacion } from "./simulacion.js";

// Error de una petición a la API:
//  · estado      → código HTTP (404, 503…)
//  · codigo      → código de la API (falla_simulada…): sirve para buscar textos.errores[codigo]
//  · campos      → mensajes por campo (errores 422)
//  · sinConexion → no hubo respuesta (sin red)
export class ErrorDeApi extends Error {
  constructor(mensaje, { estado = null, codigo = null, campos = null, sinConexion = false } = {}) {
    super(mensaje);
    this.name = "ErrorDeApi";
    this.estado = estado;
    this.codigo = codigo;
    this.campos = campos;
    this.sinConexion = sinConexion;
  }
}

// Pide una ruta de la API y devuelve el JSON. Falla si la respuesta no es 2xx.
export async function pedir(ruta, signal) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, { signal, headers: cabecerasDeSimulacion() });
  } catch (fallo) {
    if (fallo.name === "AbortError") throw fallo; // petición cancelada a propósito
    throw new ErrorDeApi(`Sin respuesta en ${ruta}`, { sinConexion: true });
  }

  if (!respuesta.ok) {
    // Todos los errores de la API tienen la misma forma: { error: { codigo, mensaje, campos } }
    const cuerpo = await respuesta.json().catch(() => null);
    throw new ErrorDeApi(`HTTP ${respuesta.status} en ${ruta}`, {
      estado: respuesta.status,
      codigo: cuerpo?.error?.codigo ?? null,
      campos: cuerpo?.error?.campos ?? null,
    });
  }
  return respuesta.json();
}