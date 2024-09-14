const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const auth = require('../middleware/auth');

// API endpoint to create a question
router.post('/questions',auth, questionController.createQuestion);

// API endpoint to fetch all questions
router.get('/questions',auth, questionController.getAllQuestions);

// API endpoint to fetch a question by ID
router.get('/questions/:id',auth, questionController.getQuestionById);

// API endpoint to update a question by ID
router.put('/questions/:id',auth, questionController.updateQuestionById);

// API endpoint to delete a question by ID
router.delete('/questions/:id',auth, questionController.deleteQuestionById);

module.exports = router;
