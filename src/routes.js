const express = require('express');
const verifyAuthentication = require('./filters/verifyAuthentication');
const users = require('./controllers/users');
const posts = require('./controllers/posts');

const routes = express();

// Cadastro de usuario
routes.post('/users', users.enroll);

// Login
routes.post('/login', users.login);

// Filtro de autenticação
routes.use(verifyAuthentication);

// Obter e atualizar perfil do usuário logado
routes.get('/profile', users.getProfile);
routes.put('/profile', users.updateProfile);

// Cadastrar nova postagens
routes.post('/posts', posts.enroll);

// Curtir postagem
routes.post('/posts/:postId/like', posts.like);

// Comentar postagem
routes.post('/posts/:postId/comment', posts.comment);

// Obter lista de postagens (feed)
routes.get('/posts', posts.list);

module.exports = routes;