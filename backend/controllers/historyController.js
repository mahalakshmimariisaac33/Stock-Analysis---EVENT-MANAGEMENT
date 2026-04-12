// Controller for managing analysis history
const Analysis = require('../models/Analysis');
const { isDatabaseConnected } = require('../config/database');

/**
 * Get all analysis history with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAnalysisHistory = async (req, res) => {
  try {
    // Check database connection
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. History cannot be retrieved.',
        data: []
      });
    }

    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const eventType = req.query.eventType;
    const sortBy = req.query.sortBy || 'analyzedAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query filter
    const filter = {};
    if (eventType && eventType !== 'all') {
      filter.eventType = eventType.toLowerCase();
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder;

    // Execute queries
    const [analyses, totalCount] = await Promise.all([
      Analysis.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      Analysis.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    console.log(`📋 Retrieved ${analyses.length} analyses (page ${page}/${totalPages})`);

    res.status(200).json({
      success: true,
      message: 'Analysis history retrieved successfully',
      data: {
        analyses,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null
        },
        filters: {
          eventType: eventType || 'all',
          sortBy,
          sortOrder: sortOrder === 1 ? 'asc' : 'desc'
        }
      }
    });

  } catch (error) {
    console.error('❌ Get history error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analysis history',
      error: error.message
    });
  }
};

/**
 * Get recent analyses (last 10 by default)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRecentAnalyses = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available',
        data: []
      });
    }

    const limit = parseInt(req.query.limit) || 10;

    const analyses = await Analysis.getRecent(limit);

    res.status(200).json({
      success: true,
      message: 'Recent analyses retrieved successfully',
      data: {
        analyses,
        count: analyses.length,
        limit
      }
    });

  } catch (error) {
    console.error('❌ Get recent analyses error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve recent analyses',
      error: error.message
    });
  }
};

/**
 * Get analyses by event type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAnalysesByEventType = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available',
        data: []
      });
    }

    const { eventType } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const analyses = await Analysis.getByEventType(eventType.toLowerCase(), limit);

    res.status(200).json({
      success: true,
      message: `Analyses for ${eventType} events retrieved successfully`,
      data: {
        eventType,
        analyses,
        count: analyses.length,
        limit
      }
    });

  } catch (error) {
    console.error('❌ Get analyses by event type error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analyses by event type',
      error: error.message
    });
  }
};

/**
 * Get analysis statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAnalysisStats = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available',
        data: null
      });
    }

    // Get statistics using aggregation
    const stats = await Analysis.aggregate([
      {
        $group: {
          _id: null,
          totalAnalyses: { $sum: 1 },
          avgItemsDetected: { $avg: '$totalItems' },
          avgCompletionPercentage: { $avg: '$completionPercentage' },
          completeAnalyses: {
            $sum: { $cond: ['$isComplete', 1, 0] }
          }
        }
      }
    ]);

    // Get event type distribution
    const eventTypeStats = await Analysis.aggregate([
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
          avgCompletion: { $avg: '$completionPercentage' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await Analysis.countDocuments({
      analyzedAt: { $gte: sevenDaysAgo }
    });

    const result = {
      overview: stats[0] || {
        totalAnalyses: 0,
        avgItemsDetected: 0,
        avgCompletionPercentage: 0,
        completeAnalyses: 0
      },
      eventTypeDistribution: eventTypeStats,
      recentActivity: {
        last7Days: recentActivity,
        period: '7 days'
      },
      generatedAt: new Date()
    };

    res.status(200).json({
      success: true,
      message: 'Analysis statistics retrieved successfully',
      data: result
    });

  } catch (error) {
    console.error('❌ Get analysis stats error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analysis statistics',
      error: error.message
    });
  }
};

/**
 * Clear all analysis history (admin function)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const clearHistory = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available'
      });
    }

    // Optional: Add authentication check here
    // if (!req.user || !req.user.isAdmin) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Admin access required'
    //   });
    // }

    const result = await Analysis.deleteMany({});

    console.log(`🗑️ Cleared ${result.deletedCount} analyses from history`);

    res.status(200).json({
      success: true,
      message: 'Analysis history cleared successfully',
      data: {
        deletedCount: result.deletedCount,
        clearedAt: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Clear history error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to clear analysis history',
      error: error.message
    });
  }
};

module.exports = {
  getAnalysisHistory,
  getRecentAnalyses,
  getAnalysesByEventType,
  getAnalysisStats,
  clearHistory
};