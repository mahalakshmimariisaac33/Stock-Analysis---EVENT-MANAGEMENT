// Routes for saving analysis results
const express = require('express');
const router = express.Router();
const saveController = require('../controllers/saveController');

// POST /api/save - Save analysis result to database
router.post('/', saveController.saveAnalysis);

// GET /api/save/:id - Get specific analysis by ID
router.get('/:id', saveController.getAnalysisById);

// DELETE /api/save/:id - Delete specific analysis by ID
router.delete('/:id', saveController.deleteAnalysis);

module.exports = router;