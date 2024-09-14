const express = require('express');
const router = express.Router();
console.log("Starting mainRoutes");

const userRoutes = require('../routes/userRoutes');
const questionRoutes = require('../routes/questionsRoutes');
const questRoutes = require('../routes/questRoutes');
const classRoutes = require('../routes/classRoutes');
const spellRoutes = require('../routes/spellRoutes');
const customizationRoutes = require('../routes/customizationRoutes');
const gameUserRoutes = require('../routes/gameUserRoutes'); 

// Route to handle user-related operations
router.use("/users", userRoutes);

// Route to handle question-related operations
router.use("/questions", questionRoutes);

// Route to handle quest-related operations
router.use("/quests", questRoutes);

// Route to handle class-related operations
router.use("/classes", classRoutes);

// Route to handle spell-related operations
router.use("/spells", spellRoutes);

// Route to handle character customization-related operations
router.use("/customization", customizationRoutes);

// Route to handle game user-related operations
router.use("/gameuser", gameUserRoutes);

module.exports = router;
