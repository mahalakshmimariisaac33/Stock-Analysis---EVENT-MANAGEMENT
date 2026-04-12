import React from 'react';
import './DetectedItems.css';

const DetectedItems = ({ items = [], language = 'en' }) => {
  const translations = {
    en: {
      title: 'Detected Items',
      noItems: 'No items detected yet. Upload an image or video to analyze.',
      category: 'Category',
      material: 'Material'
    },
    ta: {
      title: 'கண்டறியப்பட்ட பொருட்கள்',
      noItems: 'இன்னும் எந்த பொருட்களும் கண்டறியப்படவில்லை. பகுப்பாய்வு செய்ய படம் அல்லது வீடியோவை பதிவேற்றவும்.',
      category: 'வகை',
      material: 'பொருள்'
    }
  };

  const t = translations[language] || translations['en'];

  const getCategoryIcon = (category) => {
    const icons = {
      furniture: '🪑',
      lighting: '💡',
      decor: '🌸',
      fabric: '🧵',
      electrical: '⚡',
      other: '📦'
    };
    return icons[category.toLowerCase()] || icons.other;
  };

  const getMaterialColor = (material) => {
    const colors = {
      wood: '#8B4513',
      metal: '#708090',
      plastic: '#FF6B6B',
      fabric: '#9B59B6',
      electrical: '#F39C12',
      glass: '#3498DB'
    };
    return colors[material.toLowerCase()] || '#6C757D';
  };

  return (
    <div className="detected-items">
      <h3>{t.title}</h3>
      
      {items.length === 0 ? (
        <div className="no-items">
          <div className="no-items-icon">🔍</div>
          <p>{t.noItems}</p>
        </div>
      ) : (
        <div className="items-grid">
          {items.map((item, index) => (
            <div key={index} className="detected-item-card">
              <div className="item-header">
                <span className="category-icon">
                  {getCategoryIcon(item.category)}
                </span>
                <h4>{item.name}</h4>
              </div>
              
              <div className="item-details">
                <div className="detail-row">
                  <span className="detail-label">{t.category}:</span>
                  <span className="detail-value category-value">
                    {item.category}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">{t.material}:</span>
                  <span 
                    className="detail-value material-value"
                    style={{ color: getMaterialColor(item.material) }}
                  >
                    {item.material}
                  </span>
                </div>
              </div>
              
              {item.confidence && (
                <div className="confidence-bar">
                  <div className="confidence-label">
                    Confidence: {Math.round(item.confidence * 100)}%
                  </div>
                  <div className="confidence-progress">
                    <div 
                      className="confidence-fill"
                      style={{ width: `${item.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetectedItems;