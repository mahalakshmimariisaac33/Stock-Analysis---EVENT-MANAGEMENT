// Controller for event templates and requirements
const eventTemplates = require('../services/eventService');

/**
 * Get all event templates with required materials
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEventTemplates = async (req, res) => {
  try {
    console.log('📋 Fetching all event templates');
    
    const templates = eventTemplates.getAllEventTemplates();
    
    res.status(200).json({
      success: true,
      message: 'Event templates retrieved successfully',
      data: {
        templates,
        totalEvents: Object.keys(templates).length,
        availableEvents: Object.keys(templates)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching event templates:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve event templates',
      error: error.message
    });
  }
};

/**
 * Get specific event template by type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSpecificEvent = async (req, res) => {
  try {
    const { eventType } = req.params;
    
    console.log('🎭 Fetching event template for:', eventType);
    
    const template = eventTemplates.getEventTemplate(eventType);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: `Event template '${eventType}' not found`,
        availableEvents: eventTemplates.getAvailableEventTypes()
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Event template for '${eventType}' retrieved successfully`,
      data: {
        eventType,
        template,
        requiredItemsCount: template.requiredItems.length,
        optionalItemsCount: template.optionalItems ? template.optionalItems.length : 0
      }
    });

  } catch (error) {
    console.error('❌ Error fetching specific event template:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve event template',
      error: error.message
    });
  }
};

module.exports = {
  getEventTemplates,
  getSpecificEvent
};