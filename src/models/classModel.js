const pool = require('../services/db');

// Model function to insert a single record into the Classes table
module.exports.insertSingle = (data, callback) => {
    const sql = 'INSERT INTO Classes SET ?';
    pool.query(sql, data, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to retrieve all records from the Classes table
module.exports.findAll = (callback) => {
    const sql = 'SELECT * FROM Classes';
    pool.query(sql, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to update a single record in the Classes table by class_id
module.exports.updateSingle = (class_id, data, callback) => {
    const sql = 'UPDATE Classes SET ? WHERE class_id = ?';
    pool.query(sql, [data, class_id], (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to delete a single record from the Classes table by class_id
module.exports.deleteSingle = (class_id, callback) => {
    const sql = 'DELETE FROM Classes WHERE class_id = ?';
    pool.query(sql, [class_id], (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to find a single record in the Classes table by class_id
module.exports.findById = (class_id, callback) => {
    const sql = 'SELECT * FROM Classes WHERE class_id = ?';
    pool.query(sql, [class_id], (error, results) => {
        if (error) {
            return callback(error);
        }
        if (results.length === 0) {
            return callback(null, null);
        }
        callback(null, results[0]);
    });
};
