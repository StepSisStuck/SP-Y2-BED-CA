const pool = require('../services/db');

// Model function to insert a single record into the Spell table
module.exports.insertSingle = (data, callback) => {
    const sql = 'INSERT INTO Spell SET ?';
    pool.query(sql, data, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to retrieve all records from the Spell table
module.exports.findAll = (callback) => {
    const sql = 'SELECT * FROM Spell';
    pool.query(sql, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to update a single record in the Spell table by spell_id
module.exports.updateSingle = (spell_id, data, callback) => {
    const sql = 'UPDATE Spell SET ? WHERE spell_id = ?';
    pool.query(sql, [data, spell_id], (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
}

// Model function to delete a single record from the Spell table by spell_id
module.exports.deleteSingle = (spell_id, callback) => {
    const sql = 'DELETE FROM Spell WHERE spell_id = ?';
    pool.query(sql, spell_id, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};
