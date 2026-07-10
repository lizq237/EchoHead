import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TarjetaInteractiva from '../components/TarjetaInteractiva';
import './Albumes.css';
import './Canciones.css';

function Canciones({ username, fotoPerfil, tokenSpotify, cancionesFavs, id_echohead }) {
    const [busqueda, setBusqueda] = useState("");
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
    const [interacciones, setInteracciones] = useState([]);

    // 1. OBTENER LIKES DE LA BD
    useEffect(() => {
        if (!id_echohead) return;

        fetch(`http://localhost:8888/api/interacciones/${id_echohead}`)
            .then(res => {
                if (!res.ok) throw new Error("Ruta no encontrada");
                return res.json();
            })
            .then(data => {
                console.log("📥 3. POSTGRESQL DEVOLVIÓ ESTO:", data);
                if (data && data.length > 0) setInteracciones(data);
            })
            .catch(error => console.error("Error al traer interacciones:", error));
    }, [id_echohead]);

    // 2. BÚSQUEDA DE SPOTIFY
    useEffect(() => {
        const textoLimpio = busqueda.trim();

        if (textoLimpio === "") {
            setResultadosBusqueda([]);
            return;
        }

        const temporizador = setTimeout(() => {
            fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(textoLimpio)}&type=track&market=MX&limit=10`, {
                headers: { 'Authorization': `Bearer ${tokenSpotify}` }
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) return;

                if (data.tracks && data.tracks.items) {
                    const cancionesEncontradas = data.tracks.items.map(item => ({
                        id: item.id,
                        songName: item.name,
                        songImage: item.album.images[0]?.url || "https://placehold.co/300x300?text=Sin+Portada",
                        songLink: item.external_urls.spotify,
                        artista: item.artists[0]?.name 
                    }));
                    setResultadosBusqueda(cancionesEncontradas);
                } else {
                    setResultadosBusqueda([]);
                }
            })
            .catch(error => console.error("Error en búsqueda de canciones:", error));
            
        }, 500); 

        return () => clearTimeout(temporizador);
    }, [busqueda, tokenSpotify]); 

    const Navegacion = (evento) => {
        setBusqueda(evento.target.value);
    }
            
    const cancionesAMostrar = busqueda === "" ? (cancionesFavs || []) : resultadosBusqueda;
    const tituloSeccion = busqueda === "" ? `${username}, estas son tus ultimas canciones favs en Spotify` : `Resultados para "${busqueda}"`;

    return (
        <div className='pagina-canciones'> 
            <Navbar username={username} fotoPerfil={fotoPerfil} />
            
            <div className='busqueda-cancion'>
                <p className='buscar'>ENCONTRAR CANCIÓN</p>
                <input 
                    type="text" 
                    className='input-cancion' 
                    placeholder="Escribe una cancion..." 
                    value={busqueda}
                    onChange={Navegacion} 
                />
            </div>

            <section className='canciones-favoritos'>
                <div className='encabezado-canciones'>
                    <h2 className='canciones-favs'>{tituloSeccion}</h2>
                    <p>MORE</p>
                </div>

                <div className='contenedor-canciones'>
                    {cancionesAMostrar.length === 0 && (
                        <p style={{ textAlign: "center", width: "100%", marginTop: "50px" , fontFamily: 'Playfair Display', fontSize: "1.9rem" }}>
                            No hay canciones para mostrar. Busca una y agrégala a tu biblioteca 
                        </p>
                    )}

                    {cancionesAMostrar.map((track, index) => {
                        const safeTrack = track || {};
                        const claveUnica = safeTrack.id;

                        // CRUZAMOS DATOS
                        const interaccionGuardada = interacciones.find(i => i.spotify_id === claveUnica) || {};

                        const cancionFusionada = {
                            ...safeTrack,
                            es_escuchado: interaccionGuardada.es_escuchado ?? safeTrack.es_escuchado ?? false,
                            es_favorito: interaccionGuardada.es_favorito ?? safeTrack.es_favorito ?? false,
                            es_pendiente: interaccionGuardada.es_pendiente ?? safeTrack.es_pendiente ?? false,
                            calificacion: interaccionGuardada.calificacion || safeTrack.calificacion || 0,
                            descripcion: interaccionGuardada.descripcion || safeTrack.descripcion || "",
                            cancionImg: safeTrack.songImage || safeTrack.cancionImg, 
                            cancionName: safeTrack.songName || safeTrack.cancionName
                        };

                        return (
                            /* 👇 USAMOS UN DIV PURO, SIN LINKS A SPOTIFY */
                            <div className='cuadro-cancion' key={`cancion-page-${claveUnica}-${index}`}>
                                <TarjetaInteractiva item={cancionFusionada} tipo="song" id_echohead={id_echohead} />
                                <span className='songname'>{cancionFusionada.cancionName || "Sin Nombre"}</span>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

export default Canciones;