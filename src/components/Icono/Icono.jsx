const modulos = import.meta.glob("../../assets/icons/*.svg", {
  query: "?react",
  import: "default",
  eager: true,
});

// El nombre del icono es el del archivo sin ".svg": <Icono nombre="chevronDer" />
const ICONOS = Object.fromEntries(
  Object.entries(modulos).map(([ruta, Componente]) => [
    ruta.split("/").pop().replace(".svg", ""),
    Componente,
  ])
);

// Nombres antiguos que todavía usa el navbar actual.
// Se borra cuando el navbar se reemplace en la historia de navegación.
const ALIAS = { idioma: "globo", chevron: "chevronAbajo" };

export default function Icono({ nombre, tamano = 20 }) {
  const Componente = ICONOS[ALIAS[nombre] ?? nombre];
  if (!Componente) {
    if (import.meta.env.DEV) {
      console.warn(`Icono «${nombre}» no encontrado en src/assets/icons/`);
    }
    return null;
  }
  return <Componente width={tamano} height={tamano} aria-hidden="true" focusable="false" />;
}