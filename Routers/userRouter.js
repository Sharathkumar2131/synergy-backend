const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');

router.get('/', usersController.getChaList);
router.get('/:chaId', usersController.getChaById);
router.put('/:chaId', usersController.updateCha);

module.exports = router;
