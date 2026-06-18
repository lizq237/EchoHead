import Vinilo from '../assets/vinilo.webp';
import Navbar from '../components/Navbar';
import './Inicio.css';


function Inicio( { username, fotoPerfil, topArtistas, topAlbumes, topCanciones} ) {
    
    return (
        <div className='Inicio'>
            <Navbar username={username} fotoPerfil={fotoPerfil} />
            
            <h1 className='h1'>Hola de nuevo, {username}!</h1>
            <section className='artistas'>
                <div className='encabezado-artistas'>
                    <h2 className='artistas-momento'>Top Artistas del momento</h2>
                    <p>MORE</p>
                </div>

                <div className='contenedor-cuadros'>
                    {topArtistas.map((artista, index) => (
                        <div className='cuadro-artista' key={artista.id}>
                            <img src={artista.artistImage} alt="Imagen artista"/>
                            <span className='artistname'>{artista.artistName}</span>
                            <span className='artistrank'>#{index+1}</span>
                        </div>
                        ))}
                </div>
            </section>

            <section className='albumes'>
                <div className='encabezado-albumes'>
                    <h2 className='albumes-momento'>Top Álbumes del momento</h2>
                    <p>MORE</p>
                </div>

                <div className='contenedor-cuadros'>
                    {topAlbumes.map((album, index) => (
                        <div className='cuadro-album' key={album.id}>
                            <img src={album.albumImage} alt="Imagen album"/>
                            <span className='albumname'>{album.albumName}</span>
                            <span className='albumrank'>#{index+1}</span>
                        </div>
                        ))}
                </div>
            </section>

            <section className='canciones'> 
                    <div className='encabezado-canciones'>
                        <h2 className='canciones-momento'>Top Canciones del momento</h2>
                        <p>MORE</p>
                    </div>
                    <div className='contenedor-cuadros'>
                        {topCanciones.map((cancion, index) => (
                            <div className='cuadro-cancion' key={cancion.id}>
                                <img src={cancion.songImage} alt="Imagen canción"/>
                                <span className='songname'>{cancion.songName}</span>
                                <span className='songrank'>#{index+1}</span>
                            </div>
                        ))}
                    </div>
            </section>
            

            <div className='carrusel'>
                <h3>Descubre nuevos artistas</h3>
                <div className='carrusel-artistas' style={{ "--n": 13 }}>
                    <img src="https://i.scdn.co/image/ab67616d0000b27333b8541201f1ef38941024be" alt="Taylor Swift" className='card' style= {{ "--i": 0 }} />
                    <img src="https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70d0ed856" alt="Radiohead" className='card' style= {{ "--i": 1 }} />
                    <img src="https://i.scdn.co/image/ab67616d0000b27308a1b1e0674086d3f1995e1b" alt="Green Day" className='card' style= {{ "--i": 2 }} />
                    <img src="https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411" alt="Bad Bunny" className='card' style= {{ "--i": 3 }} />
                    <img src="https://i.scdn.co/image/ab67616d0000b273ef88ad49166e31598ff7d4d0" alt="Junior H" className='card' style= {{ "--i": 4 }} />
                    <img src="https://i.scdn.co/image/ab67616d0000b273df5022bdf1ac4bf52135c4be" alt="Red velvet" className='card' style= {{ "--i": 5 }} />
                    <img src="https://i.scdn.co/image/ab67616d0000b273844283dba279ee545aafb022" alt="Milo J" className='card' style= {{ "--i": 6 }} />
                    <img src="https://i.scdn.co/image/ab67616d0000b273e3e3b64cea45265469d4cafa" alt="The Beatles" className='card' style= {{ "--i": 7 }} />
                    <img src="https://i.scdn.co/image/ab67616d0000b273084a94988541c2402615d014" alt="Tyler the creator" className='card' style= {{ "--i": 8 }} />
                    <img src="https://i.scdn.co/image/ab67616d0000b2736be9bac15995f089579074de" alt="Rihanna" className='card' style= {{ "--i": 9 }} />
                    <img src="https://i.scdn.co/image/ab67616d0000b2736c26e4a2e4df94a55591c48f" alt="Phoebe Bridgers" className='card' style= {{ "--i": 10 }} />
                    <img src="https://i.scdn.co/image/ab67616d0000b2732e02117d76426a08ac7c174f" alt="Kendrick Lamar" className='card' style= {{ "--i": 11 }} />
                    <img src="https://i.scdn.co/image/ab67616d0000b273db216ca805faf5fe35df4ee6" alt="Pink Floyd" className='card' style= {{ "--i": 12 }} />
                </div>
            </div> {/* <--- AQUÍ SE DEBE CERRAR EL CARRUSEL */}

            {/* Y AQUÍ AFUERA VA TU TEXTO NUEVO */}
            <div className='textos-extra-carrusel'>
                <h2>EL SOUNDTRACK DE TU VIDA</h2>
                <p>Cada canción cuenta una historia y cada álbum guarda un recuerdo. Crea tu bóveda personal, califica los discos que te han marcado y construye un archivo visual con los ritmos que te acompañan día a día.</p>
            </div>

        <section>
            <div className='textofinal'>
                <p className='descripcion'>Explora ritmos que conectan continentes y melodías que borran cualquier límite. Tu próxima canción favorita está en algún lugar del mundo.</p>
                <img src={Vinilo} alt="Vinilo" className='Vinilo' />
            </div>
        </section>
            

        <footer>
            <p className='footer-text'>© 2026 Lizeth Quiroz | EchoHead Project.</p>
        </footer>

        </div>
    );
    }

    export default Inicio;