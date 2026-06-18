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

