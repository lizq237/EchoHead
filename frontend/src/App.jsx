import { useEffect, useState } from 'react';
import './App.css';
import ImagenVinilos from './assets/Albumes_Inicio.avif';
import LogoSpotify from './assets/Logo_Spotify.svg';
import Inicio from './pages/Inicio';

function App() {
  const [sesionIniciada, setSesionIniciada] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const spotifyCode = urlParams.get('code');

    if (spotifyCode) {
        // Limpiamos la URL para que no se vea el código feo
        window.history.pushState({}, null, "/");
        fetch('http://localhost:8888/intercambiar-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: spotifyCode })
        })
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.access_token) {
                console.log("¡Pulsera VIP conseguida desde App.jsx!");
                setSesionIniciada(true);
            }
        })
        .catch(error => console.error("Error:", error));
    }
  }, []);

  const handleLogin = () => {
    window.location.href = 'http://localhost:8888/login';
  };

  if (sesionIniciada) {
    return <Inicio />;
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