import Icono from "../Icono/Icono.jsx";

export default function MenuMovil({
  abierto,
  onAlternar,
  menuId,
  botonRef,
  etiquetaAbrir,
  etiquetaCerrar,
}) {
  return (
    <button
      type="button"
      ref={botonRef}
      className="navbar-icono"
      aria-label={abierto ? etiquetaCerrar : etiquetaAbrir}
      aria-expanded={abierto}
      aria-controls={menuId}
      onClick={onAlternar}
    >
      <Icono nombre={abierto ? "cerrar" : "menu"} tamano={24} />
    </button>
  );
}