import React, { useState } from 'react';
import VoiceInput from './VoiceInput';
import './ManualInput.css';

const ManualInput = ({ items = [], setItems, language = 'en' }) => {
  const [newItem, setNewItem] = useState({ name: '', category: '', material: '' });
  const [editingId, setEditingId] = useState(null);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [currentField, setCurrentField] = useState('name');

  const translations = {
    en: {
      title: 'Manual Input',
      itemName: 'Item Name',
      category: 'Category',
      material: 'Material',
      add: 'Add Item',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      voiceInput: 'Voice Input',
      hideVoiceInput: 'Hide Voice Input',
      placeholder: {
        name: 'e.g., Chair, Lights, Flowers',
        category: 'e.g., Furniture, Lighting, Decor',
        material: 'e.g., Wood, Metal, Plastic'
      }
    },
    ta: {
      title: 'கைமுறை உள்ளீடு',
      itemName: 'பொருளின் பெயர்',
      category: 'வகை',
      material: 'பொருள்',
      add: 'பொருள் சேர்க்க',
      edit: 'திருத்து',
      delete: 'நீக்கு',
      save: 'சேமி',
      cancel: 'ரத்து',
      voiceInput: 'குரல் உள்ளீடு',
      hideVoiceInput: 'குரல் உள்ளீட்டை மறை',
      placeholder: {
        name: 'உதா., நாற்காலி, விளக்குகள், பூக்கள்',
        category: 'உதா., மரச்சாமான்கள், விளக்கு, அலங்காரம்',
        material: 'உதா., மரம், உலோகம், பிளாஸ்டிக்'
      }
    }
  };

  const t = translations[language] || translations['en'];

  const handleVoiceResult = (transcript, isFinal) => {
    if (isFinal && transcript.trim()) {
      // Parse the voice input to extract item details
      const text = transcript.trim().toLowerCase();
      
      // Simple parsing logic - you can make this more sophisticated
      let name = '', category = '', material = '';
      
      // Try to extract item name (first part before any keywords)
      const words = text.split(' ');
      
      // Look for category keywords
      const categoryKeywords = {
        'furniture': ['chair', 'table', 'desk', 'sofa', 'bed'],
        'lighting': ['light', 'lamp', 'bulb', 'chandelier'],
        'decor': ['flower', 'decoration', 'ornament', 'vase'],
        'fabric': ['cloth', 'curtain', 'drape', 'textile']
      };
      
      // Look for material keywords
      const materialKeywords = {
        'wood': ['wood', 'wooden', 'timber'],
        'metal': ['metal', 'steel', 'iron', 'aluminum'],
        'plastic': ['plastic', 'polymer'],
        'glass': ['glass', 'crystal'],
        'fabric': ['fabric', 'cloth', 'textile']
      };
      
      // Extract name (first word or phrase)
      name = words[0] || transcript.trim();
      
      // Find category
      for (const [cat, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
          category = cat.charAt(0).toUpperCase() + cat.slice(1);
          break;
        }
      }
      
      // Find material
      for (const [mat, keywords] of Object.entries(materialKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
          material = mat.charAt(0).toUpperCase() + mat.slice(1);
          break;
        }
      }
      
      // Set defaults if not found
      if (!category) category = 'Other';
      if (!material) material = 'Unknown';
      
      // Update the form
      setNewItem({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        category,
        material
      });
      
      // Hide voice input after successful recognition
      setShowVoiceInput(false);
    }
  };

  const handleAddItem = () => {
    if (newItem.name.trim()) {
      const item = {
        id: Date.now(),
        name: newItem.name.trim(),
        category: newItem.category.trim() || 'Other',
        material: newItem.material.trim() || 'Unknown'
      };
      setItems([...items, item]);
      setNewItem({ name: '', category: '', material: '' });
    }
  };

  const handleEditItem = (id) => {
    const item = items.find(item => item.id === id);
    setNewItem({ name: item.name, category: item.category, material: item.material });
    setEditingId(id);
  };

  const handleSaveEdit = () => {
    if (newItem.name.trim()) {
      setItems(items.map(item => 
        item.id === editingId 
          ? { ...item, name: newItem.name.trim(), category: newItem.category.trim() || 'Other', material: newItem.material.trim() || 'Unknown' }
          : item
      ));
      setNewItem({ name: '', category: '', material: '' });
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setNewItem({ name: '', category: '', material: '' });
    setEditingId(null);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (editingId) {
        handleSaveEdit();
      } else {
        handleAddItem();
      }
    }
  };

  return (
    <div className="manual-input">
      <h3>{t.title}</h3>
      
      <div className="voice-input-toggle">
        <button 
          className={`voice-toggle-btn ${showVoiceInput ? 'active' : ''}`}
          onClick={() => setShowVoiceInput(!showVoiceInput)}
        >
          🎤 {showVoiceInput ? t.hideVoiceInput : t.voiceInput}
        </button>
      </div>

      {showVoiceInput && (
        <div className="voice-input-section">
          <VoiceInput
            onResult={handleVoiceResult}
            language={language === 'ta' ? 'ta-IN' : 'en-US'}
            placeholder="Say something like: 'wooden chair' or 'metal table' or 'glass vase'..."
            continuous={false}
            interimResults={true}
          />
        </div>
      )}
      
      <div className="input-form">
        <div className="input-group">
          <input
            type="text"
            placeholder={t.placeholder.name}
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            onKeyPress={handleKeyPress}
            className="input-field"
          />
        </div>
        
        <div className="input-group">
          <input
            type="text"
            placeholder={t.placeholder.category}
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            onKeyPress={handleKeyPress}
            className="input-field"
          />
        </div>
        
        <div className="input-group">
          <input
            type="text"
            placeholder={t.placeholder.material}
            value={newItem.material}
            onChange={(e) => setNewItem({ ...newItem, material: e.target.value })}
            onKeyPress={handleKeyPress}
            className="input-field"
          />
        </div>
        
        <div className="button-group">
          {editingId ? (
            <>
              <button onClick={handleSaveEdit} className="save-btn">
                {t.save}
              </button>
              <button onClick={handleCancelEdit} className="cancel-btn">
                {t.cancel}
              </button>
            </>
          ) : (
            <button onClick={handleAddItem} className="add-btn">
              {t.add}
            </button>
          )}
        </div>
      </div>

      <div className="items-list">
        {items.map(item => (
          <div key={item.id} className="item-card">
            <div className="item-info">
              <h4>{item.name}</h4>
              <p className="item-category">{item.category}</p>
              <p className="item-material">{item.material}</p>
            </div>
            <div className="item-actions">
              <button 
                onClick={() => handleEditItem(item.id)} 
                className="edit-btn"
                disabled={editingId !== null}
              >
                {t.edit}
              </button>
              <button 
                onClick={() => handleDeleteItem(item.id)} 
                className="delete-btn"
              >
                {t.delete}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManualInput;