const modulos = import.meta.glob("../../assets/icons/*.svg", {
  query: "?react",
  import: "default",
  eager: true,
});

// El nombre del icono es el del archivo sin ".svg": <Icono nombre="chevronDer" />
// Se guarda en minúscula para que no importe cómo se llame el archivo.
const ICONOS = Object.fromEntries(
  Object.entries(modulos).map(([ruta, Componente]) => [
    ruta.split("/").pop().replace(".svg", "").toLowerCase(),
    Componente,
  ])
);

export default function Icono({ nombre, tamano = 20 }) {
  const Componente = ICONOS[nombre.toLowerCase()];
  if (!Componente) {
    if (import.meta.env.DEV) {
      console.warn(`Icono «${nombre}» no encontrado en src/assets/icons/`);
    }
    return null;
  }
  return <Componente width={tamano} height={tamano} aria-hidden="true" focusable="false" />;
}