import React, { useState, useEffect } from 'react';
import './VoiceCommands.css';

const VoiceCommands = ({ language = 'en', onVoiceCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [lastCommand, setLastCommand] = useState('');

  const translations = {
    en: {
      title: 'Voice Commands',
      startListening: 'Start Voice Commands',
      stopListening: 'Stop Listening',
      listening: 'Listening for commands...',
      notSupported: 'Voice commands not supported',
      commands: [
        'Say "analyze" to start analysis',
        'Say "upload file" to open file picker',
        'Say "add chair" to add an item',
        'Say "switch language" to toggle language',
        'Say "next" to go to next step',
        'Say "previous" to go back'
      ]
    },
    ta: {
      title: 'குரல் கட்டளைகள்',
      startListening: 'குரல் கட்டளைகளை தொடங்கு',
      stopListening: 'கேட்பதை நிறுத்து',
      listening: 'கட்டளைகளுக்காக கேட்கிறது...',
      notSupported: 'குரல் கட்டளைகள் ஆதரிக்கப்படவில்லை',
      commands: [
        '"பகுப்பாய்வு" என்று சொல்லுங்கள்',
        '"கோப்பு பதிவேற்று" என்று சொல்லுங்கள்',
        '"நாற்காலி சேர்" என்று சொல்லுங்கள்',
        '"மொழி மாற்று" என்று சொல்லுங்கள்',
        '"அடுத்து" என்று சொல்லுங்கள்',
        '"முந்தைய" என்று சொல்லுங்கள்'
      ]
    }
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language === 'ta' ? 'ta-IN' : 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        setLastCommand(transcript);
        processVoiceCommand(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [language]);

  const processVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    
    // English commands
    if (language === 'en') {
      if (lowerCommand.includes('analyze') || lowerCommand.includes('analyse')) {
        onVoiceCommand('analyze');
      } else if (lowerCommand.includes('upload') || lowerCommand.includes('file')) {
        onVoiceCommand('upload');
      } else if (lowerCommand.includes('add') && (lowerCommand.includes('chair') || lowerCommand.includes('table') || lowerCommand.includes('light'))) {
        const item = extractItem(lowerCommand);
        onVoiceCommand('addItem', item);
      } else if (lowerCommand.includes('switch') || lowerCommand.includes('language')) {
        onVoiceCommand('switchLanguage');
      } else if (lowerCommand.includes('next')) {
        onVoiceCommand('next');
      } else if (lowerCommand.includes('previous') || lowerCommand.includes('back')) {
        onVoiceCommand('previous');
      }
    } 
    // Tamil commands
    else {
      if (lowerCommand.includes('பகுப்பாய்வு') || lowerCommand.includes('ஆராய்')) {
        onVoiceCommand('analyze');
      } else if (lowerCommand.includes('கோப்பு') || lowerCommand.includes('பதிவேற்று')) {
        onVoiceCommand('upload');
      } else if (lowerCommand.includes('சேர்') && (lowerCommand.includes('நாற்காலி') || lowerCommand.includes('மேசை') || lowerCommand.includes('விளக்கு'))) {
        const item = extractTamilItem(lowerCommand);
        onVoiceCommand('addItem', item);
      } else if (lowerCommand.includes('மொழி') || lowerCommand.includes('மாற்று')) {
        onVoiceCommand('switchLanguage');
      } else if (lowerCommand.includes('அடுத்து')) {
        onVoiceCommand('next');
      } else if (lowerCommand.includes('முந்தைய')) {
        onVoiceCommand('previous');
      }
    }
  };

  const extractItem = (command) => {
    if (command.includes('chair')) return { name: 'Chair', category: 'Furniture', material: 'Wood' };
    if (command.includes('table')) return { name: 'Table', category: 'Furniture', material: 'Wood' };
    if (command.includes('light')) return { name: 'Light', category: 'Lighting', material: 'Electrical' };
    return { name: 'Item', category: 'Other', material: 'Unknown' };
  };

  const extractTamilItem = (command) => {
    if (command.includes('நாற்காலி')) return { name: 'நாற்காலி', category: 'மரச்சாமான்கள்', material: 'மரம்' };
    if (command.includes('மேசை')) return { name: 'மேசை', category: 'மரச்சாமான்கள்', material: 'மரம்' };
    if (command.includes('விளக்கு')) return { name: 'விளக்கு', category: 'விளக்கு', material: 'மின்சாரம்' };
    return { name: 'பொருள்', category: 'மற்றவை', material: 'தெரியாது' };
  };

  const startListening = () => {
    if (recognition) {
      recognition.lang = language === 'ta' ? 'ta-IN' : 'en-US';
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const t = translations[language] || translations['en'];

  if (!recognition) {
    return (
      <div className="voice-commands">
        <p className="not-supported">{t.notSupported}</p>
      </div>
    );
  }

  return (
    <div className="voice-commands">
      <div className="voice-commands-header">
        <h4>{t.title}</h4>
        <button 
          className={`voice-command-btn ${isListening ? 'listening' : ''}`}
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? '⏹️' : '🎤'}
          {isListening ? t.stopListening : t.startListening}
        </button>
      </div>
      
      {isListening && (
        <div className="listening-status">
          <div className="listening-animation">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
          <p>{t.listening}</p>
        </div>
      )}
      
      {lastCommand && (
        <div className="last-command">
          <strong>Last command:</strong> "{lastCommand}"
        </div>
      )}
      
      <div className="command-help">
        <details>
          <summary>Available Commands</summary>
          <ul>
            {t.commands.map((command, index) => (
              <li key={index}>{command}</li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
};

export default VoiceCommands;