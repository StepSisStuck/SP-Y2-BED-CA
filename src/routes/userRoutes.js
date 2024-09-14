
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Route to fetch all users
router.get('/users',auth, userController.getAllUsers);

// Route to fetch user by ID
router.get('/users/:id', auth, userController.getUserById);

// Route to update username by user ID
router.put('/users',auth, userController.updateUsername);

// Route to delete user by ID
router.delete('/users/:id',auth, userController.deleteUser);

module.exports = router;
