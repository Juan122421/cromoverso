import { API_URL } from "../config/api.js";

// Pide una ruta de la API y devuelve el JSON. Falla si la respuesta no es 2xx
// y guarda el código HTTP en error.estado (por ejemplo 404).
export async function pedir(ruta, signal) {
  const respuesta = await fetch(`${API_URL}${ruta}`, { signal });
  if (!respuesta.ok) {
    const error = new Error(`HTTP ${respuesta.status} en ${ruta}`);
    error.estado = respuesta.status;
    throw error;
  }
  return respuesta.json();
}