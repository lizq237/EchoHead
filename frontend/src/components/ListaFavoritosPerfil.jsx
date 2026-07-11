import { useEffect, useState } from 'react';
import { IoHeart } from "react-icons/io5";
import './ListaAlbumesPerfil.css';
import './ListaFavoritosPerfil.css';
import TarjetaInteractiva from './TarjetaInteractiva';

function ListaFavoritosPerfil({ id_echohead }) {
    const [favoritos, setFavoritos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 70; 

    // 👇 1. NUEVO ESTADO PARA EL SWITCH ('todos', 'album', o 'song')
    const [filtroActivo, setFiltroActivo] = useState('todos');

    useEffect(() => {
        if (!id_echohead) return;
        fetch(`http://localhost:8888/api/interacciones/${id_echohead}`)
            .then(res => res.json())
            .then(data => {
                const misFavoritos = data.filter(item => item.es_favorito === true);
                setFavoritos(misFavoritos);
                setCargando(false);
            })
            .catch(error => {
                console.error("Error al traer las canciones:", error);
                setCargando(false);
            });
    }, [id_echohead]);

    // 👇 2. APLICAMOS EL FILTRO ANTES DE PAGINAR
    const favoritosFiltrados = favoritos.filter(item => {
        if (filtroActivo === 'todos') return true; // Si es 'todos', pasan todos
        return item.tipo === filtroActivo;         // Si no, solo los que coincidan con 'album' o 'song'
    });

    // 👇 3. LA PAGINACIÓN AHORA USA LA LISTA FILTRADA
    const totalPaginas = Math.ceil(favoritosFiltrados.length / itemsPorPagina);
    const indiceUltimoItem = paginaActual * itemsPorPagina;
    const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
    const favoritosActuales = favoritosFiltrados.slice(indicePrimerItem, indiceUltimoItem);

    // 👇 4. FUNCIÓN PARA CAMBIAR DE PESTAÑA (Y regresar a la página 1)
    const cambiarFiltro = (nuevoFiltro) => {
        setFiltroActivo(nuevoFiltro);
        setPaginaActual(1); 
    };

    const renderizarEstrellas = (calificacion) => {
        if (!calificacion || calificacion === 0) return null;
        const enteras = Math.floor(calificacion); 
        const tieneMedia = calificacion % 1 !== 0; 
        let estrellas = '★'.repeat(enteras);
        if (tieneMedia) estrellas += ' ½'; 
        return estrellas;
    };


    return (
        <div className="perfil-biblioteca-contenedor">
            
            {/* 👇 5. EL SWITCH (Sub-menú) */}
            <div className="switch-favoritos">
                <button 
                    className={filtroActivo === 'todos' ? 'activo' : ''} 
                    onClick={() => cambiarFiltro('todos')}
                >
                    Todos
                </button>
                <button 
                    className={filtroActivo === 'album' ? 'activo' : ''} 
                    onClick={() => cambiarFiltro('album')}
                >
                    Álbumes
                </button>
                <button 
                    className={filtroActivo === 'song' ? 'activo' : ''} 
                    onClick={() => cambiarFiltro('song')}
                >
                    Canciones
                </button>
            </div>

            
                <div className="lista-albumes-grid">
                    {favoritosActuales.map((item, index) => {
                        const itemFormateado = {
                            id: item.spotify_id,
                            albumName: item.tipo === 'album' ? item.nombre : undefined,
                            albumImg: item.tipo === 'album' ? item.imagen_url : undefined,
                            cancionName: item.tipo === 'song' ? item.nombre : undefined,
                            cancionImg: item.tipo === 'song' ? item.imagen_url : undefined,
                            es_escuchado: item.es_escuchado,
                            es_favorito: item.es_favorito,
                            es_pendiente: item.es_pendiente,
                            calificacion: item.calificacion,
                            descripcion: item.descripcion
                        };

                        return (
                            <div 
                                className="cuadro-album-pequeno" 
                                key={`perfil-fav-${item.spotify_id}-${index}`}
                                title={item.nombre}
                            >
                                <TarjetaInteractiva item={itemFormateado} tipo={item.tipo} id_echohead={id_echohead} />
                                
                                <div className="info-album-abajo">
                                    <div className="metadatos-letterboxd">
                                        <span className="estrellas-perfil">
                                            {renderizarEstrellas(item.calificacion)}
                                        </span>
                                        <IoHeart className="corazon-perfil" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            

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

export default ListaFavoritosPerfil;