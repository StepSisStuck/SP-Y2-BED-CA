const pool = require('../services/db');

// Model function to insert a single record into the CharacterProgression table
module.exports.insertSingle = (data, callback) => {
    const sql = 'INSERT INTO CharacterProgression SET ?';
    pool.query(sql, data, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to update the progress of a quest in the CharacterProgression table
module.exports.updateProgress = (data, callback) => {
    const sql = 'UPDATE CharacterProgression SET status = ?, updated_status = CURRENT_TIMESTAMP WHERE user_id = ? AND quest_id = ? AND status = "in-progress"';
    pool.query(sql, [data.status, data.user_id, data.quest_id], (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};

// Model function to find a record in the CharacterProgression table by user ID and quest ID
module.exports.findByUserAndQuest = (user_id, quest_id, callback) => {
    const sql = 'SELECT * FROM CharacterProgression WHERE user_id = ? AND quest_id = ?';
    pool.query(sql, [user_id, quest_id], (error, results) => {
        if (error) {
            return callback(error);
        }
        if (results.length === 0) {
            return callback(null, null);
        }
        callback(null, results[0]);
    });
};
