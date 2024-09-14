const GameUser = require('../models/gameUserModel');

// Controller function to create a new game user
module.exports.createGameUser = (req, res) => {
    const { username } = req.body;

    // Validate required fields
    if (!username) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the username already exists
    GameUser.findByUsername(username, (err, existingUser) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const data = { username, points: 0 };

        // Insert the new game user into the database
        GameUser.insertSingle(data, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            const newUser = {
                user_id: result.insertId,
                username,
                points: 0
            };
            res.status(201).json({ message: "Game user created successfully", user: newUser });
        });
    });
};

// Controller function to get all game users
module.exports.getAllGameUsers = (req, res) => {
    // Retrieve all game users from the database
    GameUser.findAll((err, users) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json(users);
    });
};

// Controller function to update a game user
module.exports.updateGameUser = (req, res) => {
    const { user_id } = req.params;
    const { username, points } = req.body;

    // Validate required fields
    if (!username && points == null) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the user by ID
    GameUser.findById(user_id, (err, existingUser) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // If username is provided, check if the new username already exists
        if (username) {
            GameUser.findByUsername(username, (err, existingUserByName) => {
                if (err) {
                    return res.status(500).json(err);
                }
                if (existingUserByName && existingUserByName.user_id !== user_id) {
                    return res.status(409).json({ message: "Username already exists" });
                }

                const data = { username };

                if (points != null) {
                    data.points = points;
                } else {
                    data.points = existingUser.points;
                }

                // Update the user in the database
                GameUser.updateById(user_id, data, (err, result) => {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    if (result.affectedRows === 0) {
                        return res.status(404).json({ message: "User not found" });
                    }
                    res.status(200).json({ message: "Game user updated successfully" });
                });
            });
        } else {
            const data = { points };

            // Update the user's points in the database
            GameUser.updateById(user_id, data, (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.status(200).json({ message: "Game user updated successfully" });
            });
        }
    });
};
