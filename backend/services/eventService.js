// Service for managing event templates and requirements

/**
 * Event templates with required and optional materials
 * This data structure can be easily extended or moved to a database later
 */
const eventTemplates = {
  wedding: {
    name: 'Wedding',
    description: 'Traditional wedding ceremony and reception setup',
    requiredItems: [
      'Flowers',
      'Chairs', 
      'Tables',
      'Lights',
      'Fabric',
      'Arch',
      'Candles'
    ],
    optionalItems: [
      'Carpet',
      'Pillars',
      'Backdrop',
      'Sound System',
      'Decorative Vases',
      'Centerpieces'
    ],
    materialCategories: {
      'Natural': ['Flowers', 'Wood'],
      'Fabric': ['Draping', 'Table Cloths', 'Chair Covers'],
      'Metal': ['Arch', 'Stands', 'Decorative Elements'],
      'Glass': ['Vases', 'Candle Holders'],
      'Electrical': ['Lights', 'Sound System'],
      'Plastic': ['Chairs', 'Decorative Items']
    },
    colors: ['White', 'Gold', 'Pink', 'Red', 'Cream'],
    estimatedBudget: 'High'
  },

  birthday: {
    name: 'Birthday Party',
    description: 'Fun birthday celebration setup',
    requiredItems: [
      'Balloons',
      'Chairs',
      'Tables', 
      'Lights',
      'Banner',
      'Cake Stand'
    ],
    optionalItems: [
      'Party Hats',
      'Streamers',
      'Photo Booth Props',
      'Games Setup',
      'Gift Table',
      'Pinata'
    ],
    materialCategories: {
      'Latex': ['Balloons'],
      'Paper': ['Banner', 'Decorations', 'Party Hats'],
      'Plastic': ['Chairs', 'Tables', 'Decorative Items'],
      'Fabric': ['Table Cloths'],
      'Electrical': ['Lights', 'Sound System'],
      'Wood': ['Cake Stand', 'Gift Table']
    },
    colors: ['Bright Colors', 'Rainbow', 'Theme Colors'],
    estimatedBudget: 'Medium'
  },

  corporate: {
    name: 'Corporate Event',
    description: 'Professional business event setup',
    requiredItems: [
      'Chairs',
      'Tables',
      'Lights', 
      'Banners',
      'Podium',
      'Projector Screen'
    ],
    optionalItems: [
      'Registration Desk',
      'Display Boards',
      'Networking Area',
      'Catering Setup',
      'Branded Materials',
      'Audio Visual Equipment'
    ],
    materialCategories: {
      'Wood': ['Podium', 'Tables'],
      'Metal': ['Chairs', 'Stands'],
      'Fabric': ['Banners', 'Projector Screen'],
      'Vinyl': ['Signage', 'Branded Materials'],
      'Electrical': ['Lights', 'AV Equipment'],
      'Plastic': ['Registration Materials']
    },
    colors: ['Corporate Colors', 'Blue', 'Gray', 'White'],
    estimatedBudget: 'High'
  },

  anniversary: {
    name: 'Anniversary Celebration',
    description: 'Romantic anniversary celebration setup',
    requiredItems: [
      'Flowers',
      'Candles',
      'Chairs',
      'Tables',
      'Lights',
      'Photos Display'
    ],
    optionalItems: [
      'Memory Lane Setup',
      'Romantic Backdrop',
      'Wine Setup',
      'Music System',
      'Guest Book Area'
    ],
    materialCategories: {
      'Natural': ['Flowers'],
      'Wax': ['Candles'],
      'Wood': ['Tables', 'Photo Frames'],
      'Metal': ['Candle Holders', 'Stands'],
      'Fabric': ['Table Cloths', 'Backdrop'],
      'Electrical': ['Lights', 'Music System']
    },
    colors: ['Gold', 'Red', 'White', 'Rose Gold'],
    estimatedBudget: 'Medium'
  },

  graduation: {
    name: 'Graduation Party',
    description: 'Celebration for academic achievement',
    requiredItems: [
      'Chairs',
      'Tables',
      'Balloons',
      'Banner',
      'Lights',
      'Photo Display'
    ],
    optionalItems: [
      'Cap and Gown Display',
      'Achievement Board',
      'Memory Book',
      'Cake Table',
      'Gift Area'
    ],
    materialCategories: {
      'Latex': ['Balloons'],
      'Paper': ['Banner', 'Certificates Display'],
      'Plastic': ['Chairs', 'Tables'],
      'Fabric': ['Table Cloths', 'Backdrop'],
      'Electrical': ['Lights'],
      'Wood': ['Display Boards']
    },
    colors: ['School Colors', 'Gold', 'Blue', 'Black'],
    estimatedBudget: 'Medium'
  }
};

/**
 * Get all event templates
 */
function getAllEventTemplates() {
  return eventTemplates;
}

/**
 * Get specific event template by type
 */
function getEventTemplate(eventType) {
  return eventTemplates[eventType.toLowerCase()] || null;
}

/**
 * Get available event types
 */
function getAvailableEventTypes() {
  return Object.keys(eventTemplates);
}

/**
 * Get required items for specific event
 */
function getRequiredItems(eventType) {
  const template = getEventTemplate(eventType);
  return template ? template.requiredItems : [];
}

/**
 * Get material categories for specific event
 */
function getMaterialCategories(eventType) {
  const template = getEventTemplate(eventType);
  return template ? template.materialCategories : {};
}

/**
 * Check if items are sufficient for event type
 */
function validateEventItems(eventType, providedItems) {
  const requiredItems = getRequiredItems(eventType);
  const providedItemNames = providedItems.map(item => item.name.toLowerCase());
  
  const missingItems = requiredItems.filter(required => 
    !providedItemNames.some(provided => 
      provided.includes(required.toLowerCase()) || 
      required.toLowerCase().includes(provided)
    )
  );
  
  return {
    isComplete: missingItems.length === 0,
    missingItems,
    completionPercentage: Math.round(((requiredItems.length - missingItems.length) / requiredItems.length) * 100)
  };
}

module.exports = {
  getAllEventTemplates,
  getEventTemplate,
  getAvailableEventTypes,
  getRequiredItems,
  getMaterialCategories,
  validateEventItems
};