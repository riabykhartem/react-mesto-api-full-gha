const bcrypt = require('bcryptjs');

const { NODE_ENV, JWT_SECRET } = process.env;
const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const NotAuthoirizedError = require('../errors/NotAuthoirizedError');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch(() => res.status(500).send({ message: 'Server Error' }));

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.status(201).send({
      name: user.name, about: user.about, avatar: user.avatar, email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(err.message));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotValiId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValiId') {
        return res.status(404).send({ message: 'user not found' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'incorrect id' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((e) => e.message)
            .join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((e) => e.message)
            .join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new NotAuthoirizedError('Неправильные почта или пароль'));
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return next(new NotAuthoirizedError('Неправильные почта или пароль'));
  }

  const payload = { _id: user._id };

  const token = JWT.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'cheburashka', { expiresIn: '7d' });
  return res.status(200).send({ token });
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
