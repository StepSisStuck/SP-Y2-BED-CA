const pool = require('../services/db');

// Model function to insert a single record into the User table
module.exports.insertSingle = (data, callback) => {
    const sql = 'INSERT INTO User SET ?';
    pool.query(sql, data, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to find a User by username
module.exports.findByUsername = (username, callback) => {
    const sql = 'SELECT * FROM User WHERE username = ?';
    pool.query(sql, [username], (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to retrieve all User records
module.exports.findAll = (callback) => {
    const sql = 'SELECT user_id, username, points FROM User';
    pool.query(sql, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to find a User by user_id
module.exports.findById = (userId, callback) => {
    const sql = 'SELECT user_id, username, points FROM User WHERE user_id = ?';
    pool.query(sql, [userId], (error, results) => {
        if (error) {
            return callback(error);
        }
        if (results.length === 0) {
            return callback(null, null);
        }
        callback(null, results[0]);
    });
};

// Model function to get completed questions for a User by user_id
module.exports.getCompletedQuestions = (userId, callback) => {
    const sql = 'SELECT * FROM UserAnswer WHERE participant_id = ?';
    pool.query(sql, [userId], (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to update a User record by user_id
module.exports.updateById = (userId, data, callback) => {
    const sql = 'UPDATE User SET ? WHERE user_id = ?';
    pool.query(sql, [data, userId], (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to update points for a User by user_id
module.exports.updatePoints = (userId, points, callback) => {
    const sql = 'UPDATE User SET points = points + ? WHERE user_id = ?';
    pool.query(sql, [points, userId], (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};
