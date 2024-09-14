const db = require('../config/db');

// Create a question and update user points
exports.createQuestion = async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res
            .status(400)
            .json({ message: "Question and User ID are required" });
    }

    try {
        await db.promise().query("INSERT INTO Questions (question, user_id) VALUES (?, ?)", [
            question,
            req.user_id,
        ]);
        await db.promise().query("UPDATE User SET points = points + 150 WHERE user_id = ?", [
            req.user_id,
        ]);
        res.status(200).json({
            message: "Question created and user points updated successfully",
        });
    } catch (err) {
        console.error("Failed to create question or update points:", err);
        res
            .status(500)
            .json({ message: "Failed to create question or update points" });
    }
};

// Fetch all questions
exports.getAllQuestions = async (req, res) => {
    try {
        const [results] = await db.promise().query("SELECT * FROM Questions");
        res.status(200).json(results);
    } catch (err) {
        console.error("Failed to fetch questions:", err);
        res.status(500).json({ message: "Failed to fetch questions." });
    }
};

// Fetch a question by ID
exports.getQuestionById = async (req, res) => {
    const questionId = req.params.id;

    try {
        const [results] = await db.promise().query("SELECT * FROM Questions WHERE id = ?", [questionId]);

        if (results.length === 0) {
            return res.status(404).json({ message: "Question not found." });
        }

        res.status(200).json(results[0]);
    } catch (err) {
        console.error("Failed to fetch question:", err);
        res.status(500).json({ message: "Failed to fetch question." });
    }
};

// Update a question by ID
exports.updateQuestionById = async (req, res) => {
    const questionId = req.params.id;
    const { question } = req.body;

    try {
        await db.promise().query("UPDATE Questions SET question = ? WHERE id = ?", [
            question,
            questionId,
        ]);
        res.status(200).json({ message: "Question updated successfully." });
    } catch (err) {
        console.error("Failed to update question:", err);
        res.status(500).json({ message: "Failed to update question." });
    }
};

// Delete a question by ID
exports.deleteQuestionById = async (req, res) => {
    const questionId = req.params.id;

    try {
        const [result] = await db.promise().query("DELETE FROM Questions WHERE id = ?", [questionId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Question not found." });
        }

        res.status(200).json({ message: "Question deleted successfully." });
    } catch (err) {
        console.error("Failed to delete question:", err);
        res.status(500).json({ message: "Failed to delete question." });
    }
};
