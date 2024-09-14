const pool = require('../services/db');

// Model function to find a GameUser by user_id
module.exports.findById = (user_id, callback) => {
    const sql = 'SELECT * FROM GameUser WHERE user_id = ?';
    pool.query(sql, [user_id], (error, results) => {
        if (error) {
            return callback(error);
        }
        if (results.length === 0) {
            return callback(null, null);
        }
        callback(null, results[0]);
    });
};

// Model function to find a GameUser by username
module.exports.findByUsername = (username, callback) => {
    const sql = 'SELECT * FROM GameUser WHERE username = ?';
    pool.query(sql, [username], (error, results) => {
        if (error) {
            return callback(error);
        }
        if (results.length === 0) {
            return callback(null, null);
        }
        callback(null, results[0]);
    });
};

// Model function to retrieve all GameUser records
module.exports.findAll = (callback) => {
    const sql = 'SELECT * FROM GameUser';
    pool.query(sql, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to update points for a GameUser by user_id
module.exports.updatePoints = (user_id, points, callback) => {
    const sql = 'UPDATE GameUser SET points = points + ? WHERE user_id = ?';
    pool.query(sql, [points, user_id], (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to update a GameUser record by user_id
module.exports.updateById = (user_id, data, callback) => {
    const sql = 'UPDATE GameUser SET ? WHERE user_id = ?';
    pool.query(sql, [data, user_id], (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to insert a single GameUser record
module.exports.insertSingle = (data, callback) => {
    const sql = 'INSERT INTO GameUser SET ?';
    pool.query(sql, data, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};
