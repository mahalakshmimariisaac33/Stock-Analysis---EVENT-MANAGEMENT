// Routes for event templates functionality
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// GET /api/events - Get event templates and required materials
router.get('/', eventController.getEventTemplates);

// GET /api/events/:eventType - Get specific event template
router.get('/:eventType', eventController.getSpecificEvent);

module.exports = router;