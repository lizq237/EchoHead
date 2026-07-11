import * as htmlToImage from 'html-to-image';
import { useRef } from 'react';
import {
    IoClose,
    IoPauseSharp,
    IoPlaySharp,
    IoPlaySkipBackSharp,
    IoPlaySkipForwardSharp
} from "react-icons/io5";
import './ReproductorEstetico.scss';

function ReproductorEstetico({ 
    cerrarModal,
    username = "USER", 
    cancion = "Sin reproducir", 
    artista = "Desconocido", 
    imagenAlbum = "", 
    estaReproduciendo = false, 
    pausarReproducir, 
    siguienteCancion, 
    cancionAnterior 
}) {
    const reproductorRef = useRef(null);

    const compartirHistoria = async () => {
        if (!reproductorRef.current) return;
        try {
            const dataUrl = await htmlToImage.toPng(reproductorRef.current, {
                quality: 1.0,
                pixelRatio: 2, 
                backgroundColor: '#181818', // Fondo oscuro del reproductor
                skipAutoScale: true 
            });
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${username}-EchoHead.png`; 
            link.click();
        } catch (error) {
            console.error("Error al generar la imagen:", error);
        }
    };

    return (
        <div className="reproductor-overlay">
            
            <div className="contenedor-captura" ref={reproductorRef}>
                <button className="btn-cerrar-reproductor-nuevo" onClick={cerrarModal}>
                    <IoClose />
                </button>
                
                <h3 className="titulo-usuario">{(username || "USER").toUpperCase()}'S PLAYER</h3>

                {/* EL NUEVO VINILO 2D */}
                <div className="vinilo-wrapper">
                    <div 
                        className="disco-vinilo"
                        // 👇 AQUÍ ESTÁ LA MAGIA DEL GIRO 👇
                        style={{ animationPlayState: estaReproduciendo ? 'running' : 'paused' }}
                    >
                        <img 
                            src={imagenAlbum || "https://via.placeholder.com/150"} 
                            alt="Portada" 
                            className="portada-vinilo" 
                        />
                        <div className="hoyo-centro"></div>
                    </div>
                </div>
                
                <div className="info-cancion-estetica">
                    <h2 className="cancion-titulo">{cancion}</h2>
                    <p className="cancion-artista">{artista}</p>
                </div>
                
                <div className="controles-reproductor">
                    <button onClick={cancionAnterior}><IoPlaySkipBackSharp /></button>
                    <button onClick={pausarReproducir} className="btn-play">
                        {estaReproduciendo ? <IoPauseSharp /> : <IoPlaySharp />}
                    </button>
                    <button onClick={siguienteCancion}><IoPlaySkipForwardSharp /></button>
                </div>

                

            </div>
        </div>
    );
}

export default ReproductorEstetico;