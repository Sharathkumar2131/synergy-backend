const express = require('express');
const router = express.Router();
const usersController = require('../controllers/serviceTypesController');

// router.post('/add', usersController.addCha);
router.get('/', usersController.getServiceTypes);
router.get('/:id', usersController.getServiceTypesById);
router.put('/:id', usersController.updateServiceTypesById);

module.exports = router;
