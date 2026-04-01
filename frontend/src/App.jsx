import { useState } from 'react';
import './App.css';
import ImagenVinilos from './assets/Albumes_Inicio.avif';
import LogoSpotify from './assets/Logo_Spotify.svg';
import Inicio from './pages/Inicio';

function App() {
  const [sesionIniciada, setSesionIniciada] = useState(true);

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
        <button className='login-button'>Conectar</button>
      </div>

    </div>
  );
}

export default App;
