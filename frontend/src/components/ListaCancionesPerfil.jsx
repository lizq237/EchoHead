import { useEffect, useState } from 'react';
import { IoHeart } from "react-icons/io5";
import './ListaAlbumesPerfil.css'; // 👈 ¡Reciclamos el CSS exacto de los álbumes!
import TarjetaInteractiva from './TarjetaInteractiva';

function ListaCancionesPerfil({ id_echohead }) {
    const [canciones, setCanciones] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 70; // 10 columnas x 7 filas

    useEffect(() => {
        if (!id_echohead) return;
        fetch(`http://localhost:8888/api/interacciones/${id_echohead}`)
            .then(res => res.json())
            .then(data => {
                // 👇 FILTRAMOS POR CANCIÓN
                // (Ojo: Asegúrate de que en tu BD se guarde como 'cancion', 'canción' o 'track')
                const misCanciones = data.filter(item => 
                    item.tipo === 'song' && 
                    (item.es_escuchado === true || item.es_favorito === true)
                );
                setCanciones(misCanciones);
                setCargando(false);
            })
            .catch(error => {
                console.error("Error al traer las canciones:", error);
                setCargando(false);
            });
    }, [id_echohead]);

    const indiceUltimoItem = paginaActual * itemsPorPagina;
    const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
    const cancionesActuales = canciones.slice(indicePrimerItem, indiceUltimoItem);

    const totalPaginas = Math.ceil(canciones.length / itemsPorPagina);

    const renderizarEstrellas = (calificacion) => {
        if (!calificacion || calificacion === 0) return null;
        const enteras = Math.floor(calificacion); 
        const tieneMedia = calificacion % 1 !== 0; 
        let estrellas = '★'.repeat(enteras);
        if (tieneMedia) estrellas += ' ½'; 
        return estrellas;
    };

    if (cargando) return <p className="mensaje-estado-perfil">Cargando tu biblioteca de canciones...</p>;
    if (canciones.length === 0) return <p className="mensaje-estado-perfil">Aún no tienes canciones en tu biblioteca.</p>;

    return (
        <div className="perfil-biblioteca-contenedor">
            <div className="lista-albumes-grid">
                {cancionesActuales.map((cancion, index) => {
                    
                    // 👇 AJUSTADO PARA CANCIONES
                    const cancionFormateada = {
                        id: cancion.spotify_id,
                        cancionName: cancion.nombre,
                        cancionImg: cancion.imagen_url,
                        es_escuchado: cancion.es_escuchado,
                        es_favorito: cancion.es_favorito,
                        es_pendiente: cancion.es_pendiente,
                        calificacion: cancion.calificacion,
                        descripcion: cancion.descripcion
                    };

                    return (
                        // Reciclamos la clase "cuadro-album-pequeno" porque el CSS es el mismo
                        <div 
                            className="cuadro-album-pequeno" 
                            key={`perfil-cancion-${cancion.spotify_id}-${index}`}
                            title={cancion.nombre}
                        >
                            {/* Le decimos que el tipo es "song" */}
                            <TarjetaInteractiva item={cancionFormateada} tipo="song" id_echohead={id_echohead} />
                            
                            <div className="info-album-abajo">
                                <div className="metadatos-letterboxd">
                                    <span className="estrellas-perfil">
                                        {renderizarEstrellas(cancion.calificacion)}
                                    </span>
                                    {cancion.es_favorito && <IoHeart className="corazon-perfil" />}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CONTROLES DE PAGINACIÓN */}
            {totalPaginas > 1 && (
                <div className="paginacion-contenedor">
                    <button onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))} disabled={paginaActual === 1}>
                        Anterior
                    </button>
                    {[...Array(totalPaginas)].map((_, i) => (
                        <button key={i} onClick={() => setPaginaActual(i + 1)} className={paginaActual === i + 1 ? 'pagina-activa' : ''}>
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))} disabled={paginaActual === totalPaginas}>
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}

export default ListaCancionesPerfil;