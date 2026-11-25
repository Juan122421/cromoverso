import "./EscenarioIngreso.css";
import Rayos from "../../assets/rayos/rayos.svg?react";
import Cromo from "../Cromo/Cromo.jsx";
import Etiqueta from "../Etiqueta/Etiqueta.jsx";
import Marca from "../Marca/Marca.jsx";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import { useDatos } from "../../hooks/useDatos.js";
import { cargarGuardianes } from "../../services/guardianes.js";
import { formatear } from "../../utils/formatear.js";

// Cartas del abanico y posición (en la lista de mundos) del mundo cuyo guardián muestra cada una.
// El orden es el de apilado: la última queda encima.
const ABANICO = [
  { lado: "izquierda", mundo: 2 }, // Raíz Madre (Bosque Eterno)
  { lado: "derecha", mundo: 5 }, // Reina Bruma (Reino de Niebla)
  { lado: "centro", mundo: 0 }, // Voltia (Ciudad Neón)
];
const POSICIONES = ABANICO.map((carta) => carta.mundo);

// Lado oscuro de las pantallas de ingreso y registro. Es decoración: se oculta a los lectores de pantalla.
export default function EscenarioIngreso({ presentacion }) {
  const { textos } = usePreferencias();
  const { datos } = useDatos((signal) => cargarGuardianes(POSICIONES, signal), []);
  const album = textos?.paginas?.albumMundo;
  if (!presentacion) return null;

  // «Seis mundos. 120 héroes. Un álbum tuyo.» se parte en una línea por frase, como en Figma
  const frases = presentacion.titulo.split(/(?<=\.)\s+/);

  return (
    <div className="escenario" aria-hidden="true">
      <Rayos className="escenario__rayos" focusable="false" />
      <Marca decorativa inversa texto={textos?.navbar?.logo?.texto ?? ""} />

      <div className="escenario__abanico">
        {datos &&
          ABANICO.map(({ lado }, indice) => {
            const cromo = datos.cromos[indice];
            if (!cromo) return null;
            const rareza = datos.rarezas.find((item) => item.id === cromo.rareza);
            return (
              <div key={cromo.id} className={`escenario__carta escenario__carta--${lado}`}>
                <Cromo
                  cromo={cromo}
                  tamano="g"
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