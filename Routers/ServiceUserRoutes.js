const express = require('express');
const router = express.Router();
const userService = require('../controllers/ServiceUserController');

// Create a new user
router.post('/serviceusers', userService.createUser);

// Get all users
router.get('/serviceusers', userService.getUsers);

// Get user by ID
router.get('/serviceusers/:id', userService.getUserById);

// Update user by ID
router.put('/serviceusers/:id', userService.updateUserById);

// Delete user by ID
router.delete('/serviceusers/:id', userService.deleteUserById);

module.exports = router;
