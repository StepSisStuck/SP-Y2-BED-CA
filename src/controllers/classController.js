const Class = require('../models/classModel');
const GameUser = require('../models/gameUserModel');
const CompletedClasses = require('../models/completedClassesModel');

// Controller function to create a new class
module.exports.createClass = (req, res) => {
    const { name, description, required_points } = req.body;

    // Check if required fields are provided
    if (!name || !description || !required_points) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const data = { name, description, required_points };

    // Insert the new class into the database
    Class.insertSingle(data, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        const newClass = {
            class_id: result.insertId,
            name,
            description,
            required_points
        };
        res.status(201).json({ message: "Class created successfully", class: newClass });
    });
};

// Controller function to get all classes
module.exports.getAllClasses = (req, res) => {
    // Retrieve all classes from the database
    Class.findAll((err, classes) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json(classes);
    });
};

// Controller function to update a class
module.exports.updateClass = (req, res) => {
    const class_id = req.params.class_id;
    const { name, description, required_points } = req.body;

    // Check if required fields are provided
    if (!name || !description || !required_points) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const data = { name, description, required_points };

    // Update the class in the database
    Class.updateSingle(class_id, data, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.status(200).json({ message: "Class updated successfully" });
    });
};

// Controller function to delete a class
module.exports.deleteClass = (req, res) => {
    const class_id = req.params.class_id;

    // Delete the class from the database
    Class.deleteSingle(class_id, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.status(200).json({ message: "Class deleted successfully" });
    });
};

// Controller function to attend a class
module.exports.attendClass = (req, res) => {
    const { user_id } = req.body;
    const { class_id } = req.params;

    // Check if user ID is provided
    if (!user_id) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the user by ID
    GameUser.findById(user_id, (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Error finding user", error: err });
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the class by ID
        Class.findById(class_id, (err, classInfo) => {
            if (err) {
                return res.status(500).json({ message: "Error finding class", error: err });
            }
            if (!classInfo) {
                return res.status(404).json({ message: "Class not found" });
            }

            // Check if user has enough points to attend the class
            if (user.points < classInfo.required_points) {
                return res.status(400).json({ message: "Not enough points to attend this class" });
            }

            // Deduct points and track class attendance
            GameUser.updatePoints(user_id, -classInfo.required_points, (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error updating user points", error: err });
                }

                const data = { user_id, class_id, status: 'completed' };

                // Insert the attendance record into CompletedClasses
                CompletedClasses.insertSingle(data, (err, result) => {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    res.status(201).json({ message: "Class attended successfully" });
                });
            });
        });
    });
};
