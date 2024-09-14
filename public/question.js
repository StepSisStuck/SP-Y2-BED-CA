const mysql = require('mysql2');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Function to create a new survey question
module.exports.createQuestion = (req, res) => {
    const { question, user_id } = req.body;

    if (!question || !user_id) {
        return res.status(400).json({ error: 'Question and user_id are required' });
    }

    pool.query('INSERT INTO SurveyQuestion (question, creator_id) VALUES (?, ?)', [question, user_id], (err, results) => {
        if (err) {
            console.error('Error creating question:', err);
            return res.status(500).json({ error: 'Failed to create question' });
        }
        const question_id = results.insertId;
        res.status(201).json({ question_id, question, creator_id: user_id });
    });
};

// Function to get all survey questions
module.exports.getAllQuestions = (req, res) => {
    pool.query('SELECT question_id, question, creator_id FROM SurveyQuestion', (err, results) => {
        if (err) {
            console.error('Error fetching questions:', err);
            return res.status(500).json({ error: 'Failed to fetch questions' });
        }
        res.status(200).json(results);
    });
};

// Function to update a survey question by its ID
module.exports.updateQuestionById = (req, res) => {
    const { question_id } = req.params;
    const { question, user_id } = req.body;

    if (!question || !user_id) {
        return res.status(400).json({ error: 'Question and user_id are required' });
    }

    pool.query('SELECT creator_id FROM SurveyQuestion WHERE question_id = ?', [question_id], (err, results) => {
        if (err) {
            console.error('Error checking question existence:', err);
            return res.status(500).json({ error: 'Failed to update question' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const actual_creator_id = results[0].creator_id;

        if (parseInt(user_id) !== actual_creator_id) {
            return res.status(403).json({ error: 'Forbidden: User is not the creator of the question' });
        }

        pool.query('UPDATE SurveyQuestion SET question = ? WHERE question_id = ?', [question, question_id], (err, results) => {
            if (err) {
                console.error('Error updating question:', err);
                return res.status(500).json({ error: 'Failed to update question' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Question not found' });
            }

            res.status(200).json({ question_id: parseInt(question_id), question, creator_id: user_id });
        });
    });
};

// Function to delete a survey question by its ID
module.exports.deleteQuestionById = (req, res) => {
    const { question_id } = req.params;

    pool.query('DELETE FROM SurveyQuestion WHERE question_id = ?', [question_id], (err, results) => {
        if (err) {
            console.error('Error deleting question:', err);
            return res.status(500).json({ error: 'Failed to delete question' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        pool.query('DELETE FROM UserAnswer WHERE answered_question_id = ?', [question_id], (err, results) => {
            if (err) {
                console.error('Error deleting answers:', err);
                return res.status(500).json({ error: 'Failed to delete answers' });
            }

            res.status(204).end();
        });
    });
};

// Function to create an answer to a survey question
module.exports.createAnswer = (req, res) => {
    const { question_id } = req.params;
    let { user_id, answer, creation_date, additional_notes } = req.body;

    answer = answer === true || answer === 'true';

    if (!user_id || !answer || !creation_date) {
        return res.status(400).json({ error: 'user_id, answer, and creation_date are required' });
    }

    pool.query('SELECT COUNT(*) AS count FROM SurveyQuestion WHERE question_id = ?', [question_id], (err, results) => {
        if (err) {
            console.error('Error checking question existence:', err);
            return res.status(500).json({ error: 'Failed to check question existence' });
        }

        const count = results[0].count;

        if (count === 0) {
            return res.status(404).json({ error: `Question with ID ${question_id} not found` });
        }

        pool.query(
            'INSERT INTO UserAnswer (answered_question_id, participant_id, answer, creation_date, additional_notes) VALUES (?, ?, ?, ?, ?)',
            [question_id, user_id, answer, creation_date, additional_notes],
            (err, results) => {
                if (err) {
                    console.error('Error creating answer:', err);
                    return res.status(500).json({ error: 'Failed to create answer' });
                }

                const answer_id = results.insertId;
                const responseObject = {
                    answer_id,
                    answered_question_id: parseInt(question_id),
                    participant_id: user_id,
                    answer,
                    creation_date,
                    additional_notes
                };

                res.status(201).json(responseObject);
            }
        );
    });
};

// Function to get all answers for a specific question
module.exports.getAnswersByQuestionId = (req, res) => {
    const { question_id } = req.params;

    pool.query('SELECT participant_id, answer, creation_date, additional_notes FROM UserAnswer WHERE answered_question_id = ?', [question_id], (err, results) => {
        if (err) {
            console.error('Error fetching answers:', err);
            return res.status(500).json({ error: 'Failed to fetch answers' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No answers found for this question' });
        }

        res.status(200).json(results);
    });
};
