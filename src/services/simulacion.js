const CLAVE = "cromoverso-simulacion";
const ERRORES_VALIDOS = [500, 503, 504];
const LATENCIA_MAXIMA = 15000;

function leer() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE)) ?? {};
  } catch {
    return {};
  }
}

function guardar(estado) {
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    /* sin almacenamiento: no hay simulación */
  }
}

// Al cargar la página, lee la simulación pedida en la dirección
function leerDeLaUrl() {
  const params = new URLSearchParams(window.location.search);
  const pedida = ["simular", "simular-latencia", "simular-error"].some((clave) => params.has(clave));
  if (!pedida) return;

  let estado = leer();
  if (params.get("simular") === "off") estado = {};
  if (params.has("simular-latencia")) estado.latencia = params.get("simular-latencia");
  if (params.has("simular-error")) estado.error = params.get("simular-error");
  guardar(estado);
  console.info("Simulación de la API:", estado);
}
leerDeLaUrl();

export function cabecerasDeSimulacion() {
  const { latencia, error } = leer();
  const cabeceras = {};
  const milisegundos = Number.parseInt(latencia, 10);
  if (milisegundos > 0) {
    cabeceras["X-Simular-Latencia"] = String(Math.min(milisegundos, LATENCIA_MAXIMA));
  }
  const codigo = Number.parseInt(error, 10);
  if (ERRORES_VALIDOS.includes(codigo)) cabeceras["X-Simular-Error"] = String(codigo);
  return cabeceras;
}