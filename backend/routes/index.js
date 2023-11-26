const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/', userRoutes);
router.use('/', cardRoutes);
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
router.use('*', (req, res) => res.status(404).send({ message: 'page not found' }));

module.exports = router;
