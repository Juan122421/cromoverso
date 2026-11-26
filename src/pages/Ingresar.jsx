import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./Ingresar.css";
import Aviso from "../components/Aviso/Aviso.jsx";
import Boton from "../components/Boton/Boton.jsx";
import Campo from "../components/Campo/Campo.jsx";
import CampoClave from "../components/Campo/CampoClave.jsx";
import Casilla from "../components/Casilla/Casilla.jsx";
import EscenarioIngreso from "../components/EscenarioIngreso/EscenarioIngreso.jsx";
import Marca from "../components/Marca/Marca.jsx";
import { usePreferencias } from "../context/PreferenciasContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { useTitulo } from "../hooks/useTitulo.js";
import { formatear } from "../utils/formatear.js";

const ID_ENVIAR = "ingresar-enviar";
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Ingresar() {
  const { textos } = usePreferencias();
  const { usuario, iniciarSesion } = useSesion();
  const refCorreo = useRef(null);
  const refClave = useRef(null);
  const enviandoRef = useRef(false);

  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [recordar, setRecordar] = useState(true);
  const [errores, setErrores] = useState({}); // mensaje junto a cada campo: { correo, clave }
  const [aviso, setAviso] = useState(null); // { tipo: campos | credenciales | espera | conexion | servidor, ... }
  const [enviando, setEnviando] = useState(false);
  const [espera, setEspera] = useState(0); // segundos que la API pide esperar (error 429)

  const t = textos?.paginas?.ingresar;
  const f = t?.formulario;
  useTitulo(t?.seo?.titulo, t?.seo?.descripcion);

  // Cuenta regresiva del error 429: el botón se bloquea hasta que termina
  useEffect(() => {
    if (espera <= 0) return undefined;
    const reloj = setTimeout(() => setEspera((segundos) => segundos - 1), 1000);
    return () => clearTimeout(reloj);
  }, [espera]);
  useEffect(() => {
    if (espera === 0) setAviso((actual) => (actual?.tipo === "espera" ? null : actual));
  }, [espera]);

  // Con la sesión ya iniciada no hay nada que hacer aquí: se vuelve al inicio
  if (usuario) return <Navigate to="/" replace />;
  if (!t || !f) return null;

  function enfocarEnviar() {
    window.requestAnimationFrame(() => document.getElementById(ID_ENVIAR)?.focus());
  }

  function enfocarPrimerError(problemas) {
    if (problemas.correo) refCorreo.current?.focus();
    else if (problemas.clave) refClave.current?.focus();
  }

  function validar() {
    const problemas = {};
    if (!correo.trim()) problemas.correo = t.errores.correoObligatorio;
    else if (!CORREO_VALIDO.test(correo.trim())) {
      problemas.correo = textos?.formularios?.validacion?.correoInvalido;
    }
    if (!clave) problemas.clave = t.errores.claveObligatoria;
    return problemas;
  }

  // Al corregir un campo se quita su error; sin errores pendientes, también el aviso
  function limpiarError(campo) {
    if (!errores[campo]) return;
    const restantes = { ...errores };
    delete restantes[campo];
    setErrores(restantes);
    if (Object.keys(restantes).length === 0) {
      setAviso((actual) => (actual?.tipo === "campos" ? null : actual));
    }
  }

  function mostrarFallo(fallo) {
    if (fallo.sinConexion) {
      setAviso({ tipo: "conexion" });
      enfocarEnviar();
    } else if (fallo.estado === 401) {
      // Un solo mensaje: no se dice cuál de los dos datos falló
      setAviso({ tipo: "credenciales" });
      enfocarEnviar();
    } else if (fallo.estado === 422) {
      const problemas = {};
      if (fallo.campos?.correo) problemas.correo = fallo.campos.correo;
      if (fallo.campos?.clave) problemas.clave = fallo.campos.clave;
      setErrores(problemas);
      setAviso({ tipo: "campos" });
      enfocarPrimerError(problemas);
    } else if (fallo.estado === 429) {
      const segundos = fallo.reintentarEn ?? 30;
      setEspera(segundos);
      setAviso({ tipo: "espera", segundos });
    } else {
      setAviso({ tipo: "servidor", codigo: fallo.codigo });
      enfocarEnviar();
    }
  }

 async function alEnviar(evento) {
  evento.preventDefault();
  // Un segundo envío mientras el primero sigue en curso se ignora (aunque React aún no haya repintado)
  if (enviandoRef.current || espera > 0) return;

  const problemas = validar();
  if (Object.keys(problemas).length > 0) {
    setErrores(problemas);
    setAviso({ tipo: "campos" });
    enfocarPrimerError(problemas); // el foco va al primer campo con error
    return;
  }

  setErrores({});
  setAviso(null);
  enviandoRef.current = true;
  setEnviando(true);
  try {
    // Si todo sale bien, el contexto guarda al usuario y esta vista redirige al inicio
    await iniciarSesion(correo.trim(), clave);
  } catch (fallo) {
    mostrarFallo(fallo);
  } finally {
    enviandoRef.current = false;
    setEnviando(false);
  }
}

  // Textos del aviso: salen de la API según el tipo de aviso
  let contenidoAviso = null;
  if (aviso) {
    const e = t.errores;
    if (aviso.tipo === "campos") {
      contenidoAviso = { titulo: e.camposObligatorios.titulo, texto: e.camposObligatorios.texto };
    } else if (aviso.tipo === "credenciales") {
      contenidoAviso = { titulo: e.credenciales.titulo, texto: e.credenciales.texto };
    } else if (aviso.tipo === "espera") {
      contenidoAviso = {
        titulo: e.demasiadosIntentos.titulo,
        texto: formatear(e.demasiadosIntentos.texto, { segundos: aviso.segundos }),
      };
    } else if (aviso.tipo === "conexion") {
      contenidoAviso = { titulo: e.conexion.titulo, texto: e.conexion.texto };
    } else {
      contenidoAviso = {
        titulo: e.conexion.titulo,
        texto: (aviso.codigo && textos.errores?.[aviso.codigo]) || textos.errores?.generico,
      };
    }
  }

  // Tras un fallo de conexión o del servidor, el botón invita a reintentar (Figma)
  const reintentar = aviso?.tipo === "conexion" || aviso?.tipo === "servidor";
  let textoBoton = f.botones.ingresar;
  if (enviando) textoBoton = f.mensajes.ingresando;
  else if (reintentar) textoBoton = t.errores.conexion.botones.reintentar;

  return (
    <div className="ingresar">
      <EscenarioIngreso presentacion={t.presentacion} />

      <div className="ingresar__lado">
        <form className="ingresar__formulario" onSubmit={alEnviar} noValidate aria-busy={enviando}>
        
          <div className="ingresar__logo ocultar-movil">
            <Marca texto={textos?.navbar?.logo?.texto} aria={textos?.navbar?.logo?.aria} />
          </div>
          <h1 className="ingresar__titulo">{f.titulo}</h1>
          <p className="ingresar__subtitulo">{f.subtitulo}</p>

          {contenidoAviso && <Aviso titulo={contenidoAviso.titulo}>{contenidoAviso.texto}</Aviso>}

          <Campo
            id="ingresar-correo"
            etiqueta={f.etiquetas.correo}
            tipo="email"
            valor={correo}
            onChange={(evento) => {
              setCorreo(evento.target.value);
              limpiarError("correo");
            }}
            placeholder={f.placeholders.correo}
            error={errores.correo}
            inputRef={refCorreo}
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
          />

          <CampoClave
            id="ingresar-clave"
            etiqueta={f.etiquetas.clave}
            valor={clave}
            onChange={(evento) => {
              setClave(evento.target.value);
              limpiarError("clave");
            }}
            error={errores.clave}
            inputRef={refClave}
            autoComplete="current-password"
            textoMostrar={f.botones.mostrarClave}
            textoOcultar={f.botones.ocultarClave}
          />

          <div className="ingresar__recordar">
            <Casilla
              id="ingresar-recordar"
              checked={recordar}
              onChange={(evento) => setRecordar(evento.target.checked)}
            >
              {f.etiquetas.mantenerSesion}
            </Casilla>
            <Link className="ingresar__enlace" to="/recuperar-clave">
              {f.enlaces.olvidasteClave}
            </Link>
          </div>

          <Boton
            id={ID_ENVIAR}
            type="submit"
            tamano="g"
            cargando={enviando}
            deshabilitado={espera > 0}
            className="ingresar__enviar"
          >
            {textoBoton}
          </Boton>

          <p className="ingresar__crear">
            <span>{f.mensajes.sinCuenta}</span>
            <Link className="ingresar__enlace" to="/registro">
              {f.enlaces.crearCuenta}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}