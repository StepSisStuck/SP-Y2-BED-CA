const express = require('express');
const router = express.Router();
const battleController = require('../controllers/battleController');
const auth = require('../middleware/auth');

// Route to handle battles
router.post('/battle', auth, battleController.handleBattle);

module.exports = router;
