import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./DetalleCromo.css";
import Rayos from "../../assets/rayos/rayos.svg?react";
import Boton from "../Boton/Boton.jsx";
import Cromo from "../Cromo/Cromo.jsx";
import Etiqueta from "../Etiqueta/Etiqueta.jsx";
import EtiquetaRareza from "../EtiquetaRareza/EtiquetaRareza.jsx";
import Icono from "../Icono/Icono.jsx";
import { estiloDeMundo, iconoDeFigura } from "../../config/mundos.js";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import { useDialogo } from "../../hooks/useDialogo.js";
import { useMediaQuery } from "../../hooks/useMediaQuery.js";
import { formatear } from "../../utils/formatear.js";

const ESCRITORIO = "(min-width: 56.25rem)";
// Orden de los atributos (son claves de la API, no textos)
const ATRIBUTOS = ["fuerza", "velocidad", "mente", "energia"];
const rellenar = (numero) => String(numero).padStart(3, "0");

export default function DetalleCromo({
  cromo,
  mundo,
  rarezas,
  anterior,
  siguiente,
  onCerrar,
  retorno,
}) {
  const { textos } = usePreferencias();
  const { search, state } = useLocation();
  const escritorio = useMediaQuery(ESCRITORIO);
  const raiz = useRef(null);
  const botonCerrar = useRef(null);
  useDialogo({ raiz, inicial: botonCerrar, onCerrar, retorno });

  // Al pasar a otro cromo, si el foco quedó en un botón que ya no existe, vuelve a «Cerrar»
  useEffect(() => {
    if (raiz.current && !raiz.current.contains(document.activeElement)) {
      botonCerrar.current?.focus();
    }
  }, [cromo.id]);

  const t = textos?.paginas?.detalleCromo;
  const album = textos?.paginas?.albumMundo;
  const palabras = textos?.componentes?.cromo;
  if (!t) return null;

  const rareza = rarezas.find((item) => item.id === cromo.rareza);
  const palabraRareza = palabras?.rarezas?.[cromo.rareza] ?? rareza?.nombre ?? cromo.rareza;
  const palabraTipo = t.encabezado.tipos?.[cromo.tipo] ?? cromo.tipo;
  const total = ATRIBUTOS.reduce((suma, clave) => suma + (cromo.atributos?.[clave] ?? 0), 0);
  const detalleCarta = formatear(album?.tarjeta?.tipo, {
    mundo: cromo.mundoNombre,
    tipo: palabraTipo,
  });
  const formatoNumero = textos?.general?.formatos?.numeroYNombre ?? "{numero} {nombre}";
  const etiquetaDe = (item) =>
    formatear(formatoNumero, { numero: rellenar(item.numero), nombre: item.nombre });
  // Los filtros del catálogo viajan en la URL también al pasar de un cromo a otro
  const enlaceA = (item) => ({ pathname: `/cromos/${item.id}`, search });

  const carta = (
    <Cromo
      cromo={cromo}
      tamano={escritorio ? "g" : "m"}
      iconoRareza={rareza?.icono}
      rarezaTexto={palabraRareza}
      detalle={detalleCarta}
    />
  );

  const cerrar = (
    <button
      ref={botonCerrar}
      type="button"
      className="detalle__cerrar"
      aria-label={t.botones.cerrar}
      onClick={onCerrar}
    >
      <Icono nombre="cerrar" tamano={escritorio ? 20 : 22} />
    </button>
  );

  const poder = (
    <section className="detalle__poder" aria-labelledby="detalle-poder">
      <span className="detalle__poder-icono" aria-hidden="true">
        <Icono nombre={iconoDeFigura(mundo.figura)} tamano={escritorio ? 20 : 18} />
      </span>
      <h3 id="detalle-poder" className="detalle__poder-titulo">
        {t.poder.titulo}
      </h3>
      <p className="detalle__poder-valor">{cromo.poder}</p>
    </section>
  );

  const atributos = (
    <section className="detalle__atributos" aria-labelledby="detalle-atributos">
      <div className="detalle__atributos-cabecera">
        <h3 id="detalle-atributos" className="detalle__atributos-titulo">
          {t.atributos.titulo}
        </h3>
        {escritorio && (
          <p className="detalle__total">{formatear(t.atributos.total, { total })}</p>
        )}
      </div>
      <dl className="detalle__atributos-lista">
        {ATRIBUTOS.map((clave) => (
          <div key={clave} className="detalle__atributo" style={{ "--valor": cromo.atributos[clave] }}>
            <dt className="detalle__atributo-nombre">{t.atributos.nombres[clave]}</dt>
            <dd className="detalle__atributo-medida">
              <span className="detalle__barra" aria-hidden="true">
                <span className="detalle__avance" />
              </span>
              <span className="detalle__numero">{cromo.atributos[clave]}</span>
            </dd>
          </div>
        ))}
      </dl>
      {/* En móvil la escala se ve; en escritorio solo la oyen los lectores de pantalla */}
      <p className={escritorio ? "solo-lectores" : "detalle__escala"}>{t.atributos.escala}</p>
    </section>
  );

  return (
    <div className="detalle" ref={raiz} style={estiloDeMundo(mundo)}>
      <div className="detalle__velo" aria-hidden="true" onClick={onCerrar} />

      <div
        className="detalle__dialogo"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalle-titulo"
      >
        {escritorio ? (
          <>
            {/* La carta repite lo que dice el texto: se oculta a los lectores de pantalla */}
            <div className="detalle__carta" aria-hidden="true">
              <Rayos className="detalle__rayos" aria-hidden="true" focusable="false" />
              {carta}
            </div>

            <div className="detalle__info">
              <div className="detalle__etiquetas">
                <EtiquetaRareza rareza={cromo.rareza} icono={rareza?.icono} texto={palabraRareza} />
                <Etiqueta tono="mundo">{cromo.mundoNombre}</Etiqueta>
                <Etiqueta>{palabraTipo}</Etiqueta>
                <span className="detalle__espacio" />
                {cerrar}
              </div>

              <div className="detalle__titulo">
                <p className="detalle__ubicacion">
                  {formatear(t.encabezado.ubicacion, {
                    id: cromo.id,
                    mundo: cromo.mundoNombre,
                    posicion: cromo.posicion,
                  })}
                </p>
                <h2 id="detalle-titulo" className="detalle__nombre">
                  {cromo.nombre}
                </h2>
              </div>

              {poder}
              <p className="detalle__descripcion">{cromo.descripcion}</p>
              {atributos}

              <div className="detalle__vecinos">
                {anterior && (
                  <Boton
                    variante="fantasma"
                    tamano="p"
                    icono="chevronIzq"
                    to={enlaceA(anterior)}
                    state={state}
                    replace
                    aria-label={`${t.navegacion.anterior}: ${etiquetaDe(anterior)}`}
                  >
                    {etiquetaDe(anterior)}
                  </Boton>
                )}
                <span className="detalle__espacio" />
                {siguiente && (
                  <Boton
                    variante="fantasma"
                    tamano="p"
                    icono="chevronDer"
                    iconoAlFinal
                    to={enlaceA(siguiente)}
                    state={state}
                    replace
                    aria-label={`${t.navegacion.siguiente}: ${etiquetaDe(siguiente)}`}
                  >
                    {etiquetaDe(siguiente)}
                  </Boton>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <span className="detalle__asa" aria-hidden="true" />
            <div className="detalle__encabezado">{cerrar}</div>

            <div className="detalle__identidad">
              <div className="detalle__carta-movil" aria-hidden="true">
                {carta}
              </div>
              <div className="detalle__datos">
                <p className="detalle__id">{cromo.id}</p>
                <h2 id="detalle-titulo" className="detalle__nombre">
                  {cromo.nombre}
                </h2>
                <p className="detalle__sub">{detalleCarta}</p>
                <EtiquetaRareza rareza={cromo.rareza} icono={rareza?.icono} texto={palabraRareza} />
              </div>
            </div>

            {poder}
            {atributos}
          </>
        )}
      </div>

      {/* Anuncia el cromo a los lectores de pantalla (también al pasar al anterior o siguiente) */}
      <p className="solo-lectores" role="status">
        {etiquetaDe(cromo)}
      </p>
    </div>
  );
}