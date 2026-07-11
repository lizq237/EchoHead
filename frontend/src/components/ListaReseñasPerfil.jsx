import { useEffect, useState } from 'react';
import { IoHeart } from "react-icons/io5";
import './ListaReseñasPerfil.css'; // 👇 OJO: Usaremos un CSS nuevo para este diseño

function ListaReseñasPerfil({ id_echohead }) {
    const [resenas, setResenas] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 10; // 👈 Reducimos a 10 por página porque el texto ocupa más espacio

    const [filtroActivo, setFiltroActivo] = useState('todos');

    useEffect(() => {
        if (!id_echohead) return;
        fetch(`http://localhost:8888/api/interacciones/${id_echohead}`)
            .then(res => res.json())
            .then(data => {
                // 👇 FILTRO ESTRICTO: Solo pasan los que tengan texto en la descripción
                const misResenas = data.filter(item => item.descripcion && item.descripcion.trim() !== '');
                setResenas(misResenas);
                setCargando(false);
            })
            .catch(error => {
                console.error("Error al traer las reseñas:", error);
                setCargando(false);
            });
    }, [id_echohead]);

    const resenasFiltradas = resenas.filter(item => {
        if (filtroActivo === 'todos') return true;
        return item.tipo === filtroActivo;
    });

    const totalPaginas = Math.ceil(resenasFiltradas.length / itemsPorPagina);
    const indiceUltimoItem = paginaActual * itemsPorPagina;
    const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
    const resenasActuales = resenasFiltradas.slice(indicePrimerItem, indiceUltimoItem);

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
    const [expandidas, setExpandidas] = useState({});

    // 👇 NUEVO: Función para abrir/cerrar una reseña específica
    const toggleExpandir = (id) => {
        setExpandidas(prev => ({
            ...prev,
            [id]: !prev[id] // Cambia de true a false y viceversa
        }));
    };


    return (
        <div className="perfil-biblioteca-contenedor">
            
            {/* EL SWITCH RECICLADO */}
            <div className="switch-favoritos">
                <button className={filtroActivo === 'todos' ? 'activo' : ''} onClick={() => cambiarFiltro('todos')}>Todos</button>
                <button className={filtroActivo === 'album' ? 'activo' : ''} onClick={() => cambiarFiltro('album')}>Álbumes</button>
                <button className={filtroActivo === 'song' ? 'activo' : ''} onClick={() => cambiarFiltro('song')}>Canciones</button>
            </div>

              
                <div className="lista-resenas-layout">
                    {resenasActuales.map((item, index) => (
                        
                        /* 👇 EL NUEVO DISEÑO EN FILA ESTILO LETTERBOXD */
                        <div className="resena-fila" key={`perfil-resena-${item.spotify_id}-${index}`}>
                            
                            {/* Lado Izquierdo: Portada Pequeña */}
                            <div className={`resena-portada ${item.tipo === 'song' ? 'portada-cancion' : 'portada-album'}`}>
                                <img src={item.imagen_url} alt={item.nombre} />
                            </div>

                            {/* Lado Derecho: Contenido */}
                            <div className="resena-contenido">
                                
                                {/* Título */}
                                <h3 className="resena-titulo">
                                    {item.nombre}
                                    {/* Si tienes el año en tu BD, podrías ponerlo aquí así: <span className="resena-year">2023</span> */}
                                </h3>

                                {/* Metadatos (Estrellas y corazón) */}
                                <div className="resena-metadatos">
                                    <span className="estrellas-perfil">{renderizarEstrellas(item.calificacion)}</span>
                                    {item.es_favorito && <IoHeart className="corazon-perfil" />}
                                </div>

                                {/* Texto de la reseña */}
                                <div 
                                    className="contenedor-texto-resena" 
                                    onClick={() => toggleExpandir(item.spotify_id)}
                                >
                                    <p className={`resena-texto ${expandidas[item.spotify_id] ? 'expandido' : ''}`}>
                                        {item.descripcion}
                                    </p>
                                    
                                    {/* Botón sutil de Leer más/Mostrar menos */}
                                    {item.descripcion.length > 200 && (
                                        <span className="boton-leer-mas">
                                            {expandidas[item.spotify_id] ? 'Mostrar menos' : 'Leer más...'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            

            {/* CONTROLES DE PAGINACIÓN */}
            {totalPaginas > 1 && (
                <div className="paginacion-contenedor">
                    <button onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))} disabled={paginaActual === 1}>Anterior</button>
                    {[...Array(totalPaginas)].map((_, i) => (
                        <button key={i} onClick={() => setPaginaActual(i + 1)} className={paginaActual === i + 1 ? 'pagina-activa' : ''}>{i + 1}</button>
                    ))}
                    <button onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))} disabled={paginaActual === totalPaginas}>Siguiente</button>
                </div>
            )}
        </div>
    );
}

export default ListaReseñasPerfil;