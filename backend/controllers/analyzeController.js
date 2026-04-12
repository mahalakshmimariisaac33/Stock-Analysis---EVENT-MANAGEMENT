// Controller for material analysis functionality
const path = require('path');
const fs = require('fs');
const Analysis = require('../models/Analysis');
const eventService = require('../services/eventService');
const { isDatabaseConnected } = require('../config/database');

/**
 * Analyze uploaded file for materials and decorative items
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const analyzeFile = async (req, res) => {
  try {
    const { filePath, filename, eventType } = req.body;
    
    // Validate input
    if (!filePath && !filename) {
      return res.status(400).json({
        success: false,
        message: 'File path or filename is required for analysis'
      });
    }

    // Check if file exists (if local path provided)
    if (filePath) {
      const fullPath = path.join(__dirname, '..', filePath);
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found for analysis'
        });
      }
    }

    console.log('🔍 Analyzing file:', filename || filePath);
    console.log('🎭 Event type:', eventType || 'Not specified');

    // TODO: Replace this with real AI model integration (YOLO, TensorFlow, etc.)
    // For now, return mock detected items to make frontend work
    const mockDetectedItems = generateMockDetectedItems(eventType);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate material distribution
    const materialDistribution = calculateMaterialDistribution(mockDetectedItems);
    
    // Calculate missing items based on event type
    const eventTemplate = eventService.getEventTemplate(eventType);
    let missingItemsInfo = { missingItems: [], completionPercentage: 100, isComplete: true };
    
    if (eventTemplate) {
      missingItemsInfo = eventService.validateEventItems(eventType, mockDetectedItems);
    }
    
    console.log('✅ Analysis completed. Found', mockDetectedItems.length, 'items');
    
    const analysisResult = {
      detectedItems: mockDetectedItems,
      materialDistribution,
      totalItems: mockDetectedItems.length,
      analysisTimestamp: new Date().toISOString(),
      eventType: eventType || 'general',
      missingItems: missingItemsInfo.missingItems,
      completionPercentage: missingItemsInfo.completionPercentage,
      isComplete: missingItemsInfo.isComplete,
      // Future: Add confidence scores, bounding boxes, etc.
      metadata: {
        processingTime: '2.1s',
        modelVersion: 'mock-v1.0',
        confidence: 'high'
      }
    };
    
    // Auto-save to database if connected (optional)
    if (isDatabaseConnected() && filename) {
      try {
        const analysisData = {
          filename: filename,
          filePath: filePath || `uploads/${filename}`,
          fileUrl: `http://localhost:${process.env.PORT || 5000}/uploads/${filename}`,
          fileSize: 0, // Will be updated if file info is available
          mimetype: 'unknown',
          eventType: eventType || 'general',
          detectedItems: mockDetectedItems,
          materialDistribution,
          processingTime: '2.1s',
          modelVersion: 'mock-v1.0',
          confidence: 'high',
          missingItems: missingItemsInfo.missingItems,
          completionPercentage: missingItemsInfo.completionPercentage,
          isComplete: missingItemsInfo.isComplete,
          analyzedAt: new Date()
        };
        
        const analysis = new Analysis(analysisData);
        const savedAnalysis = await analysis.save();
        
        analysisResult.savedToDatabase = true;
        analysisResult.analysisId = savedAnalysis._id;
        
        console.log('💾 Analysis auto-saved to database:', savedAnalysis._id);
      } catch (saveError) {
        console.warn('⚠️ Failed to auto-save analysis:', saveError.message);
        analysisResult.savedToDatabase = false;
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'File analysis completed successfully',
      data: analysisResult
    });

  } catch (error) {
    console.error('❌ Analysis error:', error);
    
    res.status(500).json({
      success: false,
      message: 'File analysis failed',
      error: error.message
    });
  }
};

/**
 * Generate mock detected items based on event type
 * TODO: Replace with real AI model predictions
 */
function generateMockDetectedItems(eventType) {
  const baseItems = [
    { name: 'Chair', category: 'Furniture', material: 'Plastic', confidence: 0.95 },
    { name: 'Table', category: 'Furniture', material: 'Wood', confidence: 0.88 },
    { name: 'Light', category: 'Lighting', material: 'Electrical', confidence: 0.92 }
  ];

  // Add event-specific items
  switch (eventType) {
    case 'wedding':
      return [
        ...baseItems,
        { name: 'Flowers', category: 'Decor', material: 'Natural', confidence: 0.97 },
        { name: 'Fabric Draping', category: 'Decor', material: 'Fabric', confidence: 0.85 },
        { name: 'Candles', category: 'Lighting', material: 'Wax', confidence: 0.90 },
        { name: 'Arch', category: 'Structure', material: 'Metal', confidence: 0.82 }
      ];
      
    case 'birthday':
      return [
        ...baseItems,
        { name: 'Balloons', category: 'Decor', material: 'Latex', confidence: 0.98 },
        { name: 'Banner', category: 'Decor', material: 'Paper', confidence: 0.91 },
        { name: 'Cake Stand', category: 'Furniture', material: 'Glass', confidence: 0.87 }
      ];
      
    case 'corporate':
      return [
        ...baseItems,
        { name: 'Projector Screen', category: 'Equipment', material: 'Fabric', confidence: 0.89 },
        { name: 'Podium', category: 'Furniture', material: 'Wood', confidence: 0.93 },
        { name: 'Company Banner', category: 'Decor', material: 'Vinyl', confidence: 0.96 }
      ];
      
    default:
      return [
        ...baseItems,
        { name: 'Decoration', category: 'Decor', material: 'Mixed', confidence: 0.75 }
      ];
  }
}

/**
 * Calculate material distribution from detected items
 */
function calculateMaterialDistribution(items) {
  const distribution = {};
  
  items.forEach(item => {
    const material = item.material || 'Unknown';
    distribution[material] = (distribution[material] || 0) + 1;
  });
  
  return distribution;
}

module.exports = {
  analyzeFile
};