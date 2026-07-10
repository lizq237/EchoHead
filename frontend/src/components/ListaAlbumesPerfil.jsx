import { useEffect, useState } from 'react';
import { IoHeart } from "react-icons/io5";
import './ListaAlbumesPerfil.css';
import TarjetaInteractiva from './TarjetaInteractiva';

function ListaAlbumesPerfil({ id_echohead }) {
    const [albumes, setAlbumes] = useState([]);
    const [cargando, setCargando] = useState(true);

    // --- ESTADOS PARA LA PAGINACIÓN ---
    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 70; // 10 columnas x 7 filas

    useEffect(() => {
        if (!id_echohead) return;
        fetch(`http://localhost:8888/api/interacciones/${id_echohead}`)
            .then(res => res.json())
            .then(data => {
                const misAlbumes = data.filter(item =>
                    item.tipo === 'album' && 
                    (item.es_escuchado === true || item.es_favorito === true)
                    );
                setAlbumes(misAlbumes);
                setCargando(false);
            })
            .catch(error => {
                console.error("Error al traer los álbumes:", error);
                setCargando(false);
            });
    }, [id_echohead]);

    // --- LÓGICA DE PAGINACIÓN ---
    // Calculamos qué pedazo de la lista vamos a mostrar
    const indiceUltimoItem = paginaActual * itemsPorPagina;
    const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
    const albumesActuales = albumes.slice(indicePrimerItem, indiceUltimoItem); // Cortamos el array

    const totalPaginas = Math.ceil(albumes.length / itemsPorPagina);

    // Función para dibujar las estrellas
    const renderizarEstrellas = (calificacion) => {
        if (!calificacion || calificacion === 0) return null;
        
        // 1. Sacamos las estrellas enteras (Si es 4.5, sacará 4)
        const enteras = Math.floor(calificacion); 
        
        // 2. Verificamos si tiene fracción (Si 4.5 % 1 no es 0, es que hay decimales)
        const tieneMedia = calificacion % 1 !== 0; 
        
        // 3. Dibujamos las enteras
        let estrellas = '★'.repeat(enteras);
        
        // 4. Si tiene media, le pegamos el " 1/2" (o puedes usar el símbolo "½" que se ve súper limpio)
        if (tieneMedia) {
            estrellas += ' ½'; 
        }
        
        return estrellas;
    };


    if (cargando) return <p className="mensaje-estado-perfil">Cargando tu biblioteca de álbumes...</p>;
    if (albumes.length === 0) return <p className="mensaje-estado-perfil">Aún no tienes álbumes en tu biblioteca.</p>;

    return (
        <div className="perfil-biblioteca-contenedor">
            
            {/* GRID DE ÁLBUMES (Solo mostramos los de la página actual) */}
            <div className="lista-albumes-grid">
                {albumesActuales.map((album, index) => {
                    const albumFormateado = {
                        id: album.spotify_id,
                        albumName: album.nombre,
                        albumImg: album.imagen_url,
                        es_escuchado: album.es_escuchado,
                        es_favorito: album.es_favorito,
                        es_pendiente: album.es_pendiente,
                        calificacion: album.calificacion,
                        descripcion: album.descripcion
                    };

                    return (
                        <div className="cuadro-album-pequeno" key={`perfil-album-${album.spotify_id}-${index}`} title={album.nombre}>
                            
                            {/* La tarjeta con la portada */}
                            <TarjetaInteractiva item={albumFormateado} tipo="album" id_echohead={id_echohead} />
                            
                            {/* Metadatos estilo Figma (Sin nombre) */}
                            <div className="info-album-abajo">
                                <div className="metadatos-letterboxd">
                                    <span className="estrellas-perfil">
                                        {renderizarEstrellas(album.calificacion)}
                                    </span>
                                    {/* Usamos un corazón negro en lugar del verde */}
                                    {album.es_favorito && <IoHeart className="corazon-perfil" />}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CONTROLES DE PAGINACIÓN */}
            {totalPaginas > 1 && (
                <div className="paginacion-contenedor">
                    <button 
                        onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                        disabled={paginaActual === 1}
                    >
                        Anterior
                    </button>

                    {/* Generamos los botones con los números (1, 2, 3...) */}
                    {[...Array(totalPaginas)].map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setPaginaActual(i + 1)}
                            className={paginaActual === i + 1 ? 'pagina-activa' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button 
                        onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                        disabled={paginaActual === totalPaginas}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}

export default ListaAlbumesPerfil;

