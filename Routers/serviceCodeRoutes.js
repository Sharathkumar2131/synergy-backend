const express = require('express');
const router = express.Router();
const usersController = require('../controllers/ServiceCodesController');

// router.post('/add', usersController.addCha);
router.get('/', usersController.getServiceCodes);
router.get('/:id', usersController.getServiceCodesById);
router.put('/:id', usersController.updateServiceCodesById);

module.exports = router;
