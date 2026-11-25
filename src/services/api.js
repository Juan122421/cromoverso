import { API_URL } from "../config/api.js";
import { cabecerasDeSimulacion } from "./simulacion.js";

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
    const espera = Number.parseInt(respuesta.headers.get("Retry-After"), 10);
    throw new ErrorDeApi(`HTTP ${respuesta.status} en ${ruta}`, {
      estado: respuesta.status,
      codigo: datos?.error?.codigo ?? null,
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