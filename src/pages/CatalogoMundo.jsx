import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import "./CatalogoMundo.css";
import Rayos from "../assets/rayos/rayos.svg?react";
import Boton from "../components/Boton/Boton.jsx";
import Cromo from "../components/Cromo/Cromo.jsx";
import DetalleCromo from "../components/DetalleCromo/DetalleCromo.jsx";
import EtiquetaRareza from "../components/EtiquetaRareza/EtiquetaRareza.jsx";
import Icono from "../components/Icono/Icono.jsx";
import NoEncontrado from "./NoEncontrado.jsx";
import { estiloDeMundo } from "../config/mundos.js";
import { usePreferencias } from "../context/PreferenciasContext.jsx";
import { useDatos } from "../hooks/useDatos.js";
import { useMediaQuery } from "../hooks/useMediaQuery.js";
import { useTitulo } from "../hooks/useTitulo.js";
import { pedir } from "../services/api.js";
import { formatear, plural } from "../utils/formatear.js";

const ESCRITORIO = "(min-width: 56.25rem)";
// Valores que acepta la API en los filtros (contrato, sección 4)
const RAREZAS = ["comun", "rara", "epica", "legendaria"];
const TIPOS = ["heroe", "aliado", "villano"];

const rellenar = (numero) => String(numero).padStart(3, "0");
const normalizar = (texto) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Mundo (con sus 20 cromos), lista de mundos y rarezas
async function cargarBase(id, signal) {
  const [lista, mundo, rarezas] = await Promise.all([
    pedir("/mundos", signal),
    pedir(`/mundos/${encodeURIComponent(id)}`, signal),
    pedir("/rarezas", signal),
  ]);
  return { mundos: lista.datos, mundo, rarezas: rarezas.datos };
}

// Cromos del mundo, ya filtrados por la API
function cargarCromos(id, rareza, tipo, signal) {
  const consulta = new URLSearchParams({ mundo: id, porPagina: "100" });
  if (rareza) consulta.set("rareza", rareza);
  if (tipo) consulta.set("tipo", tipo);
  return pedir(`/cromos?${consulta}`, signal);
}

/* ------------------------------------------------------------------ */
/* Componente de las dos rutas:                                       */
/*   /mundos/:id        → catálogo de un mundo                        */
/*   /cromos/:cromoId   → el mismo catálogo con el detalle encima     */
/* ------------------------------------------------------------------ */
export default function CatalogoMundo() {
  const { id, cromoId } = useParams();
  const { state, search } = useLocation();
  const navigate = useNavigate();
  const { textos } = usePreferencias();
  const fondo = useRef(null);

  // En /cromos/:cromoId se pide el cromo; en /mundos/:id no hay nada que pedir
  const detalle = useDatos(
    (signal) =>
      cromoId ? pedir(`/cromos/${encodeURIComponent(cromoId)}`, signal) : Promise.resolve(null),
    [cromoId],
  );
  const cromo = cromoId ? detalle.datos : null;

  // El mundo sale de la ruta, del propio cromo o de lo que envió el catálogo al abrirlo
  const mundoId = id ?? cromo?.mundo ?? state?.mundo ?? null;
  const base = useDatos(
    (signal) => (mundoId ? cargarBase(mundoId, signal) : Promise.resolve(null)),
    [mundoId],
  );
  // Si aún quedan datos de otro mundo, se ignoran
  const cargada = base.datos?.mundo?.id === mundoId ? base.datos : null;

  const tDetalle = textos?.paginas?.detalleCromo;
  useTitulo(
    cromo && tDetalle ? formatear(tDetalle.seo.titulo, { nombre: cromo.nombre }) : null,
    cromo && tDetalle ? formatear(tDetalle.seo.descripcion, { poder: cromo.poder }) : null,
  );

  const abierto = Boolean(cromoId && cromo && cargada);

  // Con el detalle abierto, el catálogo de fondo queda inerte (sin foco ni clics)
  useEffect(() => {
    if (fondo.current) fondo.current.inert = abierto;
  }, [abierto, cargada]);

  const cerrar = useCallback(() => {
    // Si se llegó desde el catálogo, se vuelve atrás; si no, al catálogo de su mundo
    if (state?.desdeCatalogo) navigate(-1);
    else navigate({ pathname: `/mundos/${mundoId}`, search }, { replace: true });
  }, [state, navigate, mundoId, search]);

  // El foco vuelve a la carta que se abrió
  const retorno = useCallback(
    () => (cromo ? document.querySelector(`[data-cromo="${cromo.id}"]`) : null),
    [cromo],
  );

  const estados = textos?.estados;

  // Un mundo o un cromo que no existe: página de no encontrado
  if ((cromoId && detalle.codigo === 404) || base.codigo === 404) return <NoEncontrado />;

  const falla = (cromoId && detalle.error) || base.error;
  if (falla) {
    return (
      <section className="pagina">
        <div role="alert">
          <h1>{estados?.error?.titulo}</h1>
          <p>{estados?.error?.texto}</p>
          <Boton
            onClick={() => {
              if (detalle.error) detalle.reintentar();
              if (base.error) base.reintentar();
            }}
          >
            {estados?.error?.botones?.reintentar}
          </Boton>
        </div>
      </section>
    );
  }

  if (!cargada) {
    return (
      <section className="pagina">
        <p role="status">{estados?.cargando}</p>
      </section>
    );
  }

  // Vecinos del cromo dentro del mismo mundo (en el primero no hay anterior; en el último, siguiente)
  const cromosDelMundo = cargada.mundo.cromos ?? [];
  const posicion = cromo ? cromosDelMundo.findIndex((item) => item.id === cromo.id) : -1;
  const anterior = posicion > 0 ? cromosDelMundo[posicion - 1] : null;
  const siguiente =
    posicion >= 0 && posicion < cromosDelMundo.length - 1 ? cromosDelMundo[posicion + 1] : null;

  return (
    <>
      <div ref={fondo}>
        <Catalogo key={mundoId} mundoId={mundoId} base={cargada} sinTitulo={Boolean(cromoId)} />
      </div>

      {cromoId && !cromo && (
        <p className="solo-lectores" role="status">
          {estados?.cargando}
        </p>
      )}

      {abierto && (
        <DetalleCromo
          cromo={cromo}
          mundo={cargada.mundo}
          rarezas={cargada.rarezas}
          anterior={anterior}
          siguiente={siguiente}
          onCerrar={cerrar}
          retorno={retorno}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* El catálogo: cabecera, filtros y la lista de cromos                */
/* ------------------------------------------------------------------ */
function Catalogo({ mundoId, base, sinTitulo }) {
  const { textos } = usePreferencias();
  const escritorio = useMediaQuery(ESCRITORIO);
  const [params, setParams] = useSearchParams();
  const [buscando, setBuscando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Los filtros viven en la URL: ?rareza=legendaria&tipo=villano
  const rareza = RAREZAS.includes(params.get("rareza")) ? params.get("rareza") : "";
  const tipo = TIPOS.includes(params.get("tipo")) ? params.get("tipo") : "";

  const lista = useDatos(
    (signal) => cargarCromos(mundoId, rareza, tipo, signal),
    [mundoId, rareza, tipo],
  );

  const mundo = base.mundo;
  const t = textos?.paginas?.albumMundo;
  const estados = textos?.estados;
  const palabras = textos?.componentes?.cromo;
  const acciones = textos?.general?.acciones;
  // Si el detalle está abierto, el título lo pone el detalle
  useTitulo(
    !sinTitulo && t ? formatear(t.seo.titulo, { mundo: mundo.nombre }) : null,
    !sinTitulo && t ? formatear(t.seo.descripcion, { mundo: mundo.nombre }) : null,
  );

  // Cuántos cromos hay de cada tipo (se cuentan sobre los 20 del mundo)
  const porTipo = useMemo(() => {
    const cuenta = {};
    for (const cromo of mundo.cromos ?? []) cuenta[cromo.tipo] = (cuenta[cromo.tipo] ?? 0) + 1;
    return cuenta;
  }, [mundo]);

  if (!t) return null;

  // Legendaria primero, como en el diseño
  const rarezas = [...base.rarezas].reverse();
  const infoRareza = (rid) => base.rarezas.find((item) => item.id === rid);
  const palabraRareza = (rid) => palabras?.rarezas?.[rid] ?? infoRareza(rid)?.nombre ?? rid;
  const palabraTipo = (tid) => t.filtros.tipo.opciones?.[tid] ?? palabras?.tipos?.[tid] ?? tid;

  const cromos = lista.datos?.datos ?? [];
  const termino = escritorio ? "" : normalizar(busqueda.trim());
  const visibles = termino
    ? cromos.filter(
        (cromo) =>
          normalizar(cromo.nombre).includes(termino) || rellenar(cromo.numero).includes(termino),
      )
    : cromos;
  const hayFiltros = Boolean(rareza || tipo || termino);

  const indice = base.mundos.findIndex((item) => item.id === mundo.id);
  const rango = formatear(t.encabezado.rango, {
    numero: indice + 1,
    desde: rellenar(mundo.numeros.desde),
    hasta: rellenar(mundo.numeros.hasta),
  }).replace(/\.$/, "");

  function cambiarFiltro(clave, valor) {
    const siguiente = new URLSearchParams(params);
    // Pulsar de nuevo el filtro activo lo quita
    if (!valor || siguiente.get(clave) === valor) siguiente.delete(clave);
    else siguiente.set(clave, valor);
    setParams(siguiente);
  }

  function quitarFiltros() {
    const siguiente = new URLSearchParams(params);
    siguiente.delete("rareza");
    siguiente.delete("tipo");
    setParams(siguiente);
    setBusqueda("");
  }

  // Nombre accesible de cada cromo: número, nombre, rareza y tipo (la rareza nunca va solo con color)
  function nombreDeCromo(cromo) {
    const numeroYNombre = formatear(
      textos?.general?.formatos?.numeroYNombre ?? "{numero} {nombre}",
      { numero: rellenar(cromo.numero), nombre: cromo.nombre },
    );
    return [numeroYNombre, palabraRareza(cromo.rareza), palabraTipo(cromo.tipo)].join(", ");
  }

  /* ---------- Cabeceras ---------- */
  const cabeceraWeb = (
    <header className="catalogo__cabecera catalogo__cabecera--web">
      <Rayos className="catalogo__rayos" aria-hidden="true" focusable="false" />
      <div className="catalogo__cabecera-interior">
        <ol className="catalogo__migas">
          <li>
            <Link to="/">{t.migas.inicio}</Link>
          </li>
          <li className="catalogo__migas-separador" aria-hidden="true">
            <Icono nombre="chevronDer" tamano={16} />
          </li>
          <li aria-current="page">{mundo.nombre}</li>
        </ol>
        <h1 className="catalogo__titulo">{mundo.nombre}</h1>
        <p className="catalogo__rango">{`${rango} · ${mundo.tema}`}</p>
      </div>
    </header>
  );

  const cabeceraMovil = (
    <header className="catalogo__cabecera catalogo__cabecera--movil">
      <Rayos className="catalogo__rayos" aria-hidden="true" focusable="false" />
      <div className="catalogo__encabezado">
        <Link className="catalogo__circulo" to="/" aria-label={acciones?.volver}>
          <Icono nombre="flechaIzq" tamano={22} />
        </Link>
        <div className="catalogo__nombres">
          <h1 className="catalogo__nombre">{mundo.nombre}</h1>
          <p className="catalogo__tema">{mundo.tema}</p>
        </div>
        <button
          type="button"
          className="catalogo__circulo"
          aria-label={acciones?.buscar}
          aria-expanded={buscando}
          aria-controls="buscador-mundo"
          onClick={() => setBuscando((valor) => !valor)}
        >
          <Icono nombre="buscar" tamano={22} />
        </button>
      </div>
      {buscando && (
        <form
          id="buscador-mundo"
          className="catalogo__buscador"
          role="search"
          onSubmit={(evento) => evento.preventDefault()}
        >
          <label className="solo-lectores" htmlFor="campo-busqueda-mundo">
            {textos?.formularios?.campos?.busqueda?.label}
          </label>
          <input
            id="campo-busqueda-mundo"
            type="search"
            autoFocus
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder={textos?.formularios?.campos?.busqueda?.placeholder}
          />
        </form>
      )}
    </header>
  );

  /* ---------- Columna lateral (escritorio) ---------- */
  const lateral = (
    <aside className="catalogo__lateral">
      <section className="catalogo__panel" aria-labelledby="panel-mundos">
        <h2 id="panel-mundos" className="catalogo__panel-titulo">
          {t.mundos.titulo}
        </h2>
        <ul className="catalogo__mundos">
          {base.mundos.map((item) => {
            const activo = item.id === mundo.id;
            return (
              <li key={item.id}>
                <Link
                  className="catalogo__mundo"
                  to={`/mundos/${item.id}`}
                  aria-current={activo ? "page" : undefined}
                  style={estiloDeMundo(item)}
                >
                  <span className="catalogo__mundo-fila">
                    <span className="catalogo__punto" aria-hidden="true" />
                    <span className="catalogo__mundo-nombre">{item.nombre}</span>
                    <span className="catalogo__mundo-cantidad">
                      {formatear(t.mundos.cromos, { cantidad: item.totalCromos })}
                    </span>
                  </span>
                  {activo && (
                    <span className="catalogo__mundo-actual">{t.mundos.aria.paginaActual}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="catalogo__panel" aria-labelledby="panel-rareza">
        <h2 id="panel-rareza" className="catalogo__panel-titulo">
          {t.filtros.rareza.titulo}
        </h2>
        <ul className="catalogo__filtros">
          {rarezas.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="catalogo__filtro"
                aria-pressed={rareza === item.id}
                onClick={() => cambiarFiltro("rareza", item.id)}
              >
                <EtiquetaRareza rareza={item.id} icono={item.icono} texto={palabraRareza(item.id)} />
                <span className="catalogo__filtro-cantidad">
                  {plural(t.filtros.cantidad, mundo.porRareza?.[item.id] ?? 0)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="catalogo__panel" aria-labelledby="panel-tipo">
        <h2 id="panel-tipo" className="catalogo__panel-titulo">
          {t.filtros.tipo.titulo}
        </h2>
        <ul className="catalogo__filtros">
          {TIPOS.map((item) => (
            <li key={item}>
              <button
                type="button"
                className="catalogo__filtro catalogo__filtro--texto"
                aria-pressed={tipo === item}
                onClick={() => cambiarFiltro("tipo", item)}
              >
                <span className="catalogo__filtro-nombre">{palabraTipo(item)}</span>
                <span className="catalogo__filtro-cantidad">
                  {plural(t.filtros.cantidad, porTipo[item] ?? 0)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );

  /* ---------- Filtros (móvil) ---------- */
  const filtrosMovil = (
    <div className="catalogo__filtros-movil">
      <label className="catalogo__select">
        <span className="solo-lectores">{t.filtros.rareza.titulo}</span>
        <select value={rareza} onChange={(evento) => cambiarFiltro("rareza", evento.target.value)}>
          <option value="">{t.filtros.rareza.todas}</option>
          {rarezas.map((item) => (
            <option key={item.id} value={item.id}>
              {formatear(t.filtros.rareza.valor, { rareza: palabraRareza(item.id) })}
            </option>
          ))}
        </select>
        <Icono nombre="chevronAbajo" tamano={16} />
      </label>
      <label className="catalogo__select">
        <span className="solo-lectores">{t.filtros.tipo.titulo}</span>
        <select value={tipo} onChange={(evento) => cambiarFiltro("tipo", evento.target.value)}>
          <option value="">{t.filtros.tipo.todos}</option>
          {TIPOS.map((item) => (
            <option key={item} value={item}>
              {formatear(t.filtros.tipo.valor, { tipo: palabraTipo(item) })}
            </option>
          ))}
        </select>
        <Icono nombre="chevronAbajo" tamano={16} />
      </label>
    </div>
  );

  /* ---------- Herramientas (escritorio) ---------- */
  const herramientas = (
    <div className="catalogo__herramientas">
      {hayFiltros && (
        <Boton variante="fantasma" tamano="m" onClick={quitarFiltros}>
          {t.vacio.botones.limpiar}
        </Boton>
      )}
      {/* Único orden disponible: por número */}
      <p className="catalogo__orden">
        {formatear(t.orden.etiqueta, { orden: t.orden.opciones.numero })}
        <Icono nombre="chevronAbajo" tamano={16} />
      </p>
    </div>
  );

  return (
    <div className="catalogo" style={estiloDeMundo(mundo)}>
      {escritorio ? cabeceraWeb : cabeceraMovil}

      <div className="catalogo__contenido">
        {escritorio && lateral}

        <section className="catalogo__album" aria-label={mundo.nombre}>
          {escritorio ? herramientas : filtrosMovil}

          {/* Anuncia a los lectores de pantalla cuántos cromos coinciden */}
          <p className="solo-lectores" role="status">
            {lista.datos ? plural(t.filtros.cantidad, visibles.length) : ""}
          </p>

          <div className="catalogo__casillas">
            {lista.error && !lista.datos && (
              <div className="catalogo__estado" role="alert">
                <p>
                  <strong>{estados?.error?.titulo}</strong>
                </p>
                <p>{estados?.error?.texto}</p>
                <Boton variante="secundario" onClick={lista.reintentar}>
                  {estados?.error?.botones?.reintentar}
                </Boton>
              </div>
            )}

            {lista.cargando && !lista.datos && !lista.error && (
              <p className="catalogo__estado" role="status">
                {formatear(estados?.cargandoMundo, { mundo: mundo.nombre })}
              </p>
            )}

            {visibles.length > 0 && (
              <ul className="catalogo__lista">
                {visibles.map((cromo) => (
                  <li key={cromo.id}>
                    {/* Cada cromo abre su detalle (/cromos/:id) y conserva los filtros de la URL */}
                    <Link
                      className="catalogo__cromo"
                      to={{ pathname: `/cromos/${cromo.id}`, search: params.toString() }}
                      state={{ desdeCatalogo: true, mundo: mundo.id }}
                      data-cromo={cromo.id}
                      aria-label={nombreDeCromo(cromo)}
                    >
                      <Cromo
                        cromo={cromo}
                        tamano={escritorio ? "m" : "p"}
                        iconoRareza={infoRareza(cromo.rareza)?.icono}
                        rarezaTexto={palabraRareza(cromo.rareza)}
                        detalle={formatear(t.tarjeta.tipo, {
                          mundo: cromo.mundoNombre,
                          tipo: palabraTipo(cromo.tipo),
                        })}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {lista.datos && visibles.length === 0 && (
              <div className="catalogo__estado catalogo__vacio">
                <h2>{t.vacio.titulo}</h2>
                <p>{t.vacio.texto}</p>
                <Boton variante="secundario" onClick={quitarFiltros}>
                  {t.vacio.botones.limpiar}
                </Boton>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}