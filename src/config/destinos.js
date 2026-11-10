// Destinos del menú. La clave debe coincidir con la de textos.navbar.enlaces
// y el orden es el del diseño. Agrega aquí los nuevos cuando la API los envíe.
export const DESTINOS = {
  inicio: { to: "/", icono: "inicio" },
  mundos: { to: "/mundos", icono: "mundo" },
};

// Enlaces del pie de página (la clave es la de la API).
// «terminos» y «accesibilidad» aún no tienen destino: el pie los muestra como texto.
export const DESTINOS_PIE = {
  inicio: "/",
  mundos: "/mundos",
  ingresar: "/ingresar",
  crearCuenta: "/registro",
};