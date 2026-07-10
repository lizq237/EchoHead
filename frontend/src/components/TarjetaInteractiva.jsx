import { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaEllipsisV, FaHeart, FaRegCheckCircle, FaRegHeart, FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import './TarjetaInteractiva.css';

function TarjetaInteractiva({ item, tipo, id_echohead }) {
    const safeItem = item || {};

    const [esFavorito, setEsFavorito] = useState(safeItem.es_favorito === true);
    const [esEscuchado, setEsEscuchado] = useState(safeItem.es_escuchado === true);
    const [esPendiente, setEsPendiente]= useState(safeItem.es_pendiente===true);
    
    // ESTADOS DE LAS ESTRELLAS
    const [rating, setRating] = useState(safeItem.calificacion || 0); 
    const [hoverRating, setHoverRating] = useState(0);

    // ESTADO DEL MENÚ DE 3 PUNTOS
    const [menuAbierto, setMenuAbierto] = useState(false); 
    const menuRef = useRef(null);

    // 👇 NUEVOS ESTADOS PARA LA RESEÑA
    const [modalResenaAbierto, setModalResenaAbierto] = useState(false);
    const [textoResena, setTextoResena] = useState(safeItem.descripcion || "");


    // ESPÍA QUE CIERRA EL MENÚ DE 3 PUNTOS
    useEffect(() => {
        const manejarClicFuera = (evento) => {
            if (menuRef.current && !menuRef.current.contains(evento.target)) {
                setMenuAbierto(false);
            }
        };

        if (menuAbierto) {
            document.addEventListener('mousedown', manejarClicFuera);
        } else {
            document.removeEventListener('mousedown', manejarClicFuera);
        }

        return () => {
            document.removeEventListener('mousedown', manejarClicFuera);
        };
    }, [menuAbierto]);

    // ACTUALIZACIÓN DE DATOS DEL BACKEND
    useEffect(() => {
        setEsEscuchado(safeItem.es_escuchado === true);
        setEsFavorito(safeItem.es_favorito === true);
        setRating(safeItem.calificacion || 0);
        setEsPendiente(safeItem.es_pendiente === true);
        setTextoResena(safeItem.descripcion || ""); // Actualizamos la reseña si ya existía
    }, [safeItem.es_escuchado, safeItem.es_favorito, safeItem.calificacion, safeItem.descripcion, safeItem.es_pendiente]);

    const nombreFinal = safeItem.nombre || safeItem.albumName || safeItem.album_name || safeItem.song_name || safeItem.cancionName || "Sin Nombre";
    const artistaFinal = safeItem.artista || safeItem.artistName || safeItem.artista_name || "Artista Desconocido";
    const imagenFinal = safeItem.imagen_url || safeItem.albumImg || safeItem.album_img || safeItem.song_img || safeItem.cancionImg || "https://placehold.co/300x300?text=Sin+Foto";

    const idSpotify = safeItem.album_spotify_id || safeItem.song_spotify_id || safeItem.spotify_id || safeItem.id || "ID_FALTANTE";

    // 👇 LA FUNCIÓN AHORA ACEPTA LA DESCRIPCIÓN (nuevaDescripcion)
    const guardarEnBaseDeDatos = async (nuevoEscuchado, nuevoFavorito, nuevaCalificacion = rating, nuevaDescripcion = textoResena, nuevoPendiente=esPendiente) => {
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
            es_pendiente: nuevoPendiente,
            calificacion: nuevaCalificacion, 
            descripcion: nuevaDescripcion // 👈 Mandamos el texto al backend
            
        };
        console.log("🚀 1. REACT ESTÁ ENVIANDO:", nuevoPendiente);

        try {
            const respuesta = await fetch('http://localhost:8888/usuarios/interacciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosInteraccion)
            });
            
            if (respuesta.ok) {
                console.log(`¡Guardado! ${nombreFinal} -> Escuchado: ${nuevoEscuchado} | Fav: ${nuevoFavorito} | Estrellas: ${nuevaCalificacion}`);
            }
        } catch (error) {
            console.error("Error al guardar en BD:", error);
        }
    };

    const toggleFavorito = (e) => {
        e.stopPropagation(); 
        const nuevoFavorito = !esFavorito;
        setEsFavorito(nuevoFavorito);
        let nuevoEscuchado = esEscuchado;
        let nuevoPendiente = esPendiente;
        //Si es favorito, va escuchado por defecto y ya no está pendiente
        if (nuevoFavorito === true) {
            nuevoEscuchado = true;
            nuevoPendiente = false;
            setEsEscuchado(true);
            setEsPendiente(false);
        }
        guardarEnBaseDeDatos(nuevoEscuchado, nuevoFavorito, rating, textoResena, nuevoPendiente);
    };

    const toggleEscuchado = (e) => {
        e.stopPropagation(); 
        const nuevoEscuchado = !esEscuchado;
        setEsEscuchado(nuevoEscuchado);
        
        let nuevoFavorito = esFavorito;
        let nuevoPendiente = esPendiente;
        let nuevaCalificacion = rating;

        // REGLA 1: Si lo marca como escuchado, apagamos el pendiente
        if (nuevoEscuchado === true) {
            nuevoPendiente = false;
            setEsPendiente(false);
        }

        // REGLA 2: Si lo desmarca (ya no está escuchado), quitamos fav y estrellas
        if (nuevoEscuchado === false) {
            nuevoFavorito = false;
            nuevaCalificacion = 0;
            setEsFavorito(false);
            setRating(0);
        }
        
        guardarEnBaseDeDatos(nuevoEscuchado, nuevoFavorito, nuevaCalificacion, textoResena, nuevoPendiente);
    };

    const calcularValorEstrella = (e, indiceEstrella) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const posX = e.clientX - left; 
        return posX < width / 2 ? indiceEstrella - 0.5 : indiceEstrella;
    };

    const handleEstrellaHover = (e, indiceEstrella) => {
        setHoverRating(calcularValorEstrella(e, indiceEstrella));
    };

    const guardarCalificacion = (e, indiceEstrella) => {
        e.stopPropagation();
        const valorFinal = calcularValorEstrella(e, indiceEstrella);
        setRating(valorFinal);
        setHoverRating(valorFinal); 
        let nuevoEscuchado = esEscuchado;
        let nuevoPendiente = esPendiente;

        // REGLA: Si pones estrellas, significa que ya lo escuchaste y no está pendiente
        if (valorFinal > 0) {
            nuevoEscuchado = true;
            nuevoPendiente = false;
            setEsEscuchado(true);
            setEsPendiente(false);
        }
        guardarEnBaseDeDatos(nuevoEscuchado, esFavorito, valorFinal, textoResena, nuevoPendiente);
    };

    const claseForma = tipo === 'song' ? 'forma-circulo' : 'forma-cuadrado';

    return (
        /* 👇 ENVOLVEMOS TODO EN UN FRAGMENTO <> </> */
        <>
            <div className={`tarjeta-contenedor ${claseForma} ${menuAbierto ? 'menu-abierto' : ''}`}>
                <img src={imagenFinal} alt={nombreFinal} className="tarjeta-imagen" />
                
                <div className="tarjeta-overlay-botones">
                    <button className="btn-interaccion" onClick={toggleEscuchado}>
                        {esEscuchado ? <FaCheckCircle color="#1DB954" /> : <FaRegCheckCircle color="#FFFFFF" />}
                    </button>

                    <button className="btn-interaccion" onClick={toggleFavorito}>
                        {esFavorito ? <FaHeart color="#1DB954" /> : <FaRegHeart color="#FFFFFF" />}
                    </button>

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

                        {menuAbierto && (
                            <div className="cuadro-flotante-opciones">
                                <div className="seccion-calificacion">
                                    <p className="titulo-estrellas">Calificar:</p>
                                    <div 
                                        className="estrellas-contenedor" 
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        {[1, 2, 3, 4, 5].map((indice) => {
                                            const valorActual = hoverRating || rating;
                                            let IconoEstrella = FaRegStar; 

                                            if (valorActual >= indice) {
                                                IconoEstrella = FaStar; 
                                            } else if (valorActual >= indice - 0.5) {
                                                IconoEstrella = FaStarHalfAlt; 
                                            }

                                            return (
                                                <div
                                                    key={indice}
                                                    className="estrella-click"
                                                    onMouseMove={(e) => handleEstrellaHover(e, indice)}
                                                    onClick={(e) => guardarCalificacion(e, indice)}
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
                                    setTextoResena(item.descripcion || ""); 
                                    console.log("👀 Texto que llegó a la tarjeta:", item.descripcion);
                                    setModalResenaAbierto(true); // Abre el modal de reseña
                                    setMenuAbierto(false);       // Cierra el menú chiquito
                                }}>
                                    Reseñar
                                </button>
                                
                                <button className="opcion-menu" onClick={(e) => {
                                    e.preventDefault(); 
                                    e.stopPropagation();
                                    
                                    const nuevoEstadoPendiente = !esPendiente;
                                    setEsPendiente(nuevoEstadoPendiente);
                                    
                                    let nuevoEscuchado = esEscuchado;
                                    let nuevoFavorito = esFavorito;
                                    let nuevaCalificacion = rating;

                                    // REGLA: Si pasa a pendiente, no puede estar escuchado, ni favorito, ni tener estrellas
                                    if (nuevoEstadoPendiente === true) {
                                        nuevoEscuchado = false;
                                        nuevoFavorito = false;
                                        nuevaCalificacion = 0;
                                        setEsEscuchado(false);
                                        setEsFavorito(false);
                                        setRating(0);
                                    }

                                    guardarEnBaseDeDatos(nuevoEscuchado, nuevoFavorito, nuevaCalificacion, textoResena, nuevoEstadoPendiente);
                                    setMenuAbierto(false);
                                }}>
                                    {esPendiente ? "Quitar de pendientes" : "Añadir a pendientes"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 👇 AQUÍ VA LA VENTANA MODAL DE LA RESEÑA (AFUERA DE LA TARJETA) */}
            {modalResenaAbierto && (
                <div className="overlay-modal-resena" onClick={(e) => {
                    e.stopPropagation();
                    setModalResenaAbierto(false); // Cierra si haces clic en el fondo oscuro
                }}>
                    <div className="modal-resena-contenido" onClick={(e) => e.stopPropagation()}>
                        
                        <h3>Reseña de: <span>{nombreFinal}</span></h3>
                        
                        <textarea 
                            className="textarea-resena"
                            placeholder="Escribe aquí tus pensamientos..."
                            value={textoResena}
                            onChange={(e) => setTextoResena(e.target.value)}
                        />
                        
                        <div className="modal-botones-resena">
                            <button className="btn-resena cancelar" onClick={(e) => {
                                e.stopPropagation();
                                
                                let nuevoEscuchado = esEscuchado;
                                let nuevoPendiente = esPendiente;

                                // REGLA: Si escribe una reseña, ya lo escuchó y no está pendiente
                                if (textoResena.trim() !== "") {
                                    nuevoEscuchado = true;
                                    nuevoPendiente = false;
                                    setEsEscuchado(true);
                                    setEsPendiente(false);
                                }

                                guardarEnBaseDeDatos(nuevoEscuchado, esFavorito, rating, textoResena, nuevoPendiente);
                                setModalResenaAbierto(false);
                            }}>
                                Guardar Reseña
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TarjetaInteractiva;