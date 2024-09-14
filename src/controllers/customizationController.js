
const db = require('../config/db'); 

// Handler to create or update character customization
exports.createOrUpdateCustomization = async (req, res) => {
    const {  appearance, abilities } = req.body;

    if ( !appearance || !abilities) {
        return res
            .status(400)
            .json({ message: "user_id, appearance, and abilities are required" });
    }

    try {
        // Check if customization already exists for this user
        const [existingCustomization] = await db.promise().query("SELECT * FROM Customization WHERE user_id = ?", [req.user_id]);

        if (existingCustomization.length > 0) {
            // Update existing customization
            await db.promise().query(
                "UPDATE Customization SET appearance = ?, abilities = ? WHERE user_id = ?",
                [appearance, abilities, req.user_id]
            );
            res.status(200).json({ message: "Customization updated successfully" });
        } else {
            // Create new customization
            const [result] = await db.promise().query(
                "INSERT INTO Customization (user_id, appearance, abilities) VALUES (?, ?, ?)",
                [req.user_id, appearance, abilities]
            );
            res.status(201).json({
                customization_id: result.insertId,
                user_id: req.user_id,
                appearance,
                abilities,
            });
        }
    } catch (err) {
        console.error("Failed to create or update customization:", err);
        res
            .status(500)
            .json({ message: "Failed to create or update customization" });
    }
};

// Handler to retrieve customization details by user_id
exports.getCustomizationByUserId = async (req, res) => {
    const userId = req.params.user_id;

    try {
        const [results] = await db.promise().query("SELECT * FROM Customization WHERE user_id = ?", [userId]);

        if (results.length === 0) {
            return res.status(404).json({ message: "Customization not found" });
        }

        res.status(200).json(results[0]);
    } catch (err) {
        console.error("Failed to fetch customization:", err);
        res.status(500).json({ message: "Failed to fetch customization" });
    }
};

// Handler to update character customization
exports.updateCustomization = async (req, res) => {
    const userId = req.params.user_id;
    const { appearance, abilities } = req.body;

    if (!appearance || !abilities) {
        return res
            .status(400)
            .json({ message: "Appearance and abilities are required" });
    }

    try {
        const [results] = await db.promise().query("SELECT * FROM Customization WHERE user_id = ?", [userId]);

        if (results.length === 0) {
            return res.status(404).json({ message: "Customization not found" });
        }

        await db.promise().query(
            "UPDATE Customization SET appearance = ?, abilities = ? WHERE user_id = ?",
            [appearance, abilities, userId]
        );
        res.status(200).json({ message: "Customization updated successfully" });
    } catch (err) {
        console.error("Failed to update customization:", err);
        res.status(500).json({ message: "Failed to update customization" });
    }
};
