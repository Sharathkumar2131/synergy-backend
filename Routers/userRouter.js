const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');

router.post('/add', usersController.addCha);
router.get('/', usersController.getChaList);
router.get('/:chaId', usersController.getChaById);
router.put('/:chaId', usersController.updateCha);

module.exports = router;
