const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
console.log("Starting classRoutes");
// POST /classes - Create a new class
router.post('/', classController.createClass);
// GET /classes - Retrieve all classes
router.get('/', classController.getAllClasses);
// PUT /classes/:class_id - Update class details
router.put('/:class_id', classController.updateClass);
// DELETE /classes/:class_id - Delete a class
router.delete('/:class_id', classController.deleteClass);
// POST /classes/:class_id/attend - Attend a class
router.post('/:class_id/attend', classController.attendClass);
module.exports = router;
