const db = require('../config/db');

const createUser = async (username, password) => {
  const [result] = await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
  return result;
};

const findUserByUsername = async (username) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

module.exports = { createUser, findUserByUsername };
