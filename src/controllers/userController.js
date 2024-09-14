const User = require('../models/userModel');
console.log("Starting userController");

// Controller function to create a new user
module.exports.createUser = (req, res) => {
    const { username } = req.body;

    // Validate required fields
    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    // Check if the username already exists
    User.findByUsername(username, (err, existingUser) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const data = { username, points: 0 };

        // Insert the new user into the database
        User.insertSingle(data, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            const newUser = {
                user_id: result.insertId,
                username,
                points: 0
            };
            res.status(201).json({ message: "User created successfully", user: newUser });
        });
    });
};

// Controller function to get all users
module.exports.getAllUsers = (req, res) => {
    // Retrieve all users from the database
    User.findAll((err, users) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json(users);
    });
};

// Controller function to get a user by ID
module.exports.getUserById = (req, res) => {
    const userId = req.params.user_id;

    // Find the user by ID
    User.findById(userId, (err, user) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get the number of completed questions for the user
        User.getCompletedQuestions(userId, (err, completedQuestions) => {
            if (err) {
                return res.status(500).json(err);
            }

            const userDetails = {
                user_id: user.user_id,
                username: user.username,
                completed_questions: completedQuestions.length,
                points: user.points
            };

            res.status(200).json(userDetails);
        });
    });
};

// Controller function to update a user
module.exports.updateUser = (req, res) => {
    const userId = req.params.user_id;
    const { username } = req.body;

    // Validate required fields
    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    // Find the user by ID
    User.findById(userId, (err, user) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the new username already exists
        User.findByUsername(username, (err, existingUser) => {
            if (err) {
                return res.status(500).json(err);
            }
            if (existingUser.length > 0 && existingUser[0].user_id != userId) {
                return res.status(409).json({ message: "Username already exists" });
            }

            // Update the user in the database
            User.updateById(userId, { username }, (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }

                const updatedUser = {
                    user_id: userId,
                    username,
                    points: user.points
                };

                res.status(200).json({ message: "User updated successfully", user: updatedUser });
            });
        });
    });
};
