const express = require('express');
const router = express.Router();
const spellsController = require('../controllers/spellsController'); // Adjust path to your controller
const auth = require('../middleware/auth');

// Route to create a new spell
router.post('/spells', auth, spellsController.createSpell);

// Route to get all spells or spells by user ID
router.get('/spells', auth,spellsController.getSpells);

// Route to update a spell by ID
router.put('/spells/:id', auth, spellsController.updateSpell);

// Route to delete a spell by ID
router.delete('/spells/:id', auth,spellsController.deleteSpell);

module.exports = router;
