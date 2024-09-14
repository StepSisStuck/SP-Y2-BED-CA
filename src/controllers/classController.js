const db = require('../config/db'); 

// Create a new class
exports.createClass = async (req, res) => {
  const { name, description, required_points, date, time } = req.body;

  try {
    const query =
      "INSERT INTO Classes (name, description, required_points, date, time, user_id) VALUES (?, ?, ?, ?, ?, ?)";
    await db.promise().query(query, [name, description, required_points, date, time, req.user_id]);
    res.status(201).send("Class created successfully!");
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).send("Error creating class");
  }
};

// Update an existing class
exports.updateClass = async (req, res) => {
  const classId = req.params.id;
  const { name, description, required_points, date, time } = req.body;

  try {
    const query =
      "UPDATE Classes SET name = ?, description = ?, required_points = ?, date = ?, time = ? WHERE class_id = ?";
    await db.promise().query(query, [name, description, required_points, date, time, classId]);
    res.status(200).json({ message: "Class updated successfully." });
  } catch (err) {
    console.error("Failed to update class:", err);
    res.status(500).json({ message: "Failed to update class." });
  }
};

// Fetch all classes
exports.getAllClasses = async (req, res) => {
  try {
    const query = `
      SELECT
        c.class_id,
        c.name AS class_name,
        c.description,
        c.required_points,
        c.date,
        c.time,
        c.user_id AS creator_id,
        u.user_id AS joined_user_id,
        u.username AS joined_username
      FROM Classes c
      LEFT JOIN UserClasses uc ON c.class_id = uc.class_id
      LEFT JOIN User u ON uc.user_id = u.user_id
    `;
    
    const [results] = await db.promise().query(query);
    
    // Use a map to aggregate users by class
    const classMap = new Map();
    
    results.forEach(row => {
      const { class_id, class_name, description, required_points, date, time, creator_id, creator_username, joined_user_id, joined_username } = row;
      
      if (!classMap.has(class_id)) {
        classMap.set(class_id, {
          class_id,
          name: class_name,
          description,
          required_points,
          date,
          time,
          user_id:creator_id,
          users: []
        });
      }
      
      if (joined_user_id) {
        classMap.get(class_id).users.push({
          user_id: joined_user_id,
          username: joined_username
        });
      }
    });
    
    // Convert map values to an array
    const classes = Array.from(classMap.values());
    
    res.status(200).json(classes);
  } catch (err) {
    console.error("Failed to fetch classes:", err);
    res.status(500).json({ message: "Failed to fetch classes." });
  }
};


// Delete a class by ID
exports.deleteClass = async (req, res) => {
  const classId = req.params.id;

  try {
    const [result] = await db.promise().query("DELETE FROM Classes WHERE class_id = ?", [classId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Class not found." });
    }

    res.status(200).json({ message: "Class deleted successfully." });
  } catch (err) {
    console.error("Failed to delete class:", err);
    res.status(500).json({ message: "Failed to delete class." });
  }
};



exports.joinClass = async (req, res) => {
  const userId = req.user_id; 
  const classId = req.params.id;

  try {
    // Check if the class exists
    const [classCheckResults] = await db.promise().query('SELECT * FROM Classes WHERE class_id = ?', [classId]);
    if (classCheckResults.length === 0) {
      return res.status(404).json({ message: "Class not found." });
    }

    // Check if the user is already joined
    const [userClassCheckResults] = await db.promise().query('SELECT * FROM UserClasses WHERE user_id = ? AND class_id = ?', [userId, classId]);
    if (userClassCheckResults.length > 0) {
      return res.status(400).json({ message: "User already joined this class." });
    }

    // Check if the user has enough points
    const [userResults] = await db.promise().query('SELECT points FROM User WHERE user_id = ?', [userId]);
    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    const userPoints = userResults[0].points;

    const [classRequirements] = await db.promise().query('SELECT required_points FROM Classes WHERE class_id = ?', [classId]);
    const requiredPoints = classRequirements[0].required_points;

    if (userPoints < requiredPoints) {
      return res.status(400).json({ message: "Insufficient points to join this class." });
    }

    // Deduct points from the user
    await db.promise().query('UPDATE User SET points = points - ? WHERE user_id = ?', [requiredPoints, userId]);

    // Add the user to the class
    await db.promise().query('INSERT INTO UserClasses (user_id, class_id) VALUES (?, ?)', [userId, classId]);

    res.status(200).json({ message: "Successfully joined the class." });
  } catch (err) {
    console.error("Failed to join class:", err);
    res.status(500).json({ message: "Failed to join class." });
  }
};


