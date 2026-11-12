import { Link } from "react-router-dom";
import "./Footer.css";
import Marca from "../Marca/Marca.jsx";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import { DESTINOS_PIE } from "../../config/destinos.js";

const COLUMNAS = ["explora", "cuenta", "legal"];

export default function Footer() {
  const { textos, abrirPanelAccesibilidad } = usePreferencias();
  const t = textos?.footer;
  const logo = textos?.navbar?.logo;
  if (!t || !logo) return null;

  const derechos = t.legal.derechos.replace("{anio}", new Date().getFullYear());

  return (
    <footer className="footer">
      <div className="footer__interior">
        <div className="footer__columnas">
          <div className="footer__marca">
            <Marca inversa texto={logo.texto} aria={logo.aria} />
            <p className="footer__lema">{t.lema}</p>
          </div>

          <div className="footer__enlaces">
            {COLUMNAS.map((clave) => {
              const columna = t.columnas[clave];
              const id = `footer-${clave}`;
              return (
                <nav key={clave} className="footer__columna" aria-labelledby={id}>
                  <h2 id={id} className="footer__titulo">
                    {columna.titulo}
                  </h2>
                  <ul className="footer__lista">
                    {Object.entries(columna.enlaces).map(([enlace, etiqueta]) => {
                      const destino = DESTINOS_PIE[enlace];
                      return (
                        <li key={enlace}>
                          {enlace === "accesibilidad" ? (
                            <button
                              type="button"
                              className="footer__enlace"
                              onClick={abrirPanelAccesibilidad}
                            >
                              {etiqueta}
                            </button>
                          ) : destino ? (
                            <Link className="footer__enlace" to={destino}>
                              {etiqueta}
                            </Link>
                          ) : (
                            // Sin destino todavía: se convierte en enlace cuando exista la vista
                            <span className="footer__enlace footer__enlace--pendiente">
                              {etiqueta}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              );
            })}
          </div>
        </div>

        <div className="footer__legal">
          <p className="footer__derechos">{derechos}</p>
        </div>
      </div>
    </footer>
  );
}