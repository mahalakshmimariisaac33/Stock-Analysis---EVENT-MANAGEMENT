// Routes for analysis history management
const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// GET /api/history - Get all analysis history with pagination
router.get('/', historyController.getAnalysisHistory);

// GET /api/history/recent - Get recent analyses
router.get('/recent', historyController.getRecentAnalyses);

// GET /api/history/stats - Get analysis statistics
router.get('/stats', historyController.getAnalysisStats);

// GET /api/history/event/:eventType - Get analyses by event type
router.get('/event/:eventType', historyController.getAnalysesByEventType);

// DELETE /api/history/clear - Clear all history (admin function)
router.delete('/clear', historyController.clearHistory);

module.exports = router;