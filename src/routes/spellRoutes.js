const express = require('express');
const router = express.Router();
const spellController = require('../controllers/spellController');
console.log("Starting spellRoutes");
// POST /spells - Create a new spell
router.post('/', spellController.createSpell);
// GET /spells - Retrieve all spells
router.get('/', spellController.getAllSpells);
// PUT /spells/:spell_id - Update spell details
router.put('/:spell_id', spellController.updateSpell);
// DELETE /spells/:spell_id - Delete a spell
router.delete('/:spell_id', spellController.deleteSpell);
module.exports = router;
