
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); 

// Handler for user registration
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const [results] = await db.promise().query("SELECT * FROM User WHERE username = ?", [username]);
        if (results.length > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user with the hashed password
        const [result] = await db.promise().query(
            "INSERT INTO User (username, password, points) VALUES (?, ?, 100)",
            [username, hashedPassword]
        );

        res.status(200).json({
            message: "User registered successfully",
            user_id: result.insertId,
            username: username,
            points: 100,
        });
    } catch (err) {
        console.error("User registration failed:", err);
        res.status(500).json({ message: "User registration failed" });
    }
};

// Handler for user login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch the user by username
        const [results] = await db.promise().query("SELECT * FROM User WHERE username = ?", [username]);
        if (results.length === 0) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const user = results[0];

        // Compare the provided password with the hashed password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign(
                { id: user.user_id, username: user.username },
                process.env.JWT_SECRET, // Use environment variable for the secret
                { expiresIn: "1h" }
            );
            res.status(200).json({
                message: "Login successful",
                user_id: user.user_id,
                username: user.username,
                points: user.points,
                token,
            });
        } else {
            res.status(401).json({ message: "Authentication failed" });
        }
    } catch (err) {
        console.error("Login failed:", err);
        res.status(500).json({ message: "Authentication failed" });
    }
};
