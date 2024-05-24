const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');

// router.post('/add', usersController.addCha);
router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);
router.get('/', usersController.getUserByCredentials);
router.put('/:id', usersController.updateUserById);

module.exports = router;
