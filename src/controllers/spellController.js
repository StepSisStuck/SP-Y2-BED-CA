const Spell = require('../models/spellModel');

// Controller function to create a new spell
module.exports.createSpell = (req, res) => {
    const { name, description, power } = req.body;

    // Validate required fields
    if (!name || !description || !power) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const data = { name, description, power };

    // Insert the new spell into the database
    Spell.insertSingle(data, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        const newSpell = {
            spell_id: result.insertId,
            name,
            description,
            power
        };
        res.status(201).json({ message: "Spell created successfully", spell: newSpell });
    });
};

// Controller function to get all spells
module.exports.getAllSpells = (req, res) => {
    // Retrieve all spells from the database
    Spell.findAll((err, spells) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json(spells);
    });
};

// Controller function to update a spell
module.exports.updateSpell = (req, res) => {
    const { spell_id } = req.params;
    const { name, description, power } = req.body;

    // Validate required fields
    if (!name || !description || !power) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const data = { name, description, power };

    // Update the spell in the database
    Spell.updateSingle(spell_id, data, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Spell not found" });
        }
        res.status(200).json({ message: "Spell updated successfully" });
    });
}

// Controller function to delete a spell
module.exports.deleteSpell = (req, res) => {
    const { spell_id } = req.params;

    // Delete the spell from the database
    Spell.deleteSingle(spell_id, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Spell not found" });
        }
        res.status(200).json({ message: "Spell deleted successfully" });
    });
};
