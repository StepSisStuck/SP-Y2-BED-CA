const pool = require('../services/db');

// Model function to insert a single record into the CompletedClasses table
module.exports.insertSingle = (data, callback) => {
    const sql = 'INSERT INTO CompletedClasses SET ?';
    pool.query(sql, data, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};
