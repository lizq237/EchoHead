CREATE TABLE users (
    id_echohead SERIAL primary key,
    spotify_id varchar (255) unique not null,
    email varchar (255) unique,
    nombre varchar (100),
    foto_perfil text,
    created_at timestamp default current_timestamp,
    descripcion varchar (255)
);

CREATE TABLE top_artistas(
    id SERIAL primary key,
    user_id integer references users (id_echohead) on delete cascade,
    artist_spotify_id varchar (255) not null, -- Sin unique
    artist_name varchar (255) not null,
    artist_img text,
    created_at timestamp default current_timestamp,
    UNIQUE (user_id, artist_spotify_id) 
);

CREATE TABLE top_albumes(
    id SERIAL primary key,
    user_id integer references users (id_echohead) on delete cascade,
    album_spotify_id varchar (255) not null, -- Sin unique
    album_name varchar (255) not null,
    album_img text,
    created_at timestamp default current_timestamp,
    UNIQUE (user_id, album_spotify_id)
);

CREATE TABLE top_canciones(
    id SERIAL primary key,
    user_id integer references users (id_echohead) on delete cascade,
    song_spotify_id varchar (255) not null, -- Sin unique
    song_name varchar (255) not null,
    song_img text,
    created_at timestamp default current_timestamp,
    UNIQUE (user_id, song_spotify_id)
);


CREATE TABLE interacciones (
    id SERIAL primary key, --id de la interaccion
    id_echohead integer references users (id_echohead) on delete cascade, --id del usuario que hizo la interaccion
    spotify_id varchar (50) not null, --el que te da spotify 
    tipo varchar (10) not null , --song o album
    nombre Varchar (255) not null, --de la cancion o del album
    artista Varchar (255) not null, --del dueño de la cancion o album
    imagen_url Text not null, -- de la cancion o album
    es_escuchado Boolean default false, -- boton de la palomita
    es_favorito Boolean default false, -- boton del corazon
    es_pendiente Boolean default false, --boton de agregar a pendientes
    calificacion int check (calificacion >=0 AND calificacion<=5), --estrellas, puede ser null si no le pica
    descripcion text, --texto de la resena, puede ser null
    fecha_interaccion timestamp default current_timestamp,
    UNIQUE (id_echohead, spotify_id)

)


