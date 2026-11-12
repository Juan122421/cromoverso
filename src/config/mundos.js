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
// Fondo suave de cada mundo (tokens de Figma). Si el id no está aquí,
// se calcula mezclando el color del mundo con blanco.
const SUAVES = {
  neon: "var(--mundo-neon-suave)",
  coral: "var(--mundo-coral-suave)",
  bosque: "var(--mundo-bosque-suave)",
  forja: "var(--mundo-forja-suave)",
  orbita: "var(--mundo-orbita-suave)",
  niebla: "var(--mundo-niebla-suave)",
};

// Variables CSS de un mundo: --mundo-color y --mundo-suave
export function estiloDeMundo(mundo) {
  return {
    "--mundo-color": mundo.color,
    "--mundo-suave":
      SUAVES[mundo.id] ?? `color-mix(in srgb, ${mundo.color} 14%, var(--fondo-superficie))`,
  };
}