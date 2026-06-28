require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const querystring = require('querystring'); 
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log('🔥 Conectado exitosamente a PostgreSQL (EchoHead Local)'))
  .catch(err => console.error('❌ Error conectando a la base de datos', err.stack));

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;

// --- RUTAS DE SPOTIFY ---
app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email user-top-read playlist-read-private user-library-read user-read-currently-playing user-read-playback-state user-modify-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      show_dialog: true
    }));
});

app.post('/intercambiar-token', async (req, res) => {
  const code = req.body.code; 
  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
      }).toString(),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error de Spotify:", error.response?.data || error.message);
    res.status(400).json({ error: 'No se pudo intercambiar el token' });
  }
});

app.post('/usuarios/sync', async (req, res) => {
  const { spotify_id, email, nombre, foto_perfil } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (spotify_id, email, nombre, foto_perfil)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (spotify_id) 
       DO UPDATE SET 
         nombre = EXCLUDED.nombre,
         foto_perfil = EXCLUDED.foto_perfil,
         email = EXCLUDED.email
       RETURNING *;`,
      [spotify_id, email, nombre, foto_perfil]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error guardando usuario en DB:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// --- RUTAS DE PERFIL ---
app.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query('SELECT * FROM users WHERE id_echohead = $1', [id]);
        if (resultado.rows.length > 0) {
            res.json(resultado.rows[0]); 
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al traer usuario:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

app.put('/usuarios/descripcion', async (req, res) => {
  const { id_echohead, nuevaDescripcion } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET descripcion = $1 WHERE id_echohead = $2 RETURNING *',
      [nuevaDescripcion, id_echohead]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ mensaje: "Descripción actualizada en PostgreSQL", usuario: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando descripción en DB:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// --- 🛡️ RUTAS BLINDADAS CONTRA DUPLICADOS (Artistas, Álbumes, Canciones) ---

app.put('/usuarios/artistas', async (req, res) => {
  const { id_echohead, artistas } = req.body;
  try {
    await pool.query("DELETE FROM top_artistas WHERE user_id = $1", [id_echohead]);
    for (let artista of artistas) {
      await pool.query(
        `INSERT INTO top_artistas (user_id, artist_spotify_id, artist_name, artist_img) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, artist_spotify_id) DO NOTHING`,
        [id_echohead, artista.id, artista.artistName, artista.artistImg]
      );
    }
    res.json({ mensaje: "Artistas actualizados en PostgreSQL" });
  } catch (error) {
    console.error('Error actualizando artistas en DB:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/usuarios/:id/artistas', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await pool.query('SELECT artist_spotify_id, artist_name, artist_img FROM top_artistas WHERE user_id = $1', [id]);
    const artistasMapeados = resultado.rows.map(row => ({
      id: row.artist_spotify_id,
      artistName: row.artist_name,
      artistImg: row.artist_img
    }));
    res.json(artistasMapeados);
  } catch (error) {
    console.error("Error al traer artistas:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.put('/usuarios/albumes', async (req, res) => {
  const { id_echohead, albumes } = req.body;
  try {
    await pool.query("DELETE FROM top_albumes WHERE user_id = $1", [id_echohead]);
    for (let album of albumes) {
      await pool.query(
        `INSERT INTO top_albumes (user_id, album_spotify_id, album_name, album_img) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, album_spotify_id) DO NOTHING`,
        [id_echohead, album.id, album.albumName, album.albumImg]
      );
    }
    res.json({ mensaje: "Albumes actualizados en PostgreSQL" });
  } catch (error) {
    console.error('Error actualizando albumes en DB:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/usuarios/:id/albumes', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await pool.query('SELECT album_spotify_id, album_name, album_img FROM top_albumes WHERE user_id = $1', [id]);
    const albumesMapeados = resultado.rows.map(row => ({
      id: row.album_spotify_id,
      albumName: row.album_name,
      albumImg: row.album_img
    }));
    res.json(albumesMapeados);
  } catch (error) {
    console.error("Error al traer albumes:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.put('/usuarios/canciones', async (req, res) => {
  const { id_echohead, canciones } = req.body;
  try {
    await pool.query("DELETE FROM top_canciones WHERE user_id = $1", [id_echohead]);
    for (let cancion of canciones) {
      await pool.query(
        `INSERT INTO top_canciones (user_id, song_spotify_id, song_name, song_img) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, song_spotify_id) DO NOTHING`,
        [id_echohead, cancion.id, cancion.cancionName, cancion.cancionImg]
      );
    }
    res.json({ mensaje: "Canciones actualizadas en PostgreSQL" });
  } catch (error) {
    console.error('Error actualizando canciones en DB:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/usuarios/:id/canciones', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await pool.query('SELECT song_spotify_id, song_name, song_img FROM top_canciones WHERE user_id = $1', [id]);
    const cancionesMapeados = resultado.rows.map(row => ({
      id: row.song_spotify_id,
      cancionName: row.song_name,
      cancionImg: row.song_img
    }));
    res.json(cancionesMapeados);
  } catch (error) {
    console.error("Error al traer canciones:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// --- RUTAS DE INTERACCIONES (Corazones y Checks) ---
app.post('/usuarios/interacciones', async (req, res) => {
    const { 
        id_echohead, spotify_id, tipo, nombre, artista, imagen_url, 
        es_escuchado, es_favorito, es_pendiente, calificacion, descripcion 
    } = req.body;

    try {
        const query = `
        INSERT INTO interacciones (
            id_echohead, spotify_id, tipo, nombre, artista, imagen_url, 
            es_escuchado, es_favorito, es_pendiente, calificacion, descripcion
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id_echohead, spotify_id) 
        DO UPDATE SET 
            es_escuchado = EXCLUDED.es_escuchado,
            es_favorito = EXCLUDED.es_favorito,
            nombre = EXCLUDED.nombre,
            artista = EXCLUDED.artista,
            imagen_url = EXCLUDED.imagen_url,
            es_pendiente = EXCLUDED.es_pendiente,
            calificacion = EXCLUDED.calificacion,
            descripcion = EXCLUDED.descripcion,
            fecha_interaccion = CURRENT_TIMESTAMP;
    `;

        const values = [
            id_echohead, spotify_id, tipo, nombre, artista, imagen_url, 
            es_escuchado ?? false,
            es_favorito ?? false,
            es_pendiente || false, 
            calificacion || null, 
            descripcion || null
        ];

        console.log("DEBUG - Datos a guardar en BD:", {
          spotify_id: spotify_id,
          es_escuchado: es_escuchado,
          es_favorito: es_favorito
        });
        await pool.query(query, values);
        
        res.status(200).json({ mensaje: "¡Interacción guardada con éxito en la BD!" });

    } catch (error) {
        console.error("Error al guardar la interacción:", error);
        res.status(500).json({ error: "Error interno del servidor al guardar" });
    }
});


// 1. RUTA PARA JALAR LOS ÁLBUMES DEL PERFIL TRADUCIDOS PARA REACT
app.get('/api/perfil/:id_echohead/albumes', async (req, res) => {
    const { id_echohead } = req.params;
    try {
        const query = `
            SELECT a.*, i.es_favorito, i.es_escuchado
            FROM top_albumes a
            LEFT JOIN interacciones i 
                ON a.album_spotify_id = i.spotify_id AND a.user_id = i.id_echohead
            WHERE a.user_id = $1;
        `;
        const resultado = await pool.query(query, [id_echohead]);
        
        // 👇 MAPEO: Traducimos de SQL a React para que no se envíen vacíos al guardar
        const albumesMapeados = resultado.rows.map(row => ({
            id: row.album_spotify_id,
            albumName: row.album_name,
            albumImg: row.album_img,
            es_favorito: row.es_favorito === true,
            es_escuchado: row.es_escuchado === true
        }));
        
        res.json(albumesMapeados);
    } catch (error) {
        console.error("Error al obtener álbumes con interacciones:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});


// 2. RUTA PARA JALAR LAS CANCIONES DEL PERFIL TRADUCIDAS PARA REACT
app.get('/api/perfil/:id_echohead/canciones', async (req, res) => {
    const { id_echohead } = req.params;
    try {
        const query = `
            SELECT c.*, i.es_favorito, i.es_escuchado
            FROM top_canciones c
            LEFT JOIN interacciones i 
                ON c.song_spotify_id = i.spotify_id AND c.user_id = i.id_echohead
            WHERE c.user_id = $1;
        `;
        const resultado = await pool.query(query, [id_echohead]);
        
        // 👇 MAPEO: Traducimos de SQL a React
        const cancionesMapeadas = resultado.rows.map(row => ({
            id: row.song_spotify_id,
            cancionName: row.song_name,
            cancionImg: row.song_img,
            es_favorito: row.es_favorito === true,
            es_escuchado: row.es_escuchado === true
        }));
        
        res.json(cancionesMapeadas);
    } catch (error) {
        console.error("Error al obtener canciones con interacciones:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});


app.get('/api/interacciones/:id_echohead', async (req, res) => {
    const { id_echohead } = req.params;
    try {
        const resultado = await pool.query('SELECT spotify_id, es_escuchado, es_favorito FROM interacciones WHERE id_echohead = $1', [id_echohead]);
        res.json(resultado.rows);
    } catch (error) {
        console.error("Error al obtener todas las interacciones:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

const PORT = 8888;
app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});