const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const authorization = require('../middlewares/auth');
const { URL_REGEX } = require('../utils/constants');

const {
  getCards, createCard, deleteCardById, likeCard, removeLike,
} = require('../controllers/cards');

router.get('/cards', authorization, getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URL_REGEX),
  }),
}), authorization, createCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}), authorization, deleteCardById);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}), authorization, likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}), authorization, removeLike);

module.exports = router;
