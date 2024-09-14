// Initialize express router
const express = require('express');
// Define router
const router = express.Router();
console.log("Starting UserRoutes");

// define routes
const userController = require('../controllers/userController');

// Define router
// POST /users - Create a new user
router.post('/', userController.createUser);

// GET /users - Retrieve a list of all users
router.get('/', userController.getAllUsers);

// GET /users/:user_id - Retrieve details of a specific user
router.get('/:user_id', userController.getUserById);

// PUT /users/:user_id - Update user details
router.put('/:user_id', userController.updateUser);

// Export router
module.exports = router;
