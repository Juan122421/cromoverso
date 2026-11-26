// «Laura Cardona» → «LC». Con una sola palabra toma sus dos primeras letras.
export function iniciales(nombre = "") {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return "";
  const primera = palabras[0][0];
  const segunda = palabras.length > 1 ? palabras[palabras.length - 1][0] : (palabras[0][1] ?? "");
  return (primera + segunda).toUpperCase();
}

// Nombre que se le muestra a la persona (si no tiene nombre, su alias)
export function nombreVisible(usuario) {
  return usuario?.nombre?.trim() || usuario?.alias || "";
}