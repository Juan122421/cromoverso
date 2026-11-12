// Primer mundo del álbum (GET /mundos). «Mundos» en el menú redirige aquí.
export const MUNDO_INICIAL = "neon";

// Destinos del menú. La clave debe coincidir con la de textos.navbar.enlaces
// y el orden es el del diseño. Agrega aquí los nuevos cuando la API los envíe.
// /mundos redirige al catálogo del primer mundo; sin `end`, NavLink sigue
// marcado en /mundos/coral, /mundos/bosque, etc.
export const DESTINOS = {
  inicio: { to: "/", icono: "inicio" },
  mundos: { to: "/mundos", icono: "mundo" },
};

// Enlaces del pie de página (la clave es la de la API).
// «terminos» aún no tiene destino: el pie lo muestra como texto.
export const DESTINOS_PIE = {
  inicio: "/",
  mundos: "/mundos",
  ingresar: "/ingresar",
  crearCuenta: "/registro",
};