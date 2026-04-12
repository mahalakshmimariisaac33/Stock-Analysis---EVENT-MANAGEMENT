// MongoDB model for storing analysis results
const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  // File information
  filename: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  
  // Event information
  eventType: {
    type: String,
    required: true,
    enum: ['wedding', 'birthday', 'corporate', 'anniversary', 'graduation', 'general'],
    default: 'general'
  },
  
  // Analysis results
  detectedItems: [{
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    material: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    }
  }],
  
  materialDistribution: {
    type: Map,
    of: Number,
    default: new Map()
  },
  
  // Analysis metadata
  totalItems: {
    type: Number,
    default: 0
  },
  processingTime: {
    type: String,
    default: '0s'
  },
  modelVersion: {
    type: String,
    default: 'mock-v1.0'
  },
  confidence: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // Missing items analysis
  missingItems: [{
    type: String
  }],
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  analyzedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
analysisSchema.index({ eventType: 1, createdAt: -1 });
analysisSchema.index({ filename: 1 });
analysisSchema.index({ analyzedAt: -1 });

// Virtual for analysis age
analysisSchema.virtual('analysisAge').get(function() {
  const now = new Date();
  const diff = now - this.analyzedAt;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return 'Recently';
});

// Pre-save middleware to update totalItems
analysisSchema.pre('save', function(next) {
  this.totalItems = this.detectedItems.length;
  this.updatedAt = new Date();
  next();
});

// Static method to get recent analyses
analysisSchema.statics.getRecent = function(limit = 10) {
  return this.find()
    .sort({ analyzedAt: -1 })
    .limit(limit)
    .select('-__v');
};

// Static method to get analyses by event type
analysisSchema.statics.getByEventType = function(eventType, limit = 10) {
  return this.find({ eventType })
    .sort({ analyzedAt: -1 })
    .limit(limit)
    .select('-__v');
};

// Instance method to calculate missing items
analysisSchema.methods.calculateMissingItems = function(eventTemplate) {
  if (!eventTemplate || !eventTemplate.requiredItems) {
    return { missingItems: [], completionPercentage: 100, isComplete: true };
  }
  
  const detectedItemNames = this.detectedItems.map(item => item.name.toLowerCase());
  const requiredItems = eventTemplate.requiredItems;
  
  const missingItems = requiredItems.filter(required => 
    !detectedItemNames.some(detected => 
      detected.includes(required.toLowerCase()) || 
      required.toLowerCase().includes(detected)
    )
  );
  
  const completionPercentage = Math.round(
    ((requiredItems.length - missingItems.length) / requiredItems.length) * 100
  );
  
  this.missingItems = missingItems;
  this.completionPercentage = completionPercentage;
  this.isComplete = missingItems.length === 0;
  
  return {
    missingItems,
    completionPercentage,
    isComplete: this.isComplete
  };
};

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;