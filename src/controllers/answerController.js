const Answer = require('../models/answerModel');
const Question = require('../models/questionModel');
const User = require('../models/userModel');
console.log("Starting answerController");

module.exports.createAnswer = (req, res) => {
    const questionId = req.params.question_id;
    const { user_id, answer, creation_date, additional_notes } = req.body;

    // Validate required fields
    if (!user_id || !questionId || !creation_date) {
        return res.status(400).json({ message: "User ID, Question ID, and creation date are required" });
    }

    // Find the question by ID
    Question.findById(questionId, (err, existingQuestion) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (!existingQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Find the user by ID
        User.findById(user_id, (err, existingUser) => {
            if (err) {
                return res.status(500).json(err);
            }
            if (!existingUser) {
                return res.status(404).json({ message: "User not found" });
            }

            const data = { answered_question_id: questionId, participant_id: user_id, answer, creation_date, additional_notes };

            // Insert the answer
            Answer.insertSingle(data, (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }

                // Update user points
                User.updatePoints(user_id, 5, (err, updatedResult) => {
                    if (err) {
                        return res.status(500).json(err);
                    }

                    const newAnswer = {
                        answer_id: result.insertId,
                        answered_question_id: questionId,
                        participant_id: user_id,
                        answer,
                        creation_date,
                        additional_notes
                    };

                    res.status(201).json({ message: "Answer created successfully", answer: newAnswer });
                });
            });
        });
    });
};

module.exports.getAnswersByQuestionId = (req, res) => {
    const questionId = req.params.question_id;

    // Find the question by ID
    Question.findById(questionId, (err, existingQuestion) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (!existingQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Find answers by question ID
        Answer.findByQuestionId(questionId, (err, answers) => {
            if (err) {
                return res.status(500).json(err);
            }
            if (answers.length === 0) {
                return res.status(404).json({ message: "No answers found for this question" });
            }
            res.status(200).json(answers);
        });
    });
};
