// Routes for material analysis functionality
const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyzeController');

// POST /api/analyze - Analyze uploaded file for materials
router.post('/', analyzeController.analyzeFile);

module.exports = router;