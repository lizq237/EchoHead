import { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaEllipsisV, FaHeart, FaRegCheckCircle, FaRegHeart, FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import './TarjetaInteractiva.css';

function TarjetaInteractiva({ item, tipo, id_echohead }) {
    // 🛡️ ESCUDO PROTECTOR: Si por alguna razón 'item' llega vacío, evitamos que React crashee
    const safeItem = item || {};

    const [esFavorito, setEsFavorito] = useState(safeItem.es_favorito === true);
    const [esEscuchado, setEsEscuchado] = useState(safeItem.es_escuchado === true);
    const [menuAbierto, setMenuAbierto]=useState(false);
    const menuRef=useRef(null);
    const [rating, setRating] = useState(safeItem.calificacion || 0); // Lo que está guardado
    const [hoverRating, setHoverRating] = useState(0); // Lo que el usuario previsualiza al pasar el mouse

    useEffect(()=>{
        const manejarClicFuera = (evento) => {
            // Si el menú está abierto Y el clic NO fue dentro de menuRef, lo cerramos
            if (menuRef.current && !menuRef.current.contains(evento.target)) {
                setMenuAbierto(false);
            }
        };

        // Solo prendemos el espía si el menú está abierto (para ahorrar memoria)
        if (menuAbierto) {
            document.addEventListener('mousedown', manejarClicFuera);
        } else {
            document.removeEventListener('mousedown', manejarClicFuera);
        }

        // Limpieza del espía cuando se desmonta el componente
        return () => {
            document.removeEventListener('mousedown', manejarClicFuera);
        };
    }, [menuAbierto]);

    

    useEffect(() => {
        setEsEscuchado(safeItem.es_escuchado === true);
        setEsFavorito(safeItem.es_favorito === true);
    }, [safeItem.es_escuchado, safeItem.es_favorito]);

    // 🛡️ Mapeo a prueba de balas para los nombres e imágenes
    const nombreFinal = safeItem.nombre || safeItem.albumName || safeItem.album_name || safeItem.song_name || safeItem.cancionName || "Sin Nombre";
    const artistaFinal = safeItem.artista || safeItem.artistName || safeItem.artista_name || "Artista Desconocido";
    const imagenFinal = safeItem.imagen_url || safeItem.albumImg || safeItem.album_img || safeItem.song_img || safeItem.cancionImg || "https://placehold.co/300x300?text=Sin+Foto";

    const idSpotify = safeItem.album_spotify_id || safeItem.song_spotify_id || safeItem.spotify_id || safeItem.id || "ID_FALTANTE";

    const guardarEnBaseDeDatos = async (nuevoEscuchado, nuevoFavorito, nuevaCalificacion = rating) => {
        if (!id_echohead || idSpotify === "ID_FALTANTE") return;

        const datosInteraccion = {
            id_echohead: id_echohead,
            spotify_id: idSpotify,
            tipo: tipo,
            nombre: nombreFinal,
            artista: artistaFinal,
            imagen_url: imagenFinal,
            es_escuchado: nuevoEscuchado,
            es_favorito: nuevoFavorito,
            es_pendiente: false,
            calificacion: nuevaCalificacion,
            descripcion: null
        };

        try {
            const respuesta = await fetch('http://localhost:8888/usuarios/interacciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosInteraccion)
            });
            
            if (respuesta.ok) {
                console.log(`¡Guardado! ${nombreFinal} -> Escuchado: ${nuevoEscuchado} | Fav: ${nuevoFavorito}`);
            }
        } catch (error) {
            console.error("Error al guardar en BD:", error);
        }
    };

    const toggleFavorito = (e) => {
        e.stopPropagation(); 
        const nuevoFavorito = !esFavorito;
        setEsFavorito(nuevoFavorito);
        guardarEnBaseDeDatos(esEscuchado, nuevoFavorito);
    };

    const toggleEscuchado = (e) => {
        e.stopPropagation(); 
        const nuevoEscuchado = !esEscuchado;
        setEsEscuchado(nuevoEscuchado);
        guardarEnBaseDeDatos(nuevoEscuchado, esFavorito);
    };

    const claseForma = tipo === 'song' ? 'forma-circulo' : 'forma-cuadrado';

    const handleEstrellaHover = (e, indiceEstrella) => {
        // Leemos las dimensiones de la estrella exacta que estamos tocando
        const { left, width } = e.currentTarget.getBoundingClientRect();
        // Calculamos la posición del ratón dentro de esa estrella
        const posX = e.clientX - left; 
        
        // Si el ratón está en la mitad izquierda, quitamos 0.5 al valor
        const valorVisual = posX < width / 2 ? indiceEstrella - 0.5 : indiceEstrella;
        setHoverRating(valorVisual);
    };

    const guardarCalificacion = (e) => {
        e.stopPropagation();
        setRating(hoverRating);
        guardarEnBaseDeDatos(esEscuchado, esFavorito, hoverRating);
    };


    return (
        <div className={`tarjeta-contenedor ${claseForma} ${menuAbierto ? 'menu-abierto' : ''}`}>
            <img src={imagenFinal} alt={nombreFinal} className="tarjeta-imagen" />
            
            <div className="tarjeta-overlay-botones">
                <button className="btn-interaccion" onClick={toggleEscuchado}>
                    {esEscuchado ? <FaCheckCircle color="#1DB954" /> : <FaRegCheckCircle color="#FFFFFF" />}
                </button>

                <button className="btn-interaccion" onClick={toggleFavorito}>
                    {esFavorito ? <FaHeart color="#1DB954" /> : <FaRegHeart color="#FFFFFF" />}
                </button>

                {/* 👇 AQUÍ REEMPLAZAMOS TU BOTÓN DE 3 PUNTOS POR EL CONTENEDOR DEL MENÚ */}
                <div className="contenedor-opciones-extra" ref={menuRef}>
                    <button 
                        className="btn-interaccion" 
                        onClick={(e) => {
                            e.preventDefault(); 
                            e.stopPropagation(); 
                            setMenuAbierto(!menuAbierto);
                        }}
                    >
                        <FaEllipsisV color="#FFFFFF" />
                    </button>

                    {/* El cuadrito flotante que se muestra si menuAbierto es true */}
                    {menuAbierto && (
                        <div className="cuadro-flotante-opciones">
                            <div className="seccion-calificacion">
                                <div 
                                    className="estrellas-contenedor" 
                                    onMouseLeave={() => setHoverRating(0)} // Al salir del área, borra el hover
                                >
                                    {[1, 2, 3, 4, 5].map((indice) => {
                                        const valorActual = hoverRating || rating;
                                        let IconoEstrella = FaRegStar; // Estrella vacía por defecto

                                        if (valorActual >= indice) {
                                            IconoEstrella = FaStar; // Estrella llena
                                        } else if (valorActual >= indice - 0.5) {
                                            IconoEstrella = FaStarHalfAlt; // Media estrella
                                        }

                                        return (
                                            <div
                                                key={indice}
                                                className="estrella-click"
                                                onMouseMove={(e) => handleEstrellaHover(e, indice)}
                                                onClick={guardarCalificacion}
                                            >
                                                <IconoEstrella className="icono-estrella-calif" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>


                            <button className="opcion-menu" onClick={(e) => {
                                e.preventDefault(); 
                                e.stopPropagation();
                                console.log("reseñar!"); // Aquí pondrás tu lógica real después
                                setMenuAbierto(false);
                            }}>
                                Reseñar
                            </button>
                            
                            <button className="opcion-menu" onClick={(e) => {
                                e.preventDefault(); 
                                e.stopPropagation();
                                console.log("añadido a pendientes"); // Aquí pondrás tu lógica real después
                                setMenuAbierto(false);
                            }}>
                                Añadir a pendientes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TarjetaInteractiva;