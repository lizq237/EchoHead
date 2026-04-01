import BotonBusqueda from '../assets/Boton-Busqueda.png';
import FotoPerfil from '../assets/Foto-perfil.jpeg';
import './Inicio.css';

function Inicio() {
    const username="lizzq";
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


        </div>
    );
    }

    export default Inicio;