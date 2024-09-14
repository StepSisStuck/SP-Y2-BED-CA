const pool = require('../services/db');

// Model function to find a Quest by quest_id
module.exports.findById = (quest_id, callback) => {
    const sql = 'SELECT * FROM Quest WHERE quest_id = ?';
    pool.query(sql, [quest_id], (error, results) => {
        if (error) {
            return callback(error);
        }
        if (results.length === 0) {
            return callback(null, null);
        }
        callback(null, results[0]);
    });
};

// Model function to insert a single record into the Quest table
module.exports.insertSingle = (data, callback) => {
    const sql = 'INSERT INTO Quest SET ?';
    pool.query(sql, data, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to retrieve all records from the Quest table
module.exports.findAll = (callback) => {
    const sql = 'SELECT * FROM Quest';
    pool.query(sql, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};
