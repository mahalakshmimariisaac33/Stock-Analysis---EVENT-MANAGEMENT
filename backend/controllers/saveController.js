// Controller for saving analysis results to database
const Analysis = require('../models/Analysis');
const eventService = require('../services/eventService');
const { isDatabaseConnected } = require('../config/database');

/**
 * Save analysis result to database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const saveAnalysis = async (req, res) => {
  try {
    // Check database connection
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Analysis cannot be saved.',
        data: null
      });
    }

    const {
      filename,
      filePath,
      fileUrl,
      fileSize,
      mimetype,
      eventType,
      detectedItems,
      materialDistribution,
      processingTime,
      modelVersion,
      confidence
    } = req.body;

    // Validate required fields
    if (!filename || !filePath || !eventType || !detectedItems) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: filename, filePath, eventType, and detectedItems are required'
      });
    }

    // Create new analysis document
    const analysisData = {
      filename,
      filePath,
      fileUrl: fileUrl || filePath,
      fileSize: fileSize || 0,
      mimetype: mimetype || 'unknown',
      eventType: eventType.toLowerCase(),
      detectedItems: detectedItems || [],
      materialDistribution: materialDistribution || {},
      processingTime: processingTime || '0s',
      modelVersion: modelVersion || 'mock-v1.0',
      confidence: confidence || 'medium',
      analyzedAt: new Date()
    };

    const analysis = new Analysis(analysisData);

    // Calculate missing items if event template exists
    const eventTemplate = eventService.getEventTemplate(eventType);
    if (eventTemplate) {
      analysis.calculateMissingItems(eventTemplate);
    }

    // Save to database
    const savedAnalysis = await analysis.save();

    console.log('💾 Analysis saved successfully:', savedAnalysis._id);

    res.status(201).json({
      success: true,
      message: 'Analysis saved successfully',
      data: {
        id: savedAnalysis._id,
        filename: savedAnalysis.filename,
        eventType: savedAnalysis.eventType,
        totalItems: savedAnalysis.totalItems,
        completionPercentage: savedAnalysis.completionPercentage,
        isComplete: savedAnalysis.isComplete,
        missingItems: savedAnalysis.missingItems,
        savedAt: savedAnalysis.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Save analysis error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to save analysis',
      error: error.message
    });
  }
};

/**
 * Get analysis by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAnalysisById = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available'
      });
    }

    const { id } = req.params;

    const analysis = await Analysis.findById(id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Analysis retrieved successfully',
      data: analysis
    });

  } catch (error) {
    console.error('❌ Get analysis error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid analysis ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analysis',
      error: error.message
    });
  }
};

/**
 * Delete analysis by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteAnalysis = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available'
      });
    }

    const { id } = req.params;

    const analysis = await Analysis.findByIdAndDelete(id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    console.log('🗑️ Analysis deleted:', id);

    res.status(200).json({
      success: true,
      message: 'Analysis deleted successfully',
      data: {
        id: analysis._id,
        filename: analysis.filename,
        deletedAt: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Delete analysis error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid analysis ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete analysis',
      error: error.message
    });
  }
};

module.exports = {
  saveAnalysis,
  getAnalysisById,
  deleteAnalysis
};