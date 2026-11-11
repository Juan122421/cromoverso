// Reemplaza los {marcadores} de un texto de la API.
// formatear("Ver {mundo}", { mundo: "Ciudad Neón" }) → "Ver Ciudad Neón"
export function formatear(plantilla, valores = {}) {
  if (typeof plantilla !== "string") return "";
  return plantilla.replace(/\{(\w+)\}/g, (_, clave) => String(valores[clave] ?? ""));
}