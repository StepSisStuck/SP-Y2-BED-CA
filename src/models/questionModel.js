const pool = require('../services/db');

// Model function to insert a single record into the SurveyQuestion table
module.exports.insertSingle = (data, callback) => {
    const sql = 'INSERT INTO SurveyQuestion SET ?';
    pool.query(sql, data, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to retrieve all records from the SurveyQuestion table
module.exports.findAll = (callback) => {
    const sql = 'SELECT question_id, question, creator_id FROM SurveyQuestion';
    pool.query(sql, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to find a single record in the SurveyQuestion table by question_id
module.exports.findById = (questionId, callback) => {
    const sql = 'SELECT * FROM SurveyQuestion WHERE question_id = ?';
    pool.query(sql, [questionId], (error, results) => {
        if (error) {
            return callback(error);
        }
        if (results.length === 0) {
            return callback(null, null);
        }
        callback(null, results[0]);
    });
};

// Model function to update a single record in the SurveyQuestion table by question_id
module.exports.updateById = (questionId, data, callback) => {
    const sql = 'UPDATE SurveyQuestion SET ? WHERE question_id = ?';
    pool.query(sql, [data, questionId], (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to delete a single record in the SurveyQuestion table by question_id
module.exports.deleteById = (questionId, callback) => {
    const sql = `
        DELETE FROM UserAnswer WHERE answered_question_id = ?;
        DELETE FROM SurveyQuestion WHERE question_id = ?;
    `;
    pool.query(sql, [questionId, questionId], (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};
