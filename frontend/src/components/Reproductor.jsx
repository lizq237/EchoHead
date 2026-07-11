import { useEffect, useState } from 'react';
// IMPORTAMOS EL VINILO PARA EL BOTÓN
import { IoChevronDownSharp, IoMusicalNoteSharp, IoPauseSharp, IoPlaySharp, IoPlaySkipBackSharp, IoPlaySkipForwardSharp } from "react-icons/io5";
import './Reproductor.css';
// IMPORTAMOS TU NUEVO COMPONENTE ESTÉTICO
import ReproductorEstetico from './ReproductorEstetico';

const Reproductor = ({ tokenSpotify, username }) => {
    const [cancionActual, setCancionActual] = useState(null);
    const [estaReproduciendo, setEstaReproduciendo] = useState(false);
    const [progreso, setProgreso] = useState(0); 
    const [duracion, setDuracion] = useState(0);
    const [barraVisible, setBarraVisible] = useState(true);
    
    // 👇 NUEVO ESTADO: Controla si se ve el tocadiscos 3D
    const [mostrarEstetico, setMostrarEstetico] = useState(false);
    useEffect(() => {
        const abrirDesdeNavbar = () => setMostrarEstetico(true);
        window.addEventListener('abrir-tocadiscos', abrirDesdeNavbar);
        
        return () => {
            window.removeEventListener('abrir-tocadiscos', abrirDesdeNavbar);
        };
    }, []);

    const URL_BASE_SPOTIFY = "https://api.spotify.com/v1"; 

    const formatearTiempo = (ms) => {
        if (!ms) return "0:00";
        const segundosTotales = Math.floor(ms / 1000);
        const minutos = Math.floor(segundosTotales / 60);
        const segundos = segundosTotales % 60;
        return `${minutos}:${segundos.toString().padStart(2, '0')}`;
    };

    const obtenerEstadoReproduccion = () => {
        if (!tokenSpotify) return;

        fetch(`${URL_BASE_SPOTIFY}/me/player/currently-playing`, {
            headers: { 'Authorization': `Bearer ${tokenSpotify}` }
        })
        .then(res => {
            if (res.status === 204) {
                setCancionActual(null);
                setEstaReproduciendo(false);
                setProgreso(0);
                setDuracion(0);
                return null;
            }
            return res.json();
        })
        .then(data => {
            if (data && data.item) {
                setCancionActual({
                    id: data.item.id,
                    nombre: data.item.name,
                    artista: data.item.artists.map(art => art.name).join(', '),
                    imagen: data.item.album.images[0]?.url
                });
                setEstaReproduciendo(data.is_playing);
                setProgreso(data.progress_ms);
                setDuracion(data.item.duration_ms);
            }
        })
        .catch(err => console.error("Error al obtener canción actual:", err));
    };

    useEffect(() => {
        obtenerEstadoReproduccion();
        const intervalo = setInterval(obtenerEstadoReproduccion, 5000);
        return () => clearInterval(intervalo);
    }, [tokenSpotify]);

    useEffect(() => {
        let intervaloProgreso;
        if (estaReproduciendo && duracion > 0) {
            intervaloProgreso = setInterval(() => {
                setProgreso(prev => {
                    const nuevoProgreso = prev + 1000;
                    return nuevoProgreso > duracion ? duracion : nuevoProgreso;
                });
            }, 1000);
        }
        return () => clearInterval(intervaloProgreso);
    }, [estaReproduciendo, duracion]);

    const alternarReproduccion = () => {
        if (!tokenSpotify) return;
        const metodo = 'PUT';
        const endpoint = estaReproduciendo ? 'pause' : 'play';

        fetch(`${URL_BASE_SPOTIFY}/me/player/${endpoint}`, {
            method: metodo,
            headers: { 'Authorization': `Bearer ${tokenSpotify}` }
        })
        .then(res => {
            if (res.ok) {
                setEstaReproduciendo(!estaReproduciendo);
                setTimeout(obtenerEstadoReproduccion, 500);
            }
        });
    };

    const cambiarCancion = (direccion) => {
        if (!tokenSpotify) return;
        const endpoint = direccion === 'siguiente' ? 'next' : 'previous';
        fetch(`${URL_BASE_SPOTIFY}/me/player/${endpoint}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${tokenSpotify}` }
        })
        .then(res => {
            if (res.ok) setTimeout(obtenerEstadoReproduccion, 500); 
        });
    };

    const porcentajeProgreso = duracion > 0 ? (progreso / duracion) * 100 : 0;

    return (
        <>
            <button 
                className={`btn-restaurar ${!barraVisible ? 'visible' : ''}`} 
                onClick={() => setBarraVisible(true)}
                title="Mostrar reproductor"
            >
                <IoMusicalNoteSharp />
            </button>

            <div className={`reproductor-barra ${!barraVisible ? 'oculto' : ''}`}>
                
                <div className="reproductor-info">
                    {cancionActual ? (
                        <>
                            <img src={cancionActual.imagen} alt="Portada" className="reproductor-portada" />
                            <div className="reproductor-textos">
                                <span className="reproductor-nombre">{cancionActual.nombre}</span>
                                <span className="reproductor-artista">{cancionActual.artista}</span>
                            </div>
                        </>
                    ) : (
                        <div className="reproductor-textos">
                            <span className="reproductor-nombre" style={{ color: '#888888' }}>Sin reproducción activa</span>
                            <span className="reproductor-artista" style={{ fontSize: '0.75rem' }}>Abre Spotify para escuchar</span>
                        </div>
                    )}
                </div>

                <div className="reproductor-centro">
                    <div className="reproductor-controles">
                        <button onClick={() => cambiarCancion('anterior')} className="btn-control">
                            <IoPlaySkipBackSharp />
                        </button>
                        <button onClick={alternarReproduccion} className="btn-control btn-play">
                            {estaReproduciendo ? <IoPauseSharp /> : <IoPlaySharp style={{ marginLeft: '2px' }} />}
                        </button>
                        <button onClick={() => cambiarCancion('siguiente')} className="btn-control">
                            <IoPlaySkipForwardSharp />
                        </button>
                    </div>
                    
                    <div className="reproductor-progreso">
                        <span className="tiempo">{formatearTiempo(progreso)}</span>
                        <div className="barra-fondo">
                            <div className="barra-relleno" style={{ width: `${porcentajeProgreso}%` }}></div>
                        </div>
                        <span className="tiempo">{formatearTiempo(duracion)}</span>
                    </div>
                </div>
                
                <div className="reproductor-extras">
                    {/* 👇 BOTÓN DEL VINILO: Abre la ventana estética */}
                    

                    <button 
                        onClick={() => setBarraVisible(false)} 
                        className="btn-control btn-ocultar"
                        title="Ocultar reproductor"
                    >
                        <IoChevronDownSharp />
                    </button>
                </div>
            </div>

            {/* 👇 INYECTAMOS LA VENTANA ESTÉTICA Y LE PASAMOS TODOS TUS DATOS 👇 */}
            {mostrarEstetico && (
                <ReproductorEstetico 
                    cerrarModal={() => setMostrarEstetico(false)}
                    username={username}
                    // Usamos el signo de interrogación por si cancionActual es null (cuando no hay música)
                    cancion={cancionActual?.nombre || "Sin reproducir"}
                    artista={cancionActual?.artista || "Desconocido"}
                    imagenAlbum={cancionActual?.imagen || ""}
                    estaReproduciendo={estaReproduciendo}
                    pausarReproducir={alternarReproduccion}
                    siguienteCancion={() => cambiarCancion('siguiente')}
                    cancionAnterior={() => cambiarCancion('anterior')}
                />
            )}
        </>
    );
};

export default Reproductor;