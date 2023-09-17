const toysController = require('../controllers/ToysController');
const isValidId = require('../middlewares/isValidId');

const toysRoutes = require('express').Router();

// Add
toysRoutes.post(
  '/toys',
  (req, res, next) => {
    console.log('Joi');
    next();
  },
  toysController.create
);

// Get All
toysRoutes.get('/toys', toysController.findAll);

// Get One
toysRoutes.get('/toys/:id', isValidId, toysController.findOne);

// Update
toysRoutes.put('/toys/:id', isValidId, toysController.update);
// Remove
toysRoutes.delete('/toys/:id', isValidId, toysController.remove);

module.exports = toysRoutes;
