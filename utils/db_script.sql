CREATE DATABASE "mini_insta";

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  image TEXT,
  username TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  website TEXT,
  bio TEXT,
  phone TEXT,
  gender TEXT,
  password TEXT NOT NULL,
  verified_profile BOOLEAN DEFAULT FALSE
);

DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  post_text TEXT,
  date TIMESTAMPTZ DEFAULT NOW()
);

DROP TABLE IF EXISTS post_pictures;
CREATE TABLE post_pictures (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL REFERENCES posts(id),
  picture TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW()
);

DROP TABLE IF EXISTS post_comments;
CREATE TABLE post_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  comment TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW()
);

DROP TABLE IF EXISTS post_likes;
CREATE TABLE post_likes (
  post_id INT NOT NULL REFERENCES posts(id),
  user_id INT NOT NULL REFERENCES users(id),
  date TIMESTAMPTZ DEFAULT NOW()
);