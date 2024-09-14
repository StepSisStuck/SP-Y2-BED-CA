const pool = require('../services/db');

// Model function to insert or update a record in the CharacterCustomization table
module.exports.upsert = (data, callback) => {
    const sql = `
        INSERT INTO CharacterCustomization (user_id, appearance, abilities) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE 
        appearance = VALUES(appearance), 
        abilities = VALUES(abilities)
    `;
    pool.query(sql, [data.user_id, data.appearance, data.abilities], (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, { insertId: results.insertId });
    });
};

// Model function to find a record in the CharacterCustomization table by user_id
module.exports.findByUserId = (user_id, callback) => {
    const sql = 'SELECT * FROM CharacterCustomization WHERE user_id = ?';
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

// Model function to update a record in the CharacterCustomization table by user_id
module.exports.updateByUserId = (user_id, data, callback) => {
    const sql = 'UPDATE CharacterCustomization SET ? WHERE user_id = ?';
    pool.query(sql, [data, user_id], (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, { insertId: results.insertId });
    });
};
