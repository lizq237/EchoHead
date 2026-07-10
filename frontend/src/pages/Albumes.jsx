import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TarjetaInteractiva from '../components/TarjetaInteractiva';
import './Albumes.css';

function Albumes({ username, fotoPerfil, nuevosAlbumes, tokenSpotify, id_echohead }) {
    const [busqueda, setBusqueda] = useState("");
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
    const [interacciones, setInteracciones] = useState([]);

    useEffect(() => {
        if (!id_echohead) return;

        fetch(`http://localhost:8888/api/interacciones/${id_echohead}`)
            .then(res => {
                if (!res.ok) throw new Error("Ruta no encontrada en el servidor");
                return res.json();
            })
            .then(data => {
                if (data && data.length > 0) setInteracciones(data);
            })
            .catch(error => console.error("Error al traer interacciones:", error));
    }, [id_echohead]);

    useEffect(() => {
        const textoLimpio = busqueda.trim();
        if (textoLimpio === "") {
            setResultadosBusqueda([]);
            return;
        }

        const temporizador = setTimeout(() => {
            fetch(`https://api.spotify.com/v1/search?q=$${encodeURIComponent(textoLimpio)}&type=album&market=MX&limit=10`, {
                headers: { 'Authorization': `Bearer ${tokenSpotify}` }
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) return;
                if (data.albums && data.albums.items) {
                    const albumesEncontrados = data.albums.items.map(item => ({
                        id: item.id,
                        albumName: item.name,
                        albumImage: item.images[0]?.url || "https://placehold.co/300x300?text=Sin+Portada",
                        albumLink: item.external_urls.spotify,
                        artista: item.artists[0]?.name 
                    }));
                    setResultadosBusqueda(albumesEncontrados);
                } else {
                    setResultadosBusqueda([]);
                }
            })
            .catch(error => console.error("Error en búsqueda:", error));
        }, 500); 

        return () => clearTimeout(temporizador);
    }, [busqueda, tokenSpotify]); 

    const Navegacion = (evento) => setBusqueda(evento.target.value);
            
    const albumesAMostrar = busqueda === "" ? (nuevosAlbumes || []) : resultadosBusqueda;
    const tituloSeccion = busqueda === "" ? `${username}, estos son tus últimos álbumes favs en Spotify` : `Resultados para "${busqueda}"`;

    return (
        <div className='pagina-albumes'> 
            <Navbar username={username} fotoPerfil={fotoPerfil} />
            
            <div className='busqueda-album'>
                <p className='buscar'>ENCONTRAR ALBUM</p>
                <input type="text" className='input-album' placeholder="Escribe un álbum..." value={busqueda} onChange={Navegacion} />
            </div>

            <section className='albumes-favoritos'>
                <div className='encabezado-albumes'>
                    <h2 className='albumes-favs'>{tituloSeccion}</h2>
                    <p>MORE</p>
                </div>

                <div className='contenedor-cuadros'>
                    {albumesAMostrar.length === 0 && (
                        <p style={{ textAlign: "center", width: "100%", marginTop: "50px" , fontFamily: 'Playfair Display', fontSize: "1.9rem" }}>
                            No hay álbumes para mostrar. Busca un álbum y agrégalo a tu biblioteca 
                        </p>
                    )}

            

                    {albumesAMostrar.map((album, index) => {
                        const safeAlbum = album || {};
                        const claveUnica = safeAlbum.id;

                        const interaccionGuardada = interacciones.find(i => i.spotify_id === claveUnica) || {};

                        const albumFusionado = {
                            ...safeAlbum,
                            es_favorito: interaccionGuardada.es_favorito === true,
                            es_escuchado: interaccionGuardada.es_escuchado === true,
                            es_pendiente: interaccionGuardada.es_pendiente === true,
                            calificacion: interaccionGuardada.calificacion || 0,
                            descripcion:interaccionGuardada.descripcion || "",
                            albumImg: safeAlbum.albumImage ,
                        };

                        return (
                            <div className='cuadro-album' key={`album-page-${claveUnica}-${index}`}>
                                <TarjetaInteractiva item={albumFusionado} tipo="album" id_echohead={id_echohead} />
                                <span className='albumname'>{albumFusionado.albumName || "Sin Nombre"}</span>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

export default Albumes;