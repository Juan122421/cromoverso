export function leerCookie(nombre) {
  const fila = document.cookie
    .split("; ")
    .find((parte) => parte.startsWith(`${nombre}=`));
  return fila ? decodeURIComponent(fila.slice(nombre.length + 1)) : null;
}

export function guardarCookie(nombre, valor, dias = 365) {
  const segundos = dias * 24 * 60 * 60;
  document.cookie = `${nombre}=${encodeURIComponent(valor)}; path=/; max-age=${segundos}; SameSite=Lax`;
}

export function borrarCookie(nombre) {
  document.cookie = `${nombre}=; path=/; max-age=0; SameSite=Lax`;
}
