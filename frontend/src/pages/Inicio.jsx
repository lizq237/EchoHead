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
        </div>
    );
    }

    export default Inicio;