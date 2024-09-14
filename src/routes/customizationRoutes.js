const express = require('express');
const router = express.Router();
const customizationController = require('../controllers/customizationController');

// POST /customization - Create or update character customization
router.post('/', customizationController.upsertCustomization);

// GET /customization/:user_id - Retrieve customization details of a specific user
router.get('/:user_id', customizationController.getCustomizationByUserId);

// PUT /customization/:user_id - Update customization details of a specific user
router.put('/:user_id', customizationController.updateCustomizationByUserId);


module.exports = router;
