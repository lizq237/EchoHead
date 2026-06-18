import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import './Albumes.css';
import './Canciones.css';


function Canciones( { username, fotoPerfil, tokenSpotify, cancionesFavs }) {

    const [busqueda, setBusqueda] = useState("");
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
    
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
                    if (data.error) {
                        console.error("Motivo exacto del rechazo:", data.error.message);
                        return;
                    }
    
                    if (data.tracks && data.tracks.items) {
                        const cancionesEncontradas = data.tracks.items.map(item => ({
                            id: item.id,
                            songName: item.name,
                            songImage: item.album.images[0]?.url || "https://placehold.co/300x300?text=Sin+Portada",
                            songLink: item.external_urls.spotify
                        }));
                        setResultadosBusqueda(cancionesEncontradas);
                    } else {
                        setResultadosBusqueda([]);
                    }
                })
                .catch(error => console.error("Error en búsqueda de cancions:", error));
                
            }, 500); 
    
            return () => clearTimeout(temporizador);
    
        }, [busqueda, tokenSpotify]); 
    
        const Navegacion = (evento) => {
            setBusqueda(evento.target.value);
        }
                
        const cancionesAMostrar = busqueda === "" ? cancionesFavs : resultadosBusqueda;
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

                <div className='contenedor-cuadros'>

                    {cancionesAMostrar.map((track) => (

                     <a 

                     href={track.songLink} 
                     target="_blank"             
                     rel="noopener noreferrer"   
                     className='cuadro-cancion' 
                     key={track.id}
                     style={{ textDecoration: 'none' }} 
                    >
                        <img src={track.songImage} alt={track.songName} />
                        <span className='songname'>{track.songName}</span>
                    </a>
                    ))}
                </div>
            </section>
                    
                    
                    
                
        
        </div>
    );
}

export default Canciones;
        