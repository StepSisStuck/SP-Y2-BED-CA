// Initialize express router
const express = require('express');
// Define router
const router = express.Router();
console.log("Starting questionsRoutes");

// define routes
const questionController = require('../controllers/questionController');
const answerController = require('../controllers/answerController');


// Define router
// POST /questions - Create a new survey question
router.post('/', questionController.createQuestion);

// GET /questions - Retrieve a list of all questions
router.get('/', questionController.getAllQuestions);

// PUT /questions/:question_id - Update question details
router.put('/:question_id', questionController.updateQuestion);

// DELETE /questions/:question_id - Delete a question
router.delete('/:question_id', questionController.deleteQuestion);

// POST /questions/:question_id/answers - Create an answer from a user
router.post('/:question_id/answers', answerController.createAnswer);

// GET /questions/:question_id/answers - Retrieve answers for a specific question
router.get('/:question_id/answers', answerController.getAnswersByQuestionId);


// export router
module.exports = router;