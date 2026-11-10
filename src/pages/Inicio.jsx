import "./Inicio.css";
import Boton from "../components/Boton/Boton.jsx";
import Icono from "../components/Icono/Icono.jsx";
import Cromo from "../components/Cromo/Cromo.jsx";
import TarjetaMundo from "../components/TarjetaMundo/TarjetaMundo.jsx";
import { usePreferencias } from "../context/PreferenciasContext.jsx";
import { useDatos } from "../hooks/useDatos.js";
import { useTitulo } from "../hooks/useTitulo.js";
import { pedir } from "../services/api.js";
import { formatear } from "../utils/formatear.js";

// Posición (en la lista de mundos) del mundo cuyo guardián va en cada carta
// de la portada: izquierda, centro y derecha. Los datos salen de la API.
const MUNDOS_DESTACADOS = [2, 0, 4];
const LADOS = ["izquierda", "centro", "derecha"];

async function cargarInicio(signal) {
  const [mundos, rarezas] = await Promise.all([
    pedir("/mundos", signal),
    pedir("/rarezas", signal),
  ]);
  const ids = MUNDOS_DESTACADOS.map((posicion) => mundos.datos[posicion]?.id);
  const detalles = await Promise.all(ids.map((id) => (id ? pedir(`/mundos/${id}`, signal) : null)));
  return {
    mundos: mundos.datos,
    rarezas: rarezas.datos,
    destacados: detalles.map((detalle) => detalle?.cromos?.[0] ?? null),
  };
}

export default function Inicio() {
  const { textos } = usePreferencias();
  const { datos, cargando, error, reintentar } = useDatos(cargarInicio, []);
  const t = textos?.paginas?.inicio;
  const estados = textos?.estados;
  const palabras = textos?.componentes?.cromo;
  useTitulo(t?.seo?.titulo);

  if (!t) return null;

  const primero = datos?.mundos?.[0];
  const explorar = primero ? `/mundos/${primero.id}` : "/mundos";
  const rareza = (id) => datos?.rarezas?.find((item) => item.id === id);

  return (
    <>
      {/* ---------- Portada ---------- */}
      <section className="hero" aria-labelledby="hero-titulo">
        <div className="hero__rayos" aria-hidden="true" />
        <div className="hero__interior">
          <div className="hero__bienvenida">
            <h1 id="hero-titulo" className="hero__titulo">
              {t.hero.titulo}
            </h1>
            <p className="hero__subtitulo ocultar-escritorio">{t.hero.subtituloMovil}</p>
            <div className="hero__acciones">
              <Boton
                variante="acento"
                tamano="g"
                icono="regalo"
                to="/registro"
                className="hero__boton"
              >
                {t.hero.botones.crearCuentaGratis}
              </Boton>
              <Boton
                variante="secundario"
                tamano="g"
                icono="album"
                to={explorar}
                className="hero__boton"
              >
                {t.hero.botones.explorarMundos}
              </Boton>
            </div>
            <p className="hero__nota ocultar-movil">
              <span className="hero__nota-icono">
                <Icono nombre="destellos" tamano={18} />
              </span>
              {t.hero.subtitulo}
            </p>
          </div>

          {/* Cartas destacadas: decoración de la portada, solo en pantallas anchas */}
          <div className="hero__cartas" aria-hidden="true">
            {datos?.destacados.map((cromo, indice) => {
              if (!cromo) return null;
              const lado = LADOS[indice];
              return (
                <div key={cromo.id} className={`hero__carta hero__carta--${lado}`}>
                  <Cromo
                    cromo={cromo}
                    tamano="g"
                    iconoRareza={rareza(cromo.rareza)?.icono}
                    rarezaTexto={palabras?.rarezas?.[cromo.rareza]}
                    detalle={formatear(t.tarjeta.tipo, {
                      mundo: cromo.mundoNombre,
                      tipo: palabras?.tipos?.[cromo.tipo],
                    })}
                  />
                  {lado === "centro" && (
                    <span className="hero__sello">
                      <Icono nombre="destellos" tamano={16} />
                      {t.hero.etiquetas.guardiana}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Los seis mundos ---------- */}
      <section className="mundos" aria-labelledby="mundos-titulo">
        <div className="mundos__interior">
          <div className="mundos__cabecera">
            <div className="mundos__titulos">
              <h2 id="mundos-titulo" className="mundos__titulo">
                {t.mundos.titulo}
              </h2>
              <p className="mundos__subtitulo ocultar-movil">{t.mundos.subtitulo}</p>
            </div>
            {primero && (
              <Boton
                variante="fantasma"
                tamano="m"
                icono="flechaDer"
                iconoAlFinal
                to={`/mundos/${primero.id}`}
                className="mundos__ver"
              >
                {formatear(t.mundos.enlaces.ver, { mundo: primero.nombre })}
              </Boton>
            )}
          </div>

          {cargando && (
            <p className="mundos__estado" role="status">
              {estados?.cargando}
            </p>
          )}

          {error && (
            <div className="mundos__estado" role="alert">
              <p>
                <strong>{estados?.error?.titulo}</strong>
              </p>
              <p>{estados?.error?.texto}</p>
              <Boton variante="secundario" tamano="m" onClick={reintentar}>
                {estados?.error?.botones?.reintentar}
              </Boton>
            </div>
          )}

          {datos && (
            <ul className="mundos__lista">
              {datos.mundos.map((mundo, indice) => (
                <li key={mundo.id}>
                  <TarjetaMundo
                    mundo={mundo}
                    // En Figma solo el primer mundo lleva la etiqueta «Mundo 1»
                    etiqueta={indice === 0 ? formatear(t.mundos.etiquetas.mundo, { numero: 1 }) : null}
                    cantidad={formatear(t.mundos.etiquetas.cromos, { cantidad: mundo.totalCromos })}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}