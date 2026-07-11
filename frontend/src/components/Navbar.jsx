import { PiVinylRecordLight } from "react-icons/pi";
import { Link } from 'react-router-dom';
import '../pages/Inicio.css';

function Navbar({ username, fotoPerfil }) {
    // 👇 CREAMOS LA FUNCIÓN QUE ENVÍA LA SEÑAL 👇
    const dispararSeñal = () => {
        window.dispatchEvent(new Event('abrir-tocadiscos'));
    };

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
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {/* Al picarle, envía la señal invisible por toda la app */}
                    <PiVinylRecordLight 
                        className="icono-reproductor" 
                        onClick={dispararSeñal}
                        style={{ cursor: 'pointer' }} 
                    />
                    
                    <a className='aboutus'>About us</a>
                </div>
            </header>
        </div>
    );
}

export default Navbar;