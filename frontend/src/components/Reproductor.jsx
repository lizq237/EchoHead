import LogoSpotify from '../assets/Logo_Spotify.svg';
import './Reproductor.css'; // Nuestro nuevo archivo de estilos

function Reproductor() {
    // Datos estáticos de prueba mientras pasa el castigo de Spotify
    const cancionPrueba = {
        titulo: "hate that i made you love me",
        artista: "Ariana Grande",
        portada: "https://i.scdn.co/image/ab67616d0000b273b622d42c30697e1e1414343c",
        estado: "Escuchando ahora"
    };

    return (
        <div className="reproductor-flotante">
            
            {/* LADO IZQUIERDO: Portada rotatoria y Textos */}
            <div className="reproductor-info">
                <div className="contenedor-vinilo-reproductor">
                    <img src={cancionPrueba.portada} alt="Portada" className="vinilo-giratorio" />
                </div>
                <div className="reproductor-textos">
                    <p className="reproductor-titulo">{cancionPrueba.titulo}</p>
                    <p className="reproductor-artista">{cancionPrueba.artista}</p>
                </div>
            </div>

            {/* CENTRO: Barra de progreso simulada */}
            <div className="reproductor-progreso">
                <span className="tiempo-actual">1:12</span>
                <div className="barra-fondo">
                    {/* El 'width' cambiará dinámicamente después */}
                    <div className="barra-llenado" style={{ width: '45%' }}></div>
                </div>
                <span className="tiempo-total">3:12</span>
            </div>

            {/* LADO DERECHO: Estado en vivo y Logo */}
            <div className="reproductor-estado">
                <span className="estado-texto">🟢 {cancionPrueba.estado}</span>
                <img src={LogoSpotify} alt="Spotify" className="logo-spotify-reproductor" />
            </div>

        </div>
    );
}

export default Reproductor;