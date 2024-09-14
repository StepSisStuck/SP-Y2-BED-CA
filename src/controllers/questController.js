const Quest = require('../models/questModel');
const CharacterProgression = require('../models/characterProgressionModel');
const GameUser = require('../models/gameUserModel');

// Controller function to create a new quest
module.exports.createQuest = (req, res) => {
    const { title, description, reward_points, min_points } = req.body;

    // Validate required fields
    if (!title || !description || !reward_points || !min_points) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const data = { title, description, reward_points, min_points };

    // Insert the new quest into the database
    Quest.insertSingle(data, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        const newQuest = {
            quest_id: result.insertId,
            title,
            description,
            reward_points,
            min_points
        };
        res.status(201).json({ message: "Quest created successfully", quest: newQuest });
    });
};

// Controller function to get all quests
module.exports.getAllQuests = (req, res) => {
    // Retrieve all quests from the database
    Quest.findAll((err, quests) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json(quests);
    });
};

// Controller function to start a quest
module.exports.startQuest = (req, res) => {
    const { quest_id } = req.params;
    const { user_id } = req.body;

    // Validate required fields
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

        // Find the quest by ID
        Quest.findById(quest_id, (err, quest) => {
            if (err) {
                return res.status(500).json({ message: "Error finding quest", error: err });
            }
            if (!quest) {
                return res.status(404).json({ message: "Quest not found" });
            }

            // Check if user has enough points to start the quest
            if (user.points < quest.min_points) {
                return res.status(400).json({ message: "Not enough points to start this quest" });
            }

            const data = { user_id, quest_id, status: 'in-progress' };

            // Insert the quest progress into the database
            CharacterProgression.insertSingle(data, (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                const newProgress = {
                    progress_id: result.insertId,
                    user_id,
                    quest_id,
                    status: 'in-progress',
                    updated_status: new Date()
                };
                res.status(201).json({ message: "Quest started successfully", progress: newProgress });
            });
        });
    });
};

// Controller function to complete a quest
module.exports.completeQuest = (req, res) => {
    const { quest_id } = req.params;
    const { user_id } = req.body;

    // Validate required fields
    if (!user_id) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the user has started the quest
    CharacterProgression.findByUserAndQuest(user_id, quest_id, (err, progress) => {
        if (err) {
            return res.status(500).json({ message: "Error finding progress", error: err });
        }
        if (!progress) {
            return res.status(404).json({ message: "Quest not started" });
        }
        if (progress.status !== 'in-progress') {
            return res.status(400).json({ message: "Quest is not in progress or already completed" });
        }

        // Update quest progress to completed
        CharacterProgression.updateProgress({ user_id, quest_id, status: 'completed' }, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            // Find the quest by ID to get reward points
            Quest.findById(quest_id, (err, quest) => {
                if (err) {
                    return res.status(500).json({ message: "Error finding quest", error: err });
                }

                // Update user points
                GameUser.updatePoints(user_id, quest.reward_points, (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Error updating user points", error: err });
                    }
                    const updatedProgress = {
                        progress_id: progress.progress_id,
                        user_id,
                        quest_id,
                        status: 'completed',
                        updated_status: new Date()
                    };
                    res.status(200).json({ message: "Quest completed successfully and points awarded", progress: updatedProgress });
                });
            });
        });
    });
};
