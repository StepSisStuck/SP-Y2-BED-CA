
const express = require('express');
const router = express.Router();
const customizationController = require('../controllers/customizationController');
const auth = require('../middleware/auth'); // Import your auth middleware if required

// Route to create or update character customization
router.post('/customization', auth, customizationController.createOrUpdateCustomization);

// Route to retrieve customization details by user_id
router.get('/customization/:user_id', auth, customizationController.getCustomizationByUserId);

// Route to update character customization
router.put('/customization/:user_id', auth, customizationController.updateCustomization);

module.exports = router;
