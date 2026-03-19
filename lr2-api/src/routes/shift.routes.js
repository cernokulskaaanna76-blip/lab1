const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shift.controller');

// Використовуємо імена методів точно як у твоєму ShiftController
router.get('/', shiftController.getAll);
router.get('/:id', shiftController.getById);
router.post('/', shiftController.create);
router.put('/:id', shiftController.update);
router.delete('/:id', shiftController.delete);

module.exports = router;