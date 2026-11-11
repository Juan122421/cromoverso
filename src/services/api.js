import { API_URL } from "../config/api.js";

// Pide una ruta de la API y devuelve el JSON. Falla si la respuesta no es 2xx.
export async function pedir(ruta, signal) {
  const respuesta = await fetch(`${API_URL}${ruta}`, { signal });
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status} en ${ruta}`);
  return respuesta.json();
}
