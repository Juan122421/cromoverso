import { useEffect, useState } from "react";
import { useTextos } from "./hooks/useTextos.js";
import Navbar from "./components/Navbar.jsx";

function leerSeccion() {
    return window.location.hash.slice(1) || "inicio";
}

function App() {
    const [idioma, setIdioma] = useState("es");
    const [activo, setActivo] = useState(leerSeccion);
    const [textoGrande, setTextoGrande] = useState(false);
    const datos = useTextos(idioma);

    useEffect(() => {
        const actualizar = () => setActivo(leerSeccion());
        window.addEventListener("hashchange", actualizar);
        return () => window.removeEventListener("hashchange", actualizar);
    }, []);

    useEffect(() => {
        document.documentElement.lang = idioma === "es" ? "es-CO" : "en";
    }, [idioma]);

    useEffect(() => {
        document.documentElement.style.fontSize = textoGrande ? "112%" : "";
        return () => {
            document.documentElement.style.fontSize = "";
        };
    }, [textoGrande]);

    return (
        <Navbar
            {...datos}
            idioma={idioma}
            cambiarIdioma={setIdioma}
            activo={activo}
            textoGrande={textoGrande}
            alternarTexto={() => setTextoGrande((valor) => !valor)}
        />
    );
}

export default App;