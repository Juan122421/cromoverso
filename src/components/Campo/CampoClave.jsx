import { useState } from "react";
import Campo from "./Campo.jsx";
import Icono from "../Icono/Icono.jsx";

// Contraseña con botón para mostrarla u ocultarla.
// El nombre accesible del botón cambia con el estado: «Mostrar contraseña» / «Ocultar contraseña».
export default function CampoClave({ id, textoMostrar, textoOcultar, ...resto }) {
  const [visible, setVisible] = useState(false);

  const boton = (
    <button
      type="button"
      className="campo__ver"
      aria-label={visible ? textoOcultar : textoMostrar}
      aria-controls={id}
      onClick={() => setVisible((actual) => !actual)}
    >
      <Icono nombre={visible ? "ojoTachado" : "ojo"} tamano={20} />
    </button>
  );

  return <Campo id={id} tipo={visible ? "text" : "password"} acciones={boton} {...resto} />;
}