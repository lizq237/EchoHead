import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Reproductor from './/components/Reproductor';
import './App.css';
import ImagenVinilos from './assets/Albumes_Inicio.avif';
import LogoSpotify from './assets/Logo_Spotify.svg';
import Albumes from './pages/Albumes';
import Canciones from './pages/Canciones';
import Inicio from './pages/Inicio';
import Perfil from './pages/Perfil';

function App() {
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");  
  const [topArtistas, setTopArtistas] = useState([]);
  const [topAlbumes, setTopAlbumes] = useState([]);
  const [topCanciones, setTopCanciones] = useState([]);
  const [nuevosAlbumes, setNuevosAlbumes] = useState([]);
  const [tokenSpotify, setTokenSpotify] = useState("");
  const [cancionesFavs, setCancionesFavs]= useState([]);
  const [idEchohead, setIdEchohead] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const spotifyCode = urlParams.get('code');

    if (spotifyCode) {
        fetch('http://localhost:8888/intercambiar-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: spotifyCode })
        })
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.access_token) {
                console.log("¡Pulsera VIP conseguida!");
                setTokenSpotify(datos.access_token);
                navigate("/");
                
                const spotifyAPI = "https://api.spotify.com/v1";

                // --- 1. FETCH DEL PERFIL ---
                fetch(`${spotifyAPI}/me`, {
                    headers: { 'Authorization': `Bearer ${datos.access_token}` }
                })
                .then(res => {
                    if (!res.ok) throw new Error(`Spotify bloqueó la petición de Perfil. Status: ${res.status}`);
                    return res.json();
                })
                .then(perfil => {
                    const imagenPerfil = perfil.images[0]?.url || "https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021";
                    setUsuario(perfil.display_name); 
                    setFotoPerfil(imagenPerfil);

                    fetch('http://localhost:8888/usuarios/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            spotify_id: perfil.id,
                            email: perfil.email,
                            nombre: perfil.display_name,
                            foto_perfil: imagenPerfil
                        })
                    })
                    .then(respuestaDB => respuestaDB.json())
                    .then(usuarioGuardado => {
                        console.log("💿 ¡Usuario guardado/actualizado en PostgreSQL!", usuarioGuardado);
                        setIdEchohead(usuarioGuardado.id_echohead);
                        
                        // INYECCIÓN DE DATOS ESTÁTICOS PARA INICIO
                        setTopArtistas([
                            { id: "66CXWjxzNUsdJxJ2JdwvnR", artistName: "Ariana Grande", artistImage:"https://i.scdn.co/image/ab67616d00001e02a8cd4b331826a52e8d05bd90" },
                            { id: "3fMbdgg4jU18AjLCKBhRSm", artistName: "Michael Jackson", artistImage: "https://image-cdn-ak.spotifycdn.com/image/ab676186000001943753db8546a0d1ec0972c594" },
                            { id: "1uNFoZAHBGtllmzznpCI3s", artistName: "Justin Bieber", artistImage: "https://i.scdn.co/image/ab6761610000e5ebaf20f7db5288bce9beede034" },
                            { id: "3ukkRHDHbN8tNRPKsGZR1h", artistName: "BTS", artistImage: "https://i.scdn.co/image/ab6761670000ecd487ef96c83d38f358fd297172" },
                            { id: "7yNf9YjeO5JXUE3JEBgnYc", artistName: "Dominic Fike", artistImage: "https://image-cdn-ak.spotifycdn.com/image/ab676186000001941ce8822b366da01389b26de0" }
                        ]);
                        
                        setTopAlbumes([
                            { id: "3ukkRHDHbN8tNRPKsGZR1h", albumName: "ARIRANG", albumImage: "https://i.scdn.co/image/ab67616d00001e02dfa17fad7f190c901603270e" },
                            { id: "3TVXtAsR1Inumwj472S9r4", albumName: "ICEMAN", albumImage: "https://i.scdn.co/image/ab67616d00001e02fe9d3ab9adb1d3b59835b81c" },
                            { id: "5K79FLRUCSysQnVESLcTdb", albumName: "DeBÍ TiRAR MáS FOToS", albumImage: "https://i.scdn.co/image/ab67616d00001e02bbd45c8d36e0e045ef640411" },
                            { id: "3fMbdgg4jU18AjLCKBhRSm", albumName: "Thriller", albumImage: "https://i.scdn.co/image/ab67616d0000b27332a7d87248d1b75463483df5" },
                            { id: "5K79FLRUCSysQnVESLcTdb", albumName: "Un Verano Sin Ti", albumImage: "https://i.scdn.co/image/ab67616d00001e0249d694203245f241a1bcaa72" }
                        ]);

                        setTopCanciones([
                            { id: "66CXWjxzNUsdJxJ2JdwvnR", songName: "hate that i made you love me", songImage: "https://i.scdn.co/image/ab67616d0000b273b622d42c30697e1e1414343c" },
                            { id: "3fMbdgg4jU18AjLCKBhRSm", songName: "Billie Jean", songImage: "https://i.scdn.co/image/ab67616d0000b27332a7d87248d1b75463483df5" },
                            { id: "1uNFoZAHBGtllmzznpCI3s", songName: "Beauty And A Beat", songImage: "https://i.scdn.co/image/ab67616d0000b273f1d02a6cec967f8b6b78f76e" },
                            { id: "68lbSrXDORS51pmyjZv712",songName: "SWIM", songImage: "https://i.scdn.co/image/ab67616d0000b273dfa17fad7f190c901603270e" },
                            { id: "7yNf9YjeO5JXUE3JEBgnYc", songName: "Babydoll", songImage: "https://i.scdn.co/image/ab67616d0000b2737b1b6f41c1645af9757d5616" },
                        ]);

                        // ¡¡AQUÍ!! Ejecutamos la sesión como iniciada al final de la carga.
                        setSesionIniciada(true); 
                    })
                    .catch(err => {
                        console.error("Error al guardar en DB:", err);
                        setSesionIniciada(true); 
                    });
                })
                .catch(error => console.error("Error al obtener perfil:", error));

                // --- 2. FETCH DE ÁLBUMES REALES ---
                fetch(`${spotifyAPI}/me/albums?limit=50`, {
                    headers: { 'Authorization': `Bearer ${datos.access_token}` }
                })
                .then(res => {
                    if (!res.ok) throw new Error(`Spotify bloqueó la petición de Álbumes. Status: ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    if (data.error) return console.error("Error de Spotify:", data.error.message);
                    if (data.items) {
                        const albumesFavs = data.items.map(item => ({
                            id: item.album.id,
                            albumName: item.album.name,
                            albumImage: item.album.images[0]?.url || "https://placehold.co/300x300?text=Sin+Portada",
                            albumLink: item.album.external_urls.spotify
                        }));
                        setNuevosAlbumes(albumesFavs);
                    }
                })
                .catch(error => console.error("Error al cargar nuevos álbumes:", error));

                // --- 3. FETCH DE CANCIONES REALES ---
                fetch(`${spotifyAPI}/me/tracks?limit=50`, {
                    headers: { 'Authorization': `Bearer ${datos.access_token}` }
                })
                .then(res => {
                    if (!res.ok) throw new Error(`Spotify bloqueó la petición de Canciones. Status: ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    if (data.error) return console.error("Error de Spotify:", data.error.message);
                    if (data.items) {
                        const cancionesmeFavs = data.items.map(item => ({
                            id: item.track.id,
                            songName: item.track.name,
                            songImage: item.track.album.images[0]?.url || "https://placehold.co/300x300?text=Sin+Portada",
                            songLink: item.track.external_urls.spotify
                        }));
                        setCancionesFavs(cancionesmeFavs);
                    }
                })
                .catch(error => console.error("Error al cargar nuevas canciones:", error));

            } // FIN DEL BLOQUE IF (datos.access_token)
        })
        .catch(error => console.error("Error general:", error));
    }
  }, [navigate]);

  const handleLogin = () => {
    window.location.href = 'http://localhost:8888/login';
  };

  if (sesionIniciada) {
    return (
    <>
      <Routes>
        <Route path="/" element={<Inicio username={usuario} fotoPerfil={fotoPerfil} topArtistas={topArtistas} topAlbumes={topAlbumes} topCanciones={topCanciones} />} />
        <Route path="/albumes" element={<Albumes username={usuario} fotoPerfil={fotoPerfil} nuevosAlbumes={nuevosAlbumes} tokenSpotify={tokenSpotify} />} />
        <Route path="/canciones" element={<Canciones username={usuario} fotoPerfil={fotoPerfil} tokenSpotify={tokenSpotify} cancionesFavs={cancionesFavs} />} />
        <Route path="/perfil" element={<Perfil username={usuario} fotoPerfil={fotoPerfil} tokenSpotify={tokenSpotify} id_echohead={idEchohead} />} />
      </Routes>
      <Reproductor tokenSpotify={tokenSpotify} />
    </>
    );
  }

  return (
    <div className='login-echohead'>
      <div className='login-imagen'>
        <img src={ImagenVinilos} alt='Imagen vinilos' className='imagen-fondo' />
      </div>
      <div className='contenido-login'>
        <h1 className='titulo-echohead'>EchoHead</h1>
        <h2 className='hola'>Hola amante de la musica!</h2>
        <p className='texto'>Inicia sesión con tu cuenta de Spotify</p>
        <div className='spoify-logo'>
           <img src={LogoSpotify} alt='Logo Spotify' className='spotify-img' />
        </div>
        <button className='login-button' onClick={handleLogin}>Conectar</button>
      </div>
    </div>
  );
}

export default App;