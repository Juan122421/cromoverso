const ICONO_POR_FIGURA = {
  rayo: "rayo", // Ciudad Neón
  ola: "mundo", // Abismo Coral
  hoja: "destellos", // Bosque Eterno
  llama: "llama", // Forja Volcánica
  orbita: "estrella", // Estación Órbita
  runa: "ojo", // Reino de Niebla
};
export function iconoDeFigura(figura) {
  return ICONO_POR_FIGURA[figura] ?? "estrella";
}