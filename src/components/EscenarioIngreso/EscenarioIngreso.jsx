import "./EscenarioIngreso.css";
import Rayos from "../../assets/rayos/rayos.svg?react";
import Cromo from "../Cromo/Cromo.jsx";
import Etiqueta from "../Etiqueta/Etiqueta.jsx";
import Marca from "../Marca/Marca.jsx";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import { useDatos } from "../../hooks/useDatos.js";
import { useMediaQuery } from "../../hooks/useMediaQuery.js";
import { cargarGuardianes } from "../../services/guardianes.js";
import { formatear } from "../../utils/formatear.js";

const ESCRITORIO = "(min-width: 56.25rem)";
// Cartas del abanico y posición (en la lista de mundos) del mundo cuyo guardián muestra cada una.
// El orden es el de apilado: la última queda encima.
const ABANICO = [
  { lado: "izquierda", mundo: 2 }, // Raíz Madre (Bosque Eterno)
  { lado: "derecha", mundo: 5, soloEscritorio: true }, // Reina Bruma (Reino de Niebla)
  { lado: "centro", mundo: 0 }, // Voltia (Ciudad Neón)
];

// Lado oscuro de las pantallas de ingreso y registro. Es decoración: se oculta a los lectores de pantalla.
export default function EscenarioIngreso({ presentacion }) {
  const { textos } = usePreferencias();
  const escritorio = useMediaQuery(ESCRITORIO);
  // En móvil el diseño solo muestra dos cartas
  const cartas = ABANICO.filter((carta) => escritorio || !carta.soloEscritorio);
  const { datos } = useDatos(
    (signal) => cargarGuardianes(cartas.map((carta) => carta.mundo), signal),
    [escritorio],
  );
  const album = textos?.paginas?.albumMundo;
  if (!presentacion) return null;

  // «Seis mundos. 120 héroes. Un álbum tuyo.» se parte en una línea por frase, como en Figma
  const frases = presentacion.titulo.split(/(?<=\.)\s+/);
  const listo = datos?.cromos.length === cartas.length;

  return (
    <div className="escenario" aria-hidden="true">
      <Rayos className="escenario__rayos" focusable="false" />

      <div className="escenario__encabezado">
        <Marca decorativa inversa texto={textos?.navbar?.logo?.texto ?? ""} />
      </div>

      <div className="escenario__abanico">
        {listo &&
          cartas.map(({ lado }, indice) => {
            const cromo = datos.cromos[indice];
            if (!cromo) return null;
            const rareza = datos.rarezas.find((item) => item.id === cromo.rareza);
            return (
              <div key={cromo.id} className={`escenario__carta escenario__carta--${lado}`}>
                <Cromo
                  cromo={cromo}
                  tamano={escritorio ? "g" : "m"}
                  iconoRareza={rareza?.icono}
                  rarezaTexto={rareza?.nombre}
                  detalle={formatear(album?.tarjeta?.tipo, {
                    mundo: cromo.mundoNombre,
                    tipo: album?.filtros?.tipo?.opciones?.[cromo.tipo],
                  })}
                />
              </div>
            );
          })}
      </div>

      <div className="escenario__lema">
        <Etiqueta tono="marca">{presentacion.etiquetas.temporada}</Etiqueta>
        <p className="escenario__titulo">
          {frases.map((frase) => (
            <span key={frase} className="escenario__frase">
              {frase}
            </span>
          ))}
        </p>
        <p className="escenario__texto">{presentacion.texto}</p>
      </div>
    </div>
  );
}