const GameUser = require('../models/gameUserModel');
const CharacterCustomization = require('../models/customizationModel');

module.exports.upsertCustomization = (req, res) => {
    const { user_id, appearance, abilities } = req.body;

    if (!user_id || !appearance || !abilities) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    GameUser.findById(user_id, (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const data = { user_id, appearance, abilities };

        CharacterCustomization.upsert(data, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            // Respond with the customization data
            res.status(201).json({
                message: "Character customization created",
                customization_id: result.insertId,
                user_id: user_id,
                appearance: appearance,
                abilities: abilities
            });
        });
    });
};

module.exports.getCustomizationByUserId = (req, res) => {
    const { user_id } = req.params;

    CharacterCustomization.findByUserId(user_id, (err, customization) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (!customization) {
            return res.status(404).json({ message: "Customization not found" });
        }
        res.status(200).json(customization);
    });
};

module.exports.updateCustomizationByUserId = (req, res) => {
    const { user_id } = req.params;
    const { appearance, abilities } = req.body;

    if (!appearance || !abilities) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const data = { appearance, abilities };

    CharacterCustomization.updateByUserId(user_id, data, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Customization not found" });
        }

        // Respond with the updated customization data
        res.status(200).json({
            customization_id: result.insertId,
            user_id: user_id,
            appearance: appearance,
            abilities: abilities
        });
    });
};
