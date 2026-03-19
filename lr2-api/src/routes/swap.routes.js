const express = require('express');
const router = express.Router();
const swapController = require('../controllers/swap.controller');

router.get('/', swapController.getAll);

router.get('/:id', swapController.getById);

router.post('/', swapController.create);

router.put('/:id', swapController.update);

router.delete('/:id', swapController.delete);

module.exports = router;