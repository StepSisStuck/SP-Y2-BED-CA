
const db = require('../config/db'); 

// Fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT user_id, username, points FROM User");
    res.status(200).json(results);
  } catch (err) {
    console.error("Failed to fetch user details:", err);
    res.status(500).json({
      message: "Failed to fetch user details. Please try again later.",
    });
  }
};

// Fetch user by ID
exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const [results] = await db.promise().query("SELECT user_id, username, points FROM User WHERE user_id = ?", [userId]);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Failed to fetch user details:", err);
    res.status(500).json({
      message: "Failed to fetch user details. Please try again later.",
    });
  }
};

// Update username by user ID
exports.updateUsername = async (req, res) => {
  const userId = req.user_id;
  const { username } = req.body;

  try {
    const [results] = await db.promise().query("SELECT * FROM User WHERE user_id = ?", [userId]);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    await db.promise().query("UPDATE User SET username = ? WHERE user_id = ?", [username, userId]);
    res.status(200).json({ message: "Username updated successfully." });
  } catch (err) {
    console.error("Failed to update username:", err);
    res.status(500).json({ message: "Failed to update username." });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await db.promise().query("DELETE FROM User WHERE user_id = ?", [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Failed to delete user:", err);
    res.status(500).json({ message: "Failed to delete user." });
  }
};
