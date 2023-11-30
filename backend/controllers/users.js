const bcrypt = require('bcryptjs');

const { NODE_ENV, JWT_SECRET } = process.env;
const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const NotAuthoirizedError = require('../errors/NotAuthoirizedError');

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => next(err));

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

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotValiId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValiId') {
        next(new NotFoundError('полльзователь не найден'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('некорректный id пользователя'));
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      }
      next(err);
    });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    next(new NotAuthoirizedError('Неправильные почта или пароль'));
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    next(new NotAuthoirizedError('Неправильные почта или пароль'));
  }

  const payload = { _id: user._id };

  const token = JWT.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'cheburashka', { expiresIn: '7d' });
  return res.status(200).send({ token });
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new NotFoundError('User not found'));
    }

    res.status(200).send(user);
  } catch (err) {
    next(err);
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
