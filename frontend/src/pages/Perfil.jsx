import { useEffect, useState } from "react";
import btnagregar from '../assets/agregar.png';
import artistImg from '../assets/artist-imagen-perfil.png';
import btneliminar from '../assets/eliminar-btn.png';
import viniloImg from '../assets/imagen-vinilo-perfil.png';
import Navbar from "../components/Navbar";
import './Perfil.css';

function Perfil ({ username, fotoPerfil , tokenSpotify, id_echohead}) {
    const borrarCancion = (idQueQuieroBorrar) => {
        const nuevaLista = cancionesFavs.filter(cancion => cancion.id !== idQueQuieroBorrar);
        setCancionesFavs(nuevaLista);
    };

    const borrarAlbum = (idQueQuieroBorrar) => {
        const nuevaLista = albumesFavs.filter(album => album.id !== idQueQuieroBorrar);
        setAlbumesFavs(nuevaLista);
    }

    const borrarArtista = (idQueQuieroBorrar) => {
        const nuevaLista = artistasFavs.filter(artista => artista.id !== idQueQuieroBorrar);
        setArtistasFavs(nuevaLista);
    }

    const[mostrarModalCancion, setMostrarModalCancion] = useState(false);
    const [mostrarModalAlbum, setMostrarModalAlbum] = useState(false);
    const [mostrarModalArtista, setMostrarModalArtista] = useState(false);
    const [editando, setEditando] = useState(false);
    const [descripcion, setDescripcion] = useState("");
    
    // FETCH DE BASE DE DATOS (POSTGRESQL) - ESTOS SE QUEDAN ACTIVOS
    useEffect(() => {
        fetch(`http://localhost:8888/usuarios/${id_echohead}`)
            .then(res => res.json())
            .then(data => {
                if (data.descripcion) setDescripcion(data.descripcion);
            })
            .catch(error => console.error("Error al obtener la descripción de la BD:", error));
            
        fetch(`http://localhost:8888/usuarios/${id_echohead}/artistas`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) setArtistasFavs(data);
            })
            .catch(error => console.error("Error al obtener los artistas de la BD:", error));
        
        fetch(`http://localhost:8888/usuarios/${id_echohead}/albumes`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) setAlbumesFavs(data);
            })
            .catch(error => console.error("Error al obtener los álbumes de la BD:", error));   
            
        fetch(`http://localhost:8888/usuarios/${id_echohead}/canciones`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) setCancionesFavs(data);
            })
            .catch(error => console.error("Error al obtener las canciones de la BD:", error));  
    }, [id_echohead]);

    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
    const [artistasFavs, setArtistasFavs]= useState([]);
    const [albumesFavs, setAlbumesFavs]= useState([]);
    const [cancionesFavs, setCancionesFavs]= useState([]);

    const buscarCancion = (e) => { 
        const textoLimpio = e.trim();
        if (textoLimpio === "") {
            setResultadosBusqueda([]);
            return;
        }
        fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(textoLimpio)}&type=track&market=MX&limit=10`, {
            headers: { 'Authorization': `Bearer ${tokenSpotify}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) return;
            if (data.tracks && data.tracks.items) setResultadosBusqueda(data.tracks.items)
        })
        .catch(error => console.error("Error en búsqueda de cancions:", error));
    }

    const buscarAlbum = (e) => {
        const textoLimpio = e.trim();
        if (textoLimpio === "") {
            setResultadosBusqueda([]);
            return;
        }
        fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(textoLimpio)}&type=album&market=MX&limit=10`, {
            headers: { 'Authorization': `Bearer ${tokenSpotify}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) return;
            if (data.albums && data.albums.items) setResultadosBusqueda(data.albums.items)
        })
        .catch(error => console.error("Error en búsqueda de álbumes:", error));
    }

    const buscarArtista = (e) => {
        const textoLimpio = e.trim();
        if (textoLimpio === "") {
            setResultadosBusqueda([]);
            return;
        }
        fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(textoLimpio)}&type=artist&market=MX&limit=10`, {
            headers: { 'Authorization': `Bearer ${tokenSpotify}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) return;
            if (data.artists && data.artists.items) setResultadosBusqueda(data.artists.items)
        })
        .catch(error => console.error("Error en búsqueda de artistas:", error));
    }

    const guardarCambios = async () => {
        if (editando) {
            try {
                const respuesta = await fetch('http://localhost:8888/usuarios/descripcion', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_echohead: id_echohead, nuevaDescripcion: descripcion })
                });
                const data = await respuesta.json();
                console.log("Respuesta del servidor:", data.mensaje);

                const respuestaArtistas= await fetch('http://localhost:8888/usuarios/artistas', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_echohead: id_echohead, artistas: artistasFavs })
                });
                const dataArtistas = await respuestaArtistas.json();
                console.log("Respuesta del servidor para artistas:", dataArtistas.mensaje);

                const respuestaAlbumes= await fetch('http://localhost:8888/usuarios/albumes', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_echohead: id_echohead, albumes: albumesFavs })
                });
                const dataAlbumes = await respuestaAlbumes.json();
                console.log("Respuesta del servidor para álbumes:", dataAlbumes.mensaje);

                const respuestaCanciones= await fetch('http://localhost:8888/usuarios/canciones', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_echohead: id_echohead, canciones: cancionesFavs })
                });
                const dataCanciones = await respuestaCanciones.json();
                console.log("Respuesta del servidor para canciones:", dataCanciones.mensaje);

            } catch (error) {
                console.error("No se pudo guardar la descripción:", error);
            }
        }
        setEditando(!editando);
    };

    const [cancionesMes, setCancionesMes] = useState([]);
    const [artistasMes, setArtistasMes] = useState([]);
    const [albumesMes, setAlbumesMes] = useState([]);

    /* =======================================================
       BLOQUE DE SPOTIFY APAGADO POR EL ERROR 429 
       YA CORREGIDO CON USE EFFECT PARA LOS ÁLBUMES
       ======================================================= */
    /*
    useEffect(() => {
        if (tokenSpotify) {
            fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=3', {
                headers: { 'Authorization': `Bearer ${tokenSpotify}` }
            })
            .then(res => res.json())
            .then(data => {
                if (!data.error && data.items) setCancionesMes(data.items);
            })
            .catch(error => console.error("Error al obtener canciones del mes:", error));
        }
    }, [tokenSpotify]);

    useEffect(() => {
        if (tokenSpotify) {
            fetch('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=3', {
                headers: { 'Authorization': `Bearer ${tokenSpotify}` }
            })
            .then(res => res.json())
            .then(data => {
                if (!data.error && data.items) setArtistasMes(data.items);
            })
            .catch(error => console.error("Error al obtener artistas del mes:", error));
        }
    }, [tokenSpotify]);

    useEffect(() => {
        if (tokenSpotify) {
            fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50', {
                headers: { 'Authorization': `Bearer ${tokenSpotify}` }
            })
            .then(res => {
                if (!res.ok) throw new Error(`¡Error HTTP! Estado: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.items) {
                    const conteoAlbumes = {};
                    data.items.forEach(cancion => {
                        const album = cancion.album;
                        if (album.album_type === "ALBUM" || album.album_type === "album") {
                            if (!conteoAlbumes[album.id]) {
                                conteoAlbumes[album.id] = {
                                    id: album.id,
                                    albumName: album.name,
                                    albumImage: album.images[0]?.url,
                                    puntos: 0
                                };
                            }
                            conteoAlbumes[album.id].puntos += 1;
                        }
                    });
                    const top3Albumes = Object.values(conteoAlbumes)
                        .sort((a, b) => b.puntos - a.puntos) 
                        .slice(0, 3); 
                    setAlbumesMes(top3Albumes);
                }
            })
            .catch(error => console.error("Error al deducir top álbumes:", error));
        }
    }, [tokenSpotify]);
    */

    return (
    <div className="pagina-perfil">
        <Navbar username={username} fotoPerfil={fotoPerfil} />

        <section className="contenedor-tarjeta">
            <div className="tarjeta-perfil">
                <div className="perfil-izquierda">
                    <img src={fotoPerfil} alt="foto de perfil" className="foto-grande" />
                </div>
                <div className="perfil-centro">
                    <h2 className="nombre-usuario">{username}</h2>
                    {editando ? (
                        <textarea
                            className="descripcion-editable"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                    ) : (
                        <p className="descripcion">{descripcion}</p>
                    )}
                    <div className="estadisticas">
                        <div className="stat">
                            <span className="stat-num">#28</span>
                            <span className="stat-label">Albums</span>
                        </div>
                        <div className="linea-vertical"></div> 
                        <div className="stat">
                            <span className="stat-num">#234</span>
                            <span className="stat-label">Canciones</span>
                        </div>
                    </div>
                </div>
                <div className="perfil-derecha">
                    <button className="btn-editar" onClick={guardarCambios}>
                        {editando ? "Guardar" : "Editar Perfil"}
                    </button>
                </div>
            </div>
        </section>

        <div className="menu-perfil">
            <div className="apartados">
                <a href="">Albumes</a>
                <a href="">Canciones</a>
                <a href="">Favoritos</a>
                <a href="">Reseñas</a>
                <a href="">Pendientes</a>
                <a href="">Amigos</a>
            </div>
        </div>

        <section className="artistas-favs">
            <h2 className="topArtistasTitle">Top Artistas</h2>
            <div className="contenedor-artistasfavs">
                {artistasFavs.map((artista) => (
                    <div className='cuadro-artistafav' key={artista.id}>
                        {editando && (
                            <button className="btn-eliminar" onClick={() => borrarArtista(artista.id)}>
                                <img src={btneliminar} alt="Eliminar" className="icono-eliminar"/>
                            </button>
                        )}
                        <img src={artista.artistImg} alt="" className="imagen-artista"/>
                        <p className="artista-name">{artista.artistName}</p>
                    </div>
                ))}
                {editando && artistasFavs.length <5 && (
                    <div className='cuadro-artistafav agregar' onClick={() => setMostrarModalArtista(true)}>
                        <img src={btnagregar} alt="Agregar" className="icono-agregar"/>
                        <p className="artista-name">Agregar Artista</p>
                    </div>
                )}
            </div>
        </section>

        {mostrarModalArtista && (
            <div className="modal-artista">
                <div className="modal-contenido">
                    <h2>Agregar Nuevo Artista</h2>
                    <input type="text" placeholder="Nombre del artista" className="input-modal" onChange={(e) => buscarArtista(e.target.value)}/>
                    <button className="btn-cancelar" onClick={() => setMostrarModalArtista(false)}>Cancelar</button>
                </div>
                <div className="modal-resultados">
                    {resultadosBusqueda.map((artista) => (
                        <div 
                            key={artista.id} 
                            className="resultado-item" 
                            onClick={() => {
                                if (artistasFavs.length >= 5) {
                                     alert("¡Ya tienes tus 5 artistas top seleccionados!");
                                     setMostrarModalArtista(false);
                                     setResultadosBusqueda([]);
                                     return;
                                }
                                const nuevoArtista = {
                                    id: artista.id,
                                    artistImg: artista?.images?.[0]?.url || "https://placehold.co/300x300?text=Sin+Foto",
                                    artistName: artista.name
                                };
                                setArtistasFavs([...artistasFavs, nuevoArtista]);
                                setMostrarModalArtista(false);
                                setResultadosBusqueda([]);
                            }}
                        >
                            <img src={artista?.images?.[2]?.url || artista?.images?.[0]?.url || "https://placehold.co/40x40?text=+"} alt="foto" className="img-miniatura" />
                            <div className="info-resultado">
                                <p className="nombre-res">{artista.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <section className="albumes-favs-seccion">
            <h2 className="topAlbumesTitle">Top Álbumes</h2>
            <div className="contenedor-albumesfavs">
                {albumesFavs.map((album) => (
                    <div className='cuadro-albumfav' key={album.id}>
                        {editando && (
                            <button className="btn-eliminar" onClick={() => borrarAlbum(album.id)}>
                                <img src={btneliminar} alt="Eliminar" className="icono-eliminar"/>
                            </button>
                        )}
                        <img src={album.albumImg} alt="" className="imagen-album"/>
                        <p className="album-name">{album.albumName}</p>
                    </div>
                ))}
                {editando && albumesFavs.length <5 && (
                    <div className='cuadro-albumfav agregar' onClick={() => setMostrarModalAlbum(true)}>
                        <img src={btnagregar} alt="Agregar" className="icono-agregar"/>
                        <p className="album-name">Agregar Álbum</p>
                    </div>
                )}
            </div>
        </section>

        {mostrarModalAlbum && (
            <div className="modal-album">
                <div className="modal-contenido">
                    <h2>Agregar Nuevo Álbum</h2>
                    <input type="text" placeholder="Nombre del álbum" className="input-modal" onChange={(e) => buscarAlbum(e.target.value)}/>
                    <button className="btn-cancelar" onClick={() => setMostrarModalAlbum(false)}>Cancelar</button>
                </div>
                <div className="modal-resultados">
                    {resultadosBusqueda.map((album) => (
                        <div 
                            key={album.id} 
                            className="resultado-item" 
                            onClick={() => {
                                const nuevoAlbum = {
                                    id: album.id,
                                    albumImg: album.images[0]?.url,
                                    albumName: album.name
                                };
                                setAlbumesFavs([...albumesFavs, nuevoAlbum]);
                                setMostrarModalAlbum(false);
                                setResultadosBusqueda([]);
                            }}
                        >
                            <img src={album.images[2]?.url} alt="portada" className="img-miniatura" />
                            <div className="info-resultado">
                                <p className="nombre-res">{album.name}</p>
                                <p className="artista-res">{album.artists[0].name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <section className="canciones-favs-seccion">
            <h2 className="topCancionesTitle">Top Canciones</h2>
            <div className="contenedor-cancionesfavs">
                {cancionesFavs.map((cancion) => (
                    <div className='cuadro-cancionfav' key={cancion.id}>
                        {editando && (
                            <button className="btn-eliminar" onClick={() => borrarCancion(cancion.id)}>
                                <img src={btneliminar} alt="Eliminar" className="icono-eliminar"/>
                            </button>
                        )}
                        <img src={cancion.cancionImg} alt="" className="imagen-cancion"/>
                        <p className="cancion-name">{cancion.cancionName}</p>
                    </div>
                ))}
                {editando && cancionesFavs.length <5 && (
                    <div className='cuadro-cancionfav agregar' onClick={() => setMostrarModalCancion(true)}>
                        <img src={btnagregar} alt="Agregar" className="icono-agregar"/>
                        <p className="cancion-name">Agregar Canción</p>
                    </div>
                )}
            </div>
        </section>

        {mostrarModalCancion && (
            <div className="modal-cancion">
                <div className="modal-contenido">
                    <h2>Agregar Nueva Canción</h2>
                    <input type="text" placeholder="Nombre de la canción" className="input-modal" onChange={(e) => buscarCancion(e.target.value)}/>
                    <button className="btn-cancelar" onClick={() => setMostrarModalCancion(false)}>Cancelar</button>
                </div>
                <div className="modal-resultados">
                    {resultadosBusqueda.map((track) => (
                        <div 
                            key={track.id} 
                            className="resultado-item" 
                            onClick={() => {
                                const nuevaCancion = {
                                    id: track.id,
                                    cancionImg: track.album.images[0]?.url,
                                    cancionName: track.name
                                };
                                setCancionesFavs([...cancionesFavs, nuevaCancion]);
                                setMostrarModalCancion(false);
                                setResultadosBusqueda([]);
                            }}
                        >
                            <img src={track.album.images[2]?.url} alt="portada" className="img-miniatura" />
                            <div className="info-resultado">
                                <p className="nombre-res">{track.name}</p>
                                <p className="artista-res">{track.artists[0].name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* BUCLES (Sin datos por ahora mientras está en modo Desarrollo) */}
        <section className="bucle-mes-usuario">
            <h2 className="bucleMesTitle">Tu mes en bucle</h2>
            <div className="bucle-layout">
                <div className="contenedor-bucle-gris">
                    {cancionesMes.map((cancion) => (
                        <div className="cuadro-bucle" key={cancion.id}>
                            <img src={cancion.album.images[0]?.url} alt="" className="imagen-bucle"/>
                            <hr className="linea-bucle" />
                            <p className="cancion-bucle">{cancion.name}</p>
                        </div>
                    ))}
                </div>
                <div className="bucle-derecha">
                    <h3 className="bucle-categoria-titulo">Top Canciones</h3>
                    <img src={viniloImg} alt="Icono" className="icono-bucle" />
                </div>
            </div>
        </section>

        <section className="bucle-mes-usuario">
            <div className="bucle-layout">
                <div className="contenedor-bucle-gris">
                    {artistasMes.map((artista) => (
                        <div className="cuadro-bucle" key={artista.id}>
                            <img src={artista.images[0]?.url} alt="" className="imagen-bucle-artist"/>
                            <hr className="linea-bucle" />
                            <p className="cancion-bucle">{artista.name}</p>
                        </div>
                    ))}
                </div>
                <div className="bucle-derecha">
                    <h3 className="bucle-categoria-titulo">Top Artistas</h3>
                    <img src={artistImg} alt="Icono" className="icono-bucle" />
                </div>
            </div>
        </section>

        <section className="bucle-mes-usuario">
            <div className="bucle-layout">
                <div className="contenedor-bucle-gris">
                    {albumesMes.map((album) => (
                        <div className="cuadro-bucle" key={album.id}>
                            <img src={album.albumImage} alt={album.albumName} className="imagen-bucle" />
                            <hr className="linea-bucle" />
                            <p className="cancion-bucle">
                                {album.albumName}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="bucle-derecha">
                    <h3 className="bucle-categoria-titulo">Top Álbumes</h3>
                    <img src={viniloImg} alt="Icono" className="icono-bucle" />
                </div>
            </div>
        </section>

    </div>
    );
}

export default Perfil;