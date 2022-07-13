const knex = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const enroll = async (req, res) => {
  const { id } = req.user;
  const { post_text, pictures } = req.body;

  if (!pictures || pictures.length === 0) {
    return res.status(404).json('É obrigatório incluir ao menos 1 imagem.');
  };

  try {
    let body = {};

    body.user_id = id;

    if (post_text) {
      body.post_text = post_text;
    };

    const post = await knex('posts').insert(body).returning('*');

    if (!post) {
      return res.status(400).json('A postagem não foi incluída.');
    };

    pictures.forEach(picture => {
      picture.post_id = post[0].id;
    });

    const postPictures = await knex('post_pictures').insert(pictures).returning('*');

    if (!postPictures) {
      await knex('posts').where({ id: post[0].id }).del();
      return res.status(400).json('A postagem não foi incluída.');
    };

    return res.status(200).json('Postagem realizada com sucesso.');
  } catch (error) {
    return res.status(400).json(error.message);
  };
};

const like = async (req, res) => {
  const { id } = req.user;
  const { postId } = req.params;

  try {
    const postValidation = await knex('posts').where({ id: postId }).first();

    if (!postValidation) {
      return res.status(400).json('A postagem informada não existe.');
    };

    const verifyLike = await knex('post_likes').where({ post_id: postId, user_id: id }).first();

    if (verifyLike) {
      return res.status(400).json('A postagem já foi curtida pelo usuário.');
    };

    const likePost = await knex('post_likes').insert({ post_id: postId, user_id: id }).returning('*');

    if (!likePost) {
      return res.status(400).json('A curtida não foi registrada.');
    };

    return res.status(200).json('Curtida registrada com sucesso.');
  } catch (error) {
    return res.status(400).json(error.message);
  };
};

const comment = async (req, res) => {
  const { id } = req.user;
  const { postId } = req.params;
  const { comment } = req.body;

  if (!comment) {
    return res.status(404).json('O campo Comentário é obrigatório.');
  };

  try {
    const postValidation = await knex('posts').where({ id: postId }).first();

    if (!postValidation) {
      return res.status(400).json('A postagem informada não existe.');
    };

    const commentPost = await knex('post_comments').insert({ post_id: postId, user_id: id, comment }).returning('*');

    if (!commentPost) {
      return res.status(400).json('O comentário não foi registrado.');
    };

    return res.status(200).json('Comentário registrado com sucesso.');
  } catch (error) {
    return res.status(400).json(error.message);
  };
};

const list = async (req, res) => {
  const { id } = req.user;
  let { offset } = req.query;

  const page = offset ? offset : 0;

  try {
    const feed = await knex('posts').whereNot({ user_id: id }).limit(10).offset(page);

    if (feed.length === 0) {
      return res.status(200).json(feed);
    };

    for (const post of feed) {
      const user = await knex('users').select('image', 'username', 'verified_profile').where({ id: post.user_id }).first();
      post.user = user;

      const pictures = await knex('post_pictures').select('picture').where({ post_id: post.id });
      post.pictures = pictures;

      const likes = await knex('post_likes').where({ post_id: post.id });
      post.likes = likes.length;

      const likedByUser = await knex('post_likes').count('*').where({ post_id: post.id, user_id: id });
      post.likedByUser = likes.find(like => like.user_id === id) ? true : false;

      const comments = await knex('post_comments').
        leftJoin('users', 'users.id', 'post_comments.user_id').
        select('users.username', 'post_comments.comment').where({ post_id: post.id });
      post.comments = comments;
    };

    return res.status(200).json(feed);
  } catch (error) {
    return res.status(400).json(error.message);
  };
};

module.exports = {
  enroll,
  like,
  comment,
  list
};