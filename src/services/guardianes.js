import { pedir } from "./api.js";

// Primer cromo (el guardián) de los mundos que están en esas posiciones de la lista, y las rarezas
export async function cargarGuardianes(posiciones, signal) {
  const [mundos, rarezas] = await Promise.all([pedir("/mundos", signal), pedir("/rarezas", signal)]);
  const detalles = await Promise.all(
    posiciones.map((posicion) => {
      const id = mundos.datos[posicion]?.id;
      return id ? pedir(`/mundos/${id}`, signal) : null;
    }),
  );
  return { rarezas: rarezas.datos, cromos: detalles.map((detalle) => detalle?.cromos?.[0] ?? null) };
}