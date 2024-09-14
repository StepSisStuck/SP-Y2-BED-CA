
const db = require('../config/db'); 

// Submit a review
exports.submitReview = async (req, res) => {
  const { name, rating, review } = req.body;
  
  if (!name || !rating || !review) {
    return res
      .status(400)
      .json({ message: "Name, Rating, and Review are required" });
  }

  try {
    await db.promise().query(
      "INSERT INTO Reviews (name, rating, review, user_id) VALUES (?, ?, ?, ?)",
      [name, rating, review, req.user_id]
    );
    res.status(200).json({ message: "Review submitted successfully" });
  } catch (err) {
    console.error("Failed to submit review:", err);
    res.status(500).json({ message: "Failed to submit review" });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT id,name, rating, review, user_id FROM Reviews ORDER BY id DESC"
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};


// Handler to update a review by ID
exports.updateReview = async (req, res) => {
    const { name, rating, review, id } = req.body;

    if (!name || !rating || !review || !id) {
        return res.status(400).json({ message: "Name, Rating, and Review are required" });
    }

    try {
        const [results] = await db.promise().query("UPDATE Reviews SET name = ?, rating = ?, review = ? WHERE id = ?", [name, rating, review, id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review updated successfully" });
    } catch (err) {
        console.error("Failed to update review:", err);
        res.status(500).json({ message: "Failed to update review" });
    }
};

// Handler to delete a review by ID
exports.deleteReview = async (req, res) => {
    const reviewId = req.params.id;

    try {
        const [result] = await db.promise().query("DELETE FROM Reviews WHERE id = ?", [reviewId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        console.error("Failed to delete review:", err);
        res.status(500).json({ message: "Failed to delete review" });
    }
};