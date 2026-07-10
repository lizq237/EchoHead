import { useEffect, useState } from 'react';
import './ListaAmigosPerfil.css';

function ListaAmigosPerfil({ id_echohead }) {
    const [busqueda, setBusqueda] = useState('');
    const [resultados, setResultados] = useState([]);
    const [cargando, setCargando] = useState(false);
    
    // 👇 NUEVOS ESTADOS PARA TUS LISTAS
    const [pestanaActiva, setPestanaActiva] = useState('siguiendo'); // 'siguiendo' o 'seguidores'
    const [listaSiguiendo, setListaSiguiendo] = useState([]);
    const [listaSeguidores, setListaSeguidores] = useState([]);
    const [siguiendoA, setSiguiendoA] = useState({}); 

    // 👇 USE EFFECT ACTUALIZADO: Trae la memoria de botones y las listas completas
    useEffect(() => {
        if (!id_echohead) return;
        
        // 1. Curar la amnesia de los botones
        fetch(`http://localhost:8888/api/usuarios/${id_echohead}/siguiendo`)
            .then(res => res.json())
            .then(data => {
                const estadoInicial = {};
                data.forEach(id => { estadoInicial[id] = true; });
                setSiguiendoA(estadoInicial);
            });

        // 2. Traer la lista de perfiles que sigo
        fetch(`http://localhost:8888/api/usuarios/${id_echohead}/lista-siguiendo`)
            .then(res => res.json())
            .then(data => setListaSiguiendo(data));

        // 3. Traer la lista de perfiles que me siguen
        fetch(`http://localhost:8888/api/usuarios/${id_echohead}/lista-seguidores`)
            .then(res => res.json())
            .then(data => setListaSeguidores(data));

    }, [id_echohead]);

    const buscarUsuarios = async (texto) => {
        setBusqueda(texto);
        if (texto.length < 2) {
            setResultados([]); 
            return;
        }

        setCargando(true);
        try {
            const respuesta = await fetch(`http://localhost:8888/api/usuarios/buscar?q=${texto}`);
            const data = await respuesta.json();
            
            if (!Array.isArray(data)) {
                setResultados([]);
                return;
            }

            const usuariosFiltrados = data.filter(user => user.id_echohead !== id_echohead);
            setResultados(usuariosFiltrados);
        } catch (error) {
            console.error("Error al buscar:", error);
        } finally {
            setCargando(false);
        }
    };

    const toggleSeguir = async (seguido_id) => {
        const yaLoSigo = siguiendoA[seguido_id];
        try {
            const url = 'http://localhost:8888/api/seguidores';
            const metodo = yaLoSigo ? 'DELETE' : 'POST';
            
            const respuesta = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seguidor_id: id_echohead, seguido_id: seguido_id })
            });

            if (respuesta.ok) {
                setSiguiendoA(prev => ({
                    ...prev,
                    [seguido_id]: !yaLoSigo
                }));
            }
        } catch (error) {
            console.error("Error al interactuar con el seguidor:", error);
        }
    };

    // Pequeño componente reutilizable para dibujar la fila de un usuario
    const renderUsuario = (usuario) => (
        <div className="tarjeta-usuario-fila" key={usuario.id_echohead}>
            <div className="info-usuario-izq">
                <img 
                    src={usuario.foto_perfil || "https://placehold.co/100x100?text=Sin+Foto"} 
                    alt={usuario.nombre} 
                    className="foto-perfil-amigo"
                />
                <span className="nombre-perfil-amigo">{usuario.nombre}</span>
            </div>

            <button 
                className={`btn-seguir ${siguiendoA[usuario.id_echohead] ? 'siguiendo' : ''}`}
                onClick={() => toggleSeguir(usuario.id_echohead)}
            >
                {siguiendoA[usuario.id_echohead] ? 'SIGUIENDO' : 'SEGUIR'}
            </button>
        </div>
    );

    return (
        <div className="perfil-biblioteca-contenedor">
            {/* LA BARRA DE BÚSQUEDA */}
            <div className="buscador-amigos-contenedor">
                <input 
                    type="text" 
                    className="input-buscador-amigos"
                    placeholder="Buscar usuarios por nombre..."
                    value={busqueda}
                    onChange={(e) => buscarUsuarios(e.target.value)}
                />
            </div>

            {/* SI HAY BÚSQUEDA: Mostramos resultados */}
            {busqueda.length >= 2 ? (
                <div className="lista-resultados-amigos">
                    {cargando && <p className="mensaje-estado-perfil">Buscando...</p>}
                    {!cargando && resultados.length === 0 && <p className="mensaje-estado-perfil">No se encontraron usuarios.</p>}
                    {!cargando && resultados.map(renderUsuario)}
                </div>
            ) : (
                /* SI NO HAY BÚSQUEDA: Mostramos las pestañas estilo Letterboxd */
                <div className="seccion-listas-guardadas">
                    <div className="tabs-letterboxd-amigos">
                        <button 
                            className={pestanaActiva === 'siguiendo' ? 'tab-activa' : ''}
                            onClick={() => setPestanaActiva('siguiendo')}
                        >
                            SIGUIENDO
                        </button>
                        <button 
                            className={pestanaActiva === 'seguidores' ? 'tab-activa' : ''}
                            onClick={() => setPestanaActiva('seguidores')}
                        >
                            SEGUIDORES
                        </button>
                    </div>

                    <div className="lista-resultados-amigos">
                        {pestanaActiva === 'siguiendo' && listaSiguiendo.length === 0 && (
                            <p className="mensaje-estado-perfil">Aún no sigues a nadie.</p>
                        )}
                        {pestanaActiva === 'seguidores' && listaSeguidores.length === 0 && (
                            <p className="mensaje-estado-perfil">Aún no tienes seguidores.</p>
                        )}

                        {pestanaActiva === 'siguiendo' && listaSiguiendo.map(renderUsuario)}
                        {pestanaActiva === 'seguidores' && listaSeguidores.map(renderUsuario)}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListaAmigosPerfil;