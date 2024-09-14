const express = require('express');
const router = express.Router();
const gameUserController = require('../controllers/gameUserController');

// POST /gameUser - Create a new gameUser
router.post('/', gameUserController.createGameUser);

// GET /gameUser - Retrieve all gameUsers
router.get('/', gameUserController.getAllGameUsers);

// PUT /gameUser/:user_id - Update gameUser details
router.put('/:user_id', gameUserController.updateGameUser);
module.exports = router;
