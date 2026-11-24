import Boton from "../Boton/Boton.jsx";
import EstadoVista from "../EstadoVista/EstadoVista.jsx";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";

// Estado de error de una vista. Todos los mensajes salen de textos.estados y textos.errores:
//  · sin respuesta (sin red)      → estados.sinConexion
//  · la API respondió con un error → estados.error + el mensaje de errores[codigo]
export default function EstadoError({ fallo, onReintentar, conInicio = false }) {
  const { textos } = usePreferencias();
  const estados = textos?.estados;
  if (!estados) return null;

  const sinConexion = Boolean(fallo?.sinConexion);
  const titulo = sinConexion ? estados.sinConexion?.titulo : estados.error?.titulo;
  const texto = sinConexion
    ? estados.sinConexion?.texto
    : (fallo?.codigo && textos.errores?.[fallo.codigo]) || estados.error?.texto;

  return (
    <EstadoVista
      rol="alert"
      tono="error"
      icono={sinConexion ? "wifiOff" : "alerta"}
      titulo={titulo}
      texto={texto}
    >
      <Boton onClick={onReintentar}>{estados.error?.botones?.reintentar}</Boton>
      {/* En móvil el catálogo no muestra el navbar: este botón evita quedarse sin salida */}
      {conInicio && (
        <Boton variante="secundario" to="/">
          {estados.noEncontrado?.botones?.irAlInicio}
        </Boton>
      )}
    </EstadoVista>
  );
}