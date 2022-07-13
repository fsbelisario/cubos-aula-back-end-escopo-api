const knex = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const enroll = async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(404).json('O campo Nome de Usuário é obrigatório.');
  };

  if (!password) {
    return res.status(404).json('O campo Senha é obrigatório.');
  };

  try {
    const userValidation = await knex('users').where({ username: username.toLowerCase() }).first();

    if (!!userValidation) {
      return res.status(400).json('O Nome de Usuário já existe.');
    };

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await knex('users').insert({ username: username.toLowerCase(), password: encryptedPassword }).returning('*');

    if (!user) {
      return res.status(400).json('O usuário não foi cadastrado.');
    };

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error.message);
  };
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json('Os campos Nome de Usuário e Senha são obrigatórios.');
  };

  try {
    const userValidation = await knex('users').where({ username: username.toLowerCase() }).first();

    if (!userValidation) {
      return res.status(400).json('O usuario não foi encontrado.');
    };

    const user = userValidation;

    const passwordValidation = await bcrypt.compare(password, user.password);

    if (!passwordValidation) {
      return res.status(400).json('Email e/ou senha não conferem.');
    };

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '2h' });

    const { password: _, ...userData } = user;

    return res.status(200).json({
      user: userData,
      token
    });
  } catch (error) {
    return res.status(400).json(error.message);
  };
};

const getProfile = async (req, res) => {
  return res.status(200).json(req.user);
};

const updateProfile = async (req, res) => {
  const { name, image, username, email, website, bio, phone, gender, password, verified_profile } = req.body;

  if (!name && !image && !username && !email && !website && !bio && !phone && !gender && !password && !verified_profile) {
    return res.status(404).json('É obrigatório informar ao menos um campo para atualização.');
  };

  try {
    const body = {};

    if (name) {
      body.name = name;
    };

    if (image) {
      body.image = image;
    };

    if (username) {
      if (username !== req.user.username) {
        const userValidation = await knex('users').where({ username }).first();

        if (!!userValidation) {
          return res.status(400).json('O nome de usuário já existe.');
        };
      };

      body.username = username;
    };

    if (email) {
      if (email !== req.user.email) {
        const userValidation = await knex('users').where({ email }).first();

        if (!!userValidation) {
          return res.status(400).json('O email já existe.');
        };
      };

      body.email = email;
    };

    if (website) {
      body.website = website;
    };

    if (bio) {
      body.bio = bio;
    };

    if (phone) {
      body.phone = phone;
    };

    if (gender) {
      body.gender = gender;
    };

    if (password) {
      body.password = await bcrypt.hash(password, 10);
    };

    if (verified_profile) {
      body.verified_profile = verified_profile;
    };

    const id = req.user.id;

    const updateUser = await knex('users').update(body).where({ id }).returning('*');

    if (!updateUser) {
      return res.status(400).json('O usuario não foi atualizado.');
    };

    return res.status(200).json('Usuario foi atualizado com sucesso.');
  } catch (error) {
    return res.status(400).json(error.message);
  };
};

module.exports = {
  enroll,
  login,
  getProfile,
  updateProfile
};