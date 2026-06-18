import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import '../pages/Inicio.css';
import './Albumes.css';

function Albumes({ username, fotoPerfil, nuevosAlbumes, tokenSpotify }) {
    const [busqueda, setBusqueda] = useState("");
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);

    useEffect(() => {
        const textoLimpio = busqueda.trim();

        if (textoLimpio === "") {
            setResultadosBusqueda([]);
            return;
        }

        const temporizador = setTimeout(() => {
            
            fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(textoLimpio)}&type=album&market=MX&limit=10`, {
                headers: { 'Authorization': `Bearer ${tokenSpotify}` }
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.error("Motivo exacto del rechazo:", data.error.message);
                    return;
                }

                if (data.albums && data.albums.items) {
                    const albumesEncontrados = data.albums.items.map(item => ({
                        id: item.id,
                        albumName: item.name,
                        albumImage: item.images[0]?.url || "https://placehold.co/300x300?text=Sin+Portada",
                        albumLink: item.external_urls.spotify

                    }));
                    setResultadosBusqueda(albumesEncontrados);
                } else {
                    setResultadosBusqueda([]);
                }
            })
            .catch(error => console.error("Error en búsqueda de álbumes:", error));
            
        }, 500); 

        return () => clearTimeout(temporizador);

    }, [busqueda, tokenSpotify]); 

    const Navegacion = (evento) => {
        setBusqueda(evento.target.value);
    }
            
    const albumesAMostrar = busqueda === "" ? nuevosAlbumes : resultadosBusqueda;
    const tituloSeccion = busqueda === "" ? `${username}, estos son tus ultimos álbumes favs en Spotify` : `Resultados para "${busqueda}"`;

    return (
        <div className='pagina-albumes'> 
            <Navbar username={username} fotoPerfil={fotoPerfil} />
            
            <div className='busqueda-album'>
                <p className='buscar'>ENCONTRAR ALBUM</p>
                <input 
                    type="text" 
                    className='input-album' 
                    placeholder="Escribe un álbum..." 
                    value={busqueda}
                    onChange={Navegacion} 
                />
            </div>

            <section className='albumes-favoritos'>
                <div className='encabezado-albumes'>
                    <h2 className='albumes-favs'>{tituloSeccion}</h2>
                    <p>MORE</p>
                </div>

                <div className='contenedor-cuadros'>
                    {albumesAMostrar.length === 0 && (
                        <p style={{ 
                            textAlign: "center", width: "100%", marginTop: "50px" , fontFamily: 'Playfair Display', fontSize: "1.9rem"
                            }}>
                            No hay álbumes para mostrar. Busca un álbum y agregalo a tu biblioteca 
                        </p>
                    )}

                    {albumesAMostrar.map((album) => (
                        <a 
                            href={album.albumLink} 
                            target="_blank"             
                            rel="noopener noreferrer"   
                            className='cuadro-album' 
                            key={album.id}
                            style={{ textDecoration: 'none' }} 
                        >
                            <img src={album.albumImage} alt={album.albumName} />
                            <span className='albumname'>{album.albumName}</span>
                        </a>
                    ))}

                </div>
            </section>
        </div>
    );
}

export default Albumes;