const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Route to submit a review (create or update)
router.post('/review', auth, reviewController.submitReview);

// Route to get all reviews
router.get('/reviews', auth, reviewController.getAllReviews);

// Route to update a review by ID
router.put('/review', auth, reviewController.updateReview);

// Route to delete a review by ID
router.delete('/review/:id', auth, reviewController.deleteReview);

module.exports = router;
