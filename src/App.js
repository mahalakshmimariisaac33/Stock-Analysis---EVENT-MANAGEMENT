import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import EventSelection from './components/EventSelection';
import ManualInput from './components/ManualInput';
import DetectedItems from './components/DetectedItems';
import MaterialChart from './components/MaterialChart';
import LanguageToggle from './components/LanguageToggle';
import VoiceOutput from './components/VoiceOutput';
import VoiceCommands from './components/VoiceCommands';
import PandaLoader from './components/PandaLoader';
import { fetchDetectedItems } from './services/api';

function App() {
  const [language, setLanguage] = useState('en');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [manualItems, setManualItems] = useState([]);
  const [detectedItems, setDetectedItems] = useState([]);
  const [materialData, setMaterialData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const fileInputRef = useRef(null);

  const translations = {
    en: {
      title: 'AI Event Decor Material Analyzer',
      analyze: 'Analyze Materials',
      analyzing: 'Analyzing event materials...',
      allMaterialsPresent: '✅ All materials are present',
      someMaterialsMissing: '❌ Some materials are missing',
      missingItems: 'Missing Items:',
      cards: {
        voiceCommands: { title: 'Voice Commands', subtitle: 'Control with your voice', icon: '🎙️' },
        fileUpload: { title: 'Upload Media', subtitle: 'Images & videos of your setup', icon: '📁' },
        eventSelection: { title: 'Event Type', subtitle: 'Wedding, birthday, corporate', icon: '🎭' },
        manualInput: { title: 'Add Items', subtitle: 'Manually add decoration items', icon: '✏️' },
        analyze: { title: 'Analyze Materials', subtitle: 'Process your event setup', icon: '🔍' },
        resultsChart: { title: 'Material Chart', subtitle: 'View distribution & statistics', icon: '📊' },
        detectedItems: { title: 'Detected Items', subtitle: 'All identified materials', icon: '🎯' }
      }
    },
    ta: {
      title: 'AI நிகழ்வு அலங்கார பொருள் பகுப்பாய்வி',
      analyze: 'பொருட்களை பகுப்பாய்வு செய்யுங்கள்',
      analyzing: 'நிகழ்வு பொருட்களை பகுப்பாய்வு செய்கிறது...',
      allMaterialsPresent: '✅ அனைத்து பொருட்களும் உள்ளன',
      someMaterialsMissing: '❌ சில பொருட்கள் இல்லை',
      missingItems: 'இல்லாத பொருட்கள்:',
      cards: {
        voiceCommands: { title: 'குரல் கட்டளைகள்', subtitle: 'குரல் மூலம் கட்டுப்படுத்துங்கள்', icon: '🎙️' },
        fileUpload: { title: 'மீடியா பதிவேற்றம்', subtitle: 'உங்கள் அமைப்பின் படங்கள் & வீடியோக்கள்', icon: '📁' },
        eventSelection: { title: 'நிகழ்வு வகை', subtitle: 'திருமணம், பிறந்தநாள், கார்ப்பரேட்', icon: '🎭' },
        manualInput: { title: 'பொருட்கள் சேர்க்க', subtitle: 'அலங்கார பொருட்களை கைமுறையாக சேர்க்கவும்', icon: '✏️' },
        analyze: { title: 'பொருட்களை பகுப்பாய்வு செய்யுங்கள்', subtitle: 'உங்கள் நிகழ்வு அமைப்பை செயலாக்கவும்', icon: '🔍' },
        resultsChart: { title: 'பொருள் விளக்கப்படம்', subtitle: 'விநியோகம் & புள்ளிவிவரங்களைப் பார்க்கவும்', icon: '📊' },
        detectedItems: { title: 'கண்டறியப்பட்ட பொருட்கள்', subtitle: 'அனைத்து அடையாளம் காணப்பட்ட பொருட்கள்', icon: '🎯' }
      }
    }
  };

  useEffect(() => {
    updateMaterialData();
  }, [detectedItems, manualItems]);

  const handleAnalyze = async () => {
    if (!uploadedFile && manualItems.length === 0) {
      setError('Please upload a file or add manual items before analyzing.');
      return;
    }

    setLoading(true);
    setError(null);
    setShowResults(false);
    
    try {
      if (uploadedFile) {
        // Pass the selected event type to the analysis
        const items = await fetchDetectedItems(uploadedFile, selectedEvent);
        setDetectedItems(items);
      }
      setShowResults(true);
    } catch (err) {
      setError('Failed to analyze materials. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (cardId) => {
    setActiveCard(activeCard === cardId ? null : cardId);
  };

  const updateMaterialData = () => {
    const allItems = [...detectedItems, ...manualItems];
    const materials = {};
    
    allItems.forEach(item => {
      if (item.material) {
        materials[item.material] = (materials[item.material] || 0) + 1;
      }
    });
    
    setMaterialData(materials);
  };

  const handleVoiceCommand = (command, data) => {
    switch (command) {
      case 'analyze':
        handleAnalyze();
        break;
      case 'upload':
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
        break;
      case 'addItem':
        if (data) {
          const newItem = {
            id: Date.now(),
            name: data.name,
            category: data.category,
            material: data.material
          };
          setManualItems(prev => [...prev, newItem]);
        }
        break;
      case 'switchLanguage':
        setLanguage(prev => prev === 'en' ? 'ta' : 'en');
        break;
      default:
        console.log('Unknown voice command:', command);
    }
  };

  const getMissingItems = () => {
    // Mock logic for missing items based on event type
    const requiredItems = {
      wedding: ['Flowers', 'Chairs', 'Lights', 'Fabric', 'Tables'],
      birthday: ['Balloons', 'Chairs', 'Lights', 'Decorations'],
      corporate: ['Chairs', 'Tables', 'Lights', 'Banners']
    };

    const currentItems = [...detectedItems, ...manualItems].map(item => item.name);
    const required = requiredItems[selectedEvent] || [];
    return required.filter(item => !currentItems.some(current => 
      current.toLowerCase().includes(item.toLowerCase())
    ));
  };

  const renderCard = (cardId, cardInfo) => {
    const isActive = activeCard === cardId;
    
    switch (cardId) {
      case 'voiceCommands':
        return (
          <div 
            className={`dashboard-card ${isActive ? 'active' : ''}`}
            onClick={() => toggleCard(cardId)}
          >
            <div className="card-header">
              <div className="card-icon">{cardInfo.icon}</div>
              <div>
                <h3 className="card-title">{cardInfo.title}</h3>
                <p className="card-subtitle">{cardInfo.subtitle}</p>
              </div>
            </div>
            <div className="card-content">
              {isActive && (
                <VoiceCommands 
                  language={language}
                  onVoiceCommand={handleVoiceCommand}
                />
              )}
            </div>
          </div>
        );
        
      case 'fileUpload':
        return (
          <div 
            className={`dashboard-card ${isActive ? 'active' : ''}`}
            onClick={() => toggleCard(cardId)}
          >
            <div className="card-header">
              <div className="card-icon">{cardInfo.icon}</div>
              <div>
                <h3 className="card-title">{cardInfo.title}</h3>
                <p className="card-subtitle">{cardInfo.subtitle}</p>
              </div>
            </div>
           <div className="card-content">
        {isActive && (
          <FileUpload 
            onFileUpload={setUploadedFile}
            uploadedFile={uploadedFile}
            language={language}
            ref={fileInputRef}
          />
        )}
      
            </div>
          </div>
          
        );
        
      case 'eventSelection':
        return (
          <div 
            className={`dashboard-card ${isActive ? 'active' : ''}`}
          >
            <div className="card-header" onClick={() => toggleCard(cardId)} style={{ cursor: 'pointer' }}>
              <div className="card-icon">{cardInfo.icon}</div>
              <div>
                <h3 className="card-title">{cardInfo.title}</h3>
                <p className="card-subtitle">{cardInfo.subtitle}</p>
              </div>
            </div>
            <div className="card-content">
              <EventSelection 
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                language={language}
              />
            </div>
          </div>
        );
        
      case 'manualInput':
        return (
          <div 
            className={`dashboard-card ${isActive ? 'active' : ''}`}
          >
            <div className="card-header" onClick={() => toggleCard(cardId)} style={{ cursor: 'pointer' }}>
              <div className="card-icon">{cardInfo.icon}</div>
              <div>
                <h3 className="card-title">{cardInfo.title}</h3>
                <p className="card-subtitle">{cardInfo.subtitle}</p>
              </div>
            </div>
            <div className="card-content">
              {isActive && (
                <ManualInput 
                  items={manualItems}
                  setItems={setManualItems}
                  language={language}
                />
              )}
            </div>
          </div>
        );
        
      case 'analyze':
        return (
          <div className="dashboard-card analyze-card">
            <div className="card-header">
              <div className="card-icon">{cardInfo.icon}</div>
              <div>
                <h3 className="card-title">{cardInfo.title}</h3>
                <p className="card-subtitle">{cardInfo.subtitle}</p>
              </div>
            </div>
            <div className="card-content">
              <button 
                className="analyze-btn"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {t.analyze}
              </button>
            </div>
          </div>
        );
        
      case 'resultsChart':
        return (
          <div 
            className={`dashboard-card results-card ${!allMaterialsPresent ? 'warning' : ''} ${isActive ? 'active' : ''}`}
            onClick={() => toggleCard(cardId)}
          >
            <div className="card-header">
              <div className="card-icon">{cardInfo.icon}</div>
              <div>
                <h3 className="card-title">{cardInfo.title}</h3>
                <p className="card-subtitle">{cardInfo.subtitle}</p>
              </div>
            </div>
            <div className="card-content">
              {showResults && (
                <>
                  <div className="status-message">
                    {allMaterialsPresent ? t.allMaterialsPresent : t.someMaterialsMissing}
                    {missingItems.length > 0 && (
                      <div className="missing-items">
                        <strong>{t.missingItems}</strong> {missingItems.join(', ')}
                      </div>
                    )}
                  </div>
                  {isActive && (
                    <MaterialChart 
                      data={materialData}
                      language={language}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        );
        
      case 'detectedItems':
        return (
          <div 
            className={`dashboard-card ${isActive ? 'active' : ''}`}
            onClick={() => toggleCard(cardId)}
          >
            <div className="card-header">
              <div className="card-icon">{cardInfo.icon}</div>
              <div>
                <h3 className="card-title">{cardInfo.title}</h3>
                <p className="card-subtitle">{cardInfo.subtitle}</p>
              </div>
            </div>
            <div className="card-content">
              {isActive && showResults && (
                <DetectedItems 
                  items={detectedItems}
                  language={language}
                />
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const t = translations[language];
  const missingItems = getMissingItems();
  const allMaterialsPresent = missingItems.length === 0 && (detectedItems.length > 0 || manualItems.length > 0);

  return (
    <div className="App">
      <h1 className="app-title">UDHAYAM</h1>

      <div className="top-controls">
  <LanguageToggle language={language} setLanguage={setLanguage} />
  <VoiceOutput 
    materialData={materialData}
    language={language}
    translations={translations}
    allMaterialsPresent={allMaterialsPresent}
    missingItems={missingItems}
  />
</div>

      {loading && <PandaLoader message={t.analyzing} />}
      
      {error && (
        <div className="dashboard-container">
          <div className="error-card">
            {error}
          </div>
        </div>
      )}

      <div className="dashboard-container">
        <div className="dashboard-grid">
          {renderCard('voiceCommands', t.cards.voiceCommands)}
          {renderCard('fileUpload', t.cards.fileUpload)}
          {renderCard('eventSelection', t.cards.eventSelection)}
          {renderCard('manualInput', t.cards.manualInput)}
          {renderCard('analyze', t.cards.analyze)}
          {showResults && renderCard('resultsChart', t.cards.resultsChart)}
          {showResults && renderCard('detectedItems', t.cards.detectedItems)}
        </div>
      </div>
    </div>
  );
}

export default App;