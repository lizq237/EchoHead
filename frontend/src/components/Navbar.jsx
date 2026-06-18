import { Link } from 'react-router-dom';
import BotonBusqueda from '../assets/Boton-Busqueda.png';
import '../pages/Inicio.css';

function Navbar({ username, fotoPerfil }) {
    return (
        <div className='Navbar'>
            <header>
                <div>
                    <Link to="/" className='link-nav'>
                        <h1 className='EchoHead'>EchoHead</h1>
                    </Link>
                </div>
                <nav>
                    <div className='datos-user'>
                        <img src={fotoPerfil} alt="Foto de perfil" className='FotoPerfil' />
                        <Link to="/perfil" className='link-nav'>{username}</Link>

                        
                    </div>
                    <Link to="/albumes" className='link-nav'>Albumes</Link>
                    <Link to="/canciones" className='link-nav'>Canciones</Link>
                </nav>
                <div>
                    <img src={BotonBusqueda} alt="Botón de búsqueda" className='BotonBusqueda'/>
                    <a className='aboutus'>About us</a>
                </div>
            </header>
        </div>
    );
}

export default Navbar;