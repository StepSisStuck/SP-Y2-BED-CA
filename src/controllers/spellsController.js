const db = require('../config/db'); 

// Create a new spell
const createSpell = async (req, res) => {
  const { name, description, power } = req.body;

  if ( !name || !description || !power) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user_id=req.user_id;
  try {
    // Check if user ID exists
    const [userResults] = await db.promise().query("SELECT * FROM User WHERE user_id = ?", [user_id]);
    if (userResults.length === 0) {
      throw new Error("User ID does not exist");
    }

    // Check if spell name already exists for the user
    const [spellResults] = await db.promise().query("SELECT * FROM Spells WHERE user_id = ? AND name = ?", [user_id, name]);
    if (spellResults.length > 0) {
      throw new Error("Spell name already exists for this user");
    }

    const [result] = await db.promise().query(
      "INSERT INTO Spells (user_id, name, description, power) VALUES (?, ?, ?, ?)",
      [user_id, name, description, power]
    );
    res.status(200).json({
      message: "Spell created successfully",
      spell_id: result.insertId,
    });
  } catch (err) {
    console.error("Error creating spell:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all spells or spells by user ID
const getSpells = async (req, res) => {
  const userId = req.query.user_id;

  try {
    let results;
    if (userId) {
      [results] = await db.promise().query("SELECT * FROM Spells WHERE user_id = ?", [userId]);
    } else {
      [results] = await db.promise().query("SELECT * FROM Spells");
    }
    res.status(200).json(results);
  } catch (err) {
    console.error("Failed to fetch spells:", err);
    res.status(500).json({ message: "Failed to fetch spells." });
  }
};

// Update a spell by ID
const updateSpell = async (req, res) => {
  const { name, description, power } = req.body;
  const { id } = req.params;

  try {
    const [result] = await db.promise().query(
      "UPDATE Spells SET name = ?, description = ?, power = ? WHERE spell_id = ?",
      [name, description, power, id]
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to update spell:", err);
    res.status(500).json({ message: "Failed to update spell." });
  }
};

// Delete a spell by ID
const deleteSpell = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query("DELETE FROM Spells WHERE spell_id = ?", [id]);
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to delete spell:", err);
    res.status(500).json({ message: "Failed to delete spell." });
  }
};

module.exports = {
  createSpell,
  getSpells,
  updateSpell,
  deleteSpell
};
