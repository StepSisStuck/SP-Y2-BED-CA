const Question = require('../models/questionModel');
console.log("Starting questionController");

// Controller function to create a new question
module.exports.createQuestion = (req, res) => {
    const { user_id, question } = req.body;

    // Validate required fields
    if (!user_id || !question) {
        return res.status(400).json({ message: "User ID and question are required" });
    }

    const data = { creator_id: user_id, question };

    // Insert the new question into the database
    Question.insertSingle(data, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        const newQuestion = {
            question_id: result.insertId,
            question,
            creator_id: user_id
        };
        res.status(201).json({ message: "Question created successfully", question: newQuestion });
    });
};

// Controller function to get all questions
module.exports.getAllQuestions = (req, res) => {
    // Retrieve all questions from the database
    Question.findAll((err, questions) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json(questions);
    });
};

// Controller function to update a question
module.exports.updateQuestion = (req, res) => {
    const questionId = req.params.question_id;
    const { user_id, question } = req.body;

    // Validate required fields
    if (!user_id || !question) {
        return res.status(400).json({ message: "User ID and question are required" });
    }

    // Find the question by ID
    Question.findById(questionId, (err, existingQuestion) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (!existingQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Check if the user is the creator of the question
        if (existingQuestion.creator_id !== user_id) {
            return res.status(403).json({ message: "Forbidden: You are not the creator of this question" });
        }

        const data = { question };
        // Update the question in the database
        Question.updateById(questionId, data, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            const updatedQuestion = {
                question_id: questionId,
                question,
                creator_id: user_id
            };
            res.status(200).json({ message: "Question updated successfully", question: updatedQuestion });
        });
    });
};

// Controller function to delete a question
module.exports.deleteQuestion = (req, res) => {
    const questionId = req.params.question_id;

    // Find the question by ID
    Question.findById(questionId, (err, existingQuestion) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (!existingQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Delete the question from the database
        Question.deleteById(questionId, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.status(204).send();
        });
    });
};
