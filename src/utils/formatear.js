// Reemplaza los {marcadores} de un texto de la API.
// formatear("Ver {mundo}", { mundo: "Ciudad Neón" }) → "Ver Ciudad Neón"
export function formatear(plantilla, valores = {}) {
  if (typeof plantilla !== "string") return "";
  return plantilla.replace(/\{(\w+)\}/g, (_, clave) => String(valores[clave] ?? ""));
}
export function plural(formas, cantidad, valores = {}) {
  const plantilla = cantidad === 1 ? formas?.uno : formas?.otro;
  return formatear(plantilla, { cantidad, ...valores });
}