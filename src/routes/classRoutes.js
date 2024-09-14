const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const auth = require('../middleware/auth');

// Define routes and link them to controller methods
router.post('/classes', auth, classController.createClass);
router.put('/classes/:id',auth, classController.updateClass);
router.get('/classes',auth, classController.getAllClasses);
router.delete('/classes/:id',auth, classController.deleteClass);
router.post('/classes/:id/join', auth, classController.joinClass);

module.exports = router;
