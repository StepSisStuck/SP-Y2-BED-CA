const db = require('../config/db'); 

exports.handleBattle = async (req, res) => {
  const { user_id_1, user_id_2 } = req.body;

  if (!user_id_1 || !user_id_2) {
    return res.status(400).json({ message: "Both User IDs are required" });
  }

  try {
    // Fetch spells for both users
    const [spellsUser1] = await db.promise().query("SELECT power FROM Spells WHERE user_id = ?", [user_id_1]);
    const [spellsUser2] = await db.promise().query("SELECT power FROM Spells WHERE user_id = ?", [user_id_2]);

    if (spellsUser1.length === 0 || spellsUser2.length === 0) {
      return res.status(404).json({ message: "One or both users have no spells." });
    }

    // Calculate total power for each user
    const totalPowerUser1 = spellsUser1.reduce((sum, spell) => sum + spell.power, 0);
    const totalPowerUser2 = spellsUser2.reduce((sum, spell) => sum + spell.power, 0);

    // Determine the winner and points awarded
    let winner, pointsAwarded;
    if (totalPowerUser1 > totalPowerUser2) {
      winner = user_id_1;
      pointsAwarded = 150;
      await db.promise().query("UPDATE User SET points = points + ? WHERE user_id = ?", [pointsAwarded, user_id_1]);
      await db.promise().query("UPDATE User SET points = points + 75 WHERE user_id = ?", [user_id_2]);
    } else if (totalPowerUser2 > totalPowerUser1) {
      winner = user_id_2;
      pointsAwarded = 150;
      await db.promise().query("UPDATE User SET points = points + ? WHERE user_id = ?", [pointsAwarded, user_id_2]);
      await db.promise().query("UPDATE User SET points = points + 75 WHERE user_id = ?", [user_id_1]);
    } else {
      winner = "Draw";
      pointsAwarded = 75;
      await db.promise().query("UPDATE User SET points = points + ? WHERE user_id = ?", [pointsAwarded / 2, user_id_1]);
      await db.promise().query("UPDATE User SET points = points + ? WHERE user_id = ?", [pointsAwarded / 2, user_id_2]);
    }

    res.status(200).json({
      winner,
      pointsAwarded,
      powerUser1: totalPowerUser1,
      powerUser2: totalPowerUser2,
    });
  } catch (err) {
    console.error("Failed to complete battle:", err);
    res.status(500).json({ message: "Failed to complete battle." });
  }
};
