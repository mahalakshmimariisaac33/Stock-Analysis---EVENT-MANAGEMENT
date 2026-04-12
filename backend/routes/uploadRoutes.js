// Routes for file upload functionality
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { uploadMiddleware } = require('../services/uploadService');

// POST /api/upload - Upload image or video file
router.post('/', uploadMiddleware, uploadController.uploadFile);

module.exports = router;