require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const querystring = require('querystring'); 

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/login', (req, res) => {
  // Pedimos permiso para leer el top de artistas/canciones del usuario
  const scope = 'user-top-read user-read-private user-read-email';
  
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
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

const PORT = 8888;
app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});