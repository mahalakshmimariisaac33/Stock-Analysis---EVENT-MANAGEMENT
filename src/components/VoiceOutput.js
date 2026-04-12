import React, { useState } from 'react';
import './VoiceOutput.css';

const VoiceOutput = ({ 
  materialData = {}, 
  language = 'en', 
  translations = { en: { allMaterialsPresent: 'All materials present', someMaterialsMissing: 'Some materials missing' }, ta: { allMaterialsPresent: 'அனைத்து பொருட்களும் உள்ளன', someMaterialsMissing: 'சில பொருட்கள் இல்லை' } }, 
  allMaterialsPresent = false, 
  missingItems = [] 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported in this browser.');
    }
  };

  const handleVoiceOutput = () => {
    const materialCount = Object.keys(materialData).length;
    const totalItems = Object.values(materialData).reduce((a, b) => a + b, 0);
    
    let message;
    
    if (totalItems === 0) {
      message = language === 'en' 
        ? 'No materials detected yet'
        : 'இன்னும் எந்த பொருட்களும் கண்டறியப்படவில்லை';
    } else if (allMaterialsPresent) {
      message = translations[language].allMaterialsPresent;
    } else {
      message = translations[language].someMaterialsMissing;
      if (missingItems.length > 0) {
        const missingText = language === 'en' 
          ? `Missing items: ${missingItems.join(', ')}`
          : `இல்லாத பொருட்கள்: ${missingItems.join(', ')}`;
        message += '. ' + missingText;
      }
    }
    
    // Add material details
    if (totalItems > 0) {
      const materialList = Object.entries(materialData)
        .map(([material, count]) => `${count} ${material}`)
        .join(', ');
      
      const detailMessage = language === 'en'
        ? `Detected materials: ${materialList}`
        : `கண்டறியப்பட்ட பொருட்கள்: ${materialList}`;
      
      message += '. ' + detailMessage;
    }
    
    speakText(message, language);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const buttonText = language === 'en' ? '🔊 Voice Output' : '🔊 குரல் வெளியீடு';
  const stopText = language === 'en' ? '⏹️ Stop' : '⏹️ நிறுத்து';

  return (
    <div className="voice-output">
      {!isPlaying ? (
        <button 
          onClick={handleVoiceOutput} 
          className="voice-btn"
          disabled={!('speechSynthesis' in window)}
        >
          {buttonText}
        </button>
      ) : (
        <button 
          onClick={stopSpeech} 
          className="voice-btn stop-btn"
        >
          {stopText}
        </button>
      )}
      
      {!('speechSynthesis' in window) && (
        <p className="voice-warning">
          {language === 'en' 
            ? 'Voice output not supported in this browser'
            : 'இந்த உலாவியில் குரல் வெளியீடு ஆதரிக்கப்படவில்லை'
          }
        </p>
      )}
    </div>
  );
};

export default VoiceOutput;