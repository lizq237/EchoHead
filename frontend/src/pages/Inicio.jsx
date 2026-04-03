import BotonBusqueda from '../assets/Boton-Busqueda.png';
import FotoPerfil from '../assets/Foto-perfil.jpeg';
import './Inicio.css';

function Inicio() {
    const username="lizzq";
    const topartist = [
    {
        id:1,
        artistname: "Taylor Swift",
        artistrank: 1,
        artistimage: "https://img2.rtve.es/n/16604372?w=1600"
    },
    {
        id:2,
        artistname: "One Direction",
        artistrank: 2,
        artistimage: "https://cdn-images.dzcdn.net/images/artist/6760dba71ba14145eec5478d8b135c55/1900x1900-000000-81-0-0.jpg"
    },
    {
        id:3,
        artistname: "Twenty One Pilots",
        artistrank: 3,
        artistimage: "https://media.timeout.com/images/103327219/image.jpg"
    },
    {
        id:4,
        artistname: "Junior H",
        artistrank: 4,
        artistimage: "https://ca-times.brightspotcdn.com/dims4/default/2d23377/2147483647/strip/true/crop/4149x2765+6+0/resize/2000x1333!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F06%2F71%2Ff8db19694bf7bbd1d3c5a5e57389%2Fjunior-h.jpg"
    },
    {
        id:5,
        artistname: "Phoebe Bridgers",
        artistrank: 5,
        artistimage: "https://thefader-res.cloudinary.com/private_images/w_640,c_limit,f_auto,q_auto:eco/18960007Final_xagiy6/phoebe-bridgers-cover-story-interview.jpg"
    },
    ];

    const topalbumes = [
    {
        id:1,
        albumname: "Evermore",
        albumrank: 1,
        albumimage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRurMqP9N9PY6jVKmTErRj_jbpTb9yBmGYc4w&s"
    },
    {
        id:2,
        albumname: "Ok Computer",
        albumrank: 2,
        albumimage: "https://i.scdn.co/image/ab67616d00001e02c8b444df094279e70d0ed856"
    },
    {
        id:3,
        albumname: "Folklore",
        albumrank: 3,
        albumimage: "https://http2.mlstatic.com/D_NQ_NP_910335-MLM82773771192_032025-O.webp"
    },
    {
        id:4,
        albumname: "Debi tirar mas fotos",
        albumrank: 4,
        albumimage: "https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411"
    },
    {
        id:5,
        albumname: "The tortured poets department",
        albumrank: 5,
        albumimage: "https://i.scdn.co/image/ab67616d0000b2738ecc33f195df6aa257c39eaa"
    },
    ];

    const topcanciones = [
    {
        id:1,
        songname: "Dragh path",
        songrank: 1,
        songimage: "https://indierocks.sfo3.digitaloceanspaces.com/wp-content/uploads/2026/02/Twenty-One-Pilots-drag-path.jpg"
    },
    {
        id:2,
        songname: "M.A.I",
        songrank: 2,
        songimage: "https://i.scdn.co/image/ab67616d0000b27398ee8fad7a30ff328b97d874"
    },
    {
        id:3,
        songname: "Stateside",
        songrank: 3,
        songimage: "https://i.scdn.co/image/ab67616d0000b273684ecc5bc1b724d0106ad694"
    },
    {
        id:4,
        songname: "I know the end",
        songrank: 4,
        songimage: "https://i.scdn.co/image/ab67616d0000b273a91b75c9ef65ed8d760ff600"
    },
    {
        id:5,
        songname: "Purple rain",
        songrank: 5,
        songimage: "https://m.media-amazon.com/images/I/81CzfbO4CrL.jpg"
    },
    ];
    

    
    return (
        <div className='Inicio'>
            <div className='Navbar'>
                <header>
                    <div>
                        <h1 className='EchoHead'>EchoHead</h1>
                    </div>
                    <nav>
                        <div className='datos-user'>
                            <img src={FotoPerfil} alt="Foto de perfil" className='FotoPerfil' />
                            <span className='username'>{username}</span>
                        </div>
                        <a>Albumes</a>
                        <a >Canciones</a>
                    </nav>
                        <div>
                            <img src={BotonBusqueda} alt="Botón de búsqueda" className='BotonBusqueda'/>
                            <a className='aboutus'>Abouts us</a>
                        </div>
                </header>
            </div>
            <h1 className='h1'>Hola de nuevo, {username}!</h1>
            <section className='artistas'>
                <div className='encabezado-artistas'>
                    <h2 className='artistas-momento'>Top Artistas del momento</h2>
                    <p>MORE</p>
                </div>

                <div className='contenedor-cuadros'>
                    {topartist.map((artista) => (
                        <div className='cuadro-artista'>
                            <img src={artista.artistimage} alt="Imagen artista"/>
                            <span className='artistname'>{artista.artistname}</span>
                            <span className='artistrank'>#{artista.artistrank}</span>
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
                    {topalbumes.map((album) => (
                        <div className='cuadro-album'>
                            <img src={album.albumimage} alt="Imagen album"/>
                            <span className='albumname'>{album.albumname}</span>
                            <span className='albumrank'>#{album.albumrank}</span>
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
                        {topcanciones.map((cancion) => (
                            <div className='cuadro-cancion'>
                                <img src={cancion.songimage} alt="Imagen canción"/>
                                <span className='songname'>{cancion.songname}</span>
                                <span className='songrank'>#{cancion.songrank}</span>
                            </div>
                        ))}
                    </div>
            </section>

        </div>
    );
    }

    export default Inicio;