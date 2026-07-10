import { useEffect, useState } from 'react';
import './ListaAlbumesPerfil.css'; // Reciclamos el diseño del grid
import TarjetaInteractiva from './TarjetaInteractiva';

function ListaPendientesPerfil({ id_echohead }) {
    const [pendientes, setPendientes] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 70; // 10 columnas x 7 filas

    // Estado para el switch ('todos', 'album', o 'song')
    const [filtroActivo, setFiltroActivo] = useState('todos');

    useEffect(() => {
        if (!id_echohead) return;
        fetch(`http://localhost:8888/api/interacciones/${id_echohead}`)
            .then(res => res.json())
            .then(data => {
                // 👇 CAMBIAMOS LA CONDICIÓN: Ahora filtramos por es_pendiente
                const misPendientes = data.filter(item => item.es_pendiente === true);
                setPendientes(misPendientes);
                setCargando(false);
            })
            .catch(error => {
                console.error("Error al traer los pendientes:", error);
                setCargando(false);
            });
    }, [id_echohead]);

    // Aplicamos el filtro del Switch antes de paginar
    const pendientesFiltrados = pendientes.filter(item => {
        if (filtroActivo === 'todos') return true;
        return item.tipo === filtroActivo;
    });

    // La paginación usa la lista filtrada de pendientes
    const totalPaginas = Math.ceil(pendientesFiltrados.length / itemsPorPagina);
    const indiceUltimoItem = paginaActual * itemsPorPagina;
    const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
    const pendientesActuales = pendientesFiltrados.slice(indicePrimerItem, indiceUltimoItem);

    const cambiarFiltro = (nuevoFiltro) => {
        setFiltroActivo(nuevoFiltro);
        setPaginaActual(1); 
    };

    if (cargando) return <p className="mensaje-estado-perfil">Cargando tu lista de pendientes...</p>;

    return (
        <div className="perfil-biblioteca-contenedor">
            
            {/* EL SWITCH (Sub-menú) */}
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

            {pendientesFiltrados.length === 0 ? (
                <p className="mensaje-estado-perfil">
                    No tienes {filtroActivo === 'album' ? 'álbumes pendientes' : filtroActivo === 'song' ? 'canciones pendientes' : 'elementos pendientes'} por escuchar.
                </p>
            ) : (
                <div className="lista-albumes-grid">
                    {pendientesActuales.map((item, index) => {
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
                                key={`perfil-pendiente-${item.spotify_id}-${index}`}
                                title={item.nombre}
                                style={{ marginBottom: '10px' }} // Un pequeño ajuste de margen inferior ya que no lleva texto abajo
                            >
                                <TarjetaInteractiva item={itemFormateado} tipo={item.tipo} id_echohead={id_echohead} />
                                
                                {/* 💡 Aquí no renderizamos metadatos (estrellas/corazones) por estética de Watchlist */}
                            </div>
                        );
                    })}
                </div>
            )}

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

export default ListaPendientesPerfil;