const express = require('express');
const router = express.Router();
const questController = require('../controllers/questController');
console.log("Starting questRoutes");

// POST /quests - Create a new quest
router.post('/', questController.createQuest);
// GET /quests - Retrieve all quests
router.get('/', questController.getAllQuests);
// POST /quests/:quest_id/start - Start a quest
router.post('/:quest_id/start', questController.startQuest);
// POST /quests/:quest_id/complete - Complete a quest
router.post('/:quest_id/complete', questController.completeQuest);



module.exports = router;
