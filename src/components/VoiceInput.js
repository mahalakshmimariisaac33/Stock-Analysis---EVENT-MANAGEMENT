import React, { useState, useEffect, useRef } from 'react';
import './VoiceInput.css';

const VoiceInput = ({ 
  onResult, 
  language = 'en-US', 
  placeholder = 'Click microphone and speak...', 
  continuous = false,
  interimResults = true 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('prompt');
  
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  // Check browser support on component mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      // Initialize speech recognition
      const recognition = new SpeechRecognition();
      
      // Configure recognition settings
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;
      recognition.maxAlternatives = 1;
      
      // Event handlers
      recognition.onstart = handleStart;
      recognition.onresult = handleResult;
      recognition.onerror = handleError;
      recognition.onend = handleEnd;
      
      recognitionRef.current = recognition;
      
      // Check microphone permission
      checkMicrophonePermission();
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use Google Chrome.');
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Update language when prop changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  const checkMicrophonePermission = async () => {
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'microphone' });
        setPermissionStatus(permission.state);
        
        permission.onchange = () => {
          setPermissionStatus(permission.state);
        };
      }
    } catch (err) {
      console.log('Permission API not supported');
    }
  };

  const handleStart = () => {
    console.log('🎤 Speech recognition started');
    setIsListening(true);
    setError('');
    setInterimTranscript('');
    
    // Set timeout to auto-stop after 30 seconds
    timeoutRef.current = setTimeout(() => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    }, 30000);
  };

  const handleResult = (event) => {
    console.log('🎯 Speech recognition result:', event);
    
    let finalTranscript = '';
    let interimText = '';
    
    // Process all results
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcriptPart = result[0].transcript;
      
      if (result.isFinal) {
        finalTranscript += transcriptPart;
      } else {
        interimText += transcriptPart;
      }
    }
    
    // Update states
    if (finalTranscript) {
      const newTranscript = transcript + finalTranscript;
      setTranscript(newTranscript);
      
      // Call parent callback with final result
      if (onResult) {
        onResult(newTranscript, true);
      }
    }
    
    if (interimResults) {
      setInterimTranscript(interimText);
      
      // Call parent callback with interim result
      if (onResult && interimText) {
        onResult(transcript + interimText, false);
      }
    }
  };

  const handleError = (event) => {
    console.error('❌ Speech recognition error:', event.error);
    setIsListening(false);
    
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Handle different error types
    const errorMessages = {
      'no-speech': 'No speech detected. Please try speaking again.',
      'audio-capture': 'Microphone not found or not working.',
      'not-allowed': 'Microphone access denied. Please allow microphone access and try again.',
      'network': 'Network error occurred. Please check your internet connection.',
      'service-not-allowed': 'Speech recognition service is not allowed.',
      'bad-grammar': 'Grammar error in speech recognition.',
      'language-not-supported': `Language "${language}" is not supported.`,
      'aborted': 'Speech recognition was aborted.',
    };
    
    const errorMessage = errorMessages[event.error] || `Speech recognition error: ${event.error}`;
    setError(errorMessage);
    
    // Update permission status if access denied
    if (event.error === 'not-allowed') {
      setPermissionStatus('denied');
    }
  };

  const handleEnd = () => {
    console.log('🔇 Speech recognition ended');
    setIsListening(false);
    setInterimTranscript('');
    
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const startListening = () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    
    if (permissionStatus === 'denied') {
      setError('Microphone access is denied. Please enable microphone access in your browser settings.');
      return;
    }
    
    if (recognitionRef.current && !isListening) {
      try {
        setError('');
        setTranscript('');
        setInterimTranscript('');
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error starting recognition:', err);
        setError('Failed to start speech recognition. Please try again.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setError('');
    if (onResult) {
      onResult('', true);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionStatus('granted');
      setError('');
    } catch (err) {
      setPermissionStatus('denied');
      setError('Microphone access denied. Please allow microphone access to use voice input.');
    }
  };

  // Render not supported message
  if (!isSupported) {
    return (
      <div className="voice-input voice-input-error">
        <div className="error-message">
          <span className="error-icon">❌</span>
          <p>Speech recognition is not supported in this browser.</p>
          <p>Please use Google Chrome for the best experience.</p>
        </div>
      </div>
    );
  }

  // Render permission denied message
  if (permissionStatus === 'denied') {
    return (
      <div className="voice-input voice-input-error">
        <div className="error-message">
          <span className="error-icon">🚫</span>
          <p>Microphone access is required for voice input.</p>
          <button 
            className="permission-btn"
            onClick={requestMicrophonePermission}
          >
            Request Microphone Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-input">
      <div className="voice-input-header">
        <h4>Voice Input</h4>
        <div className="voice-controls">
          <button
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported}
          >
            {isListening ? (
              <>
                <span className="mic-icon recording">🔴</span>
                Stop
              </>
            ) : (
              <>
                <span className="mic-icon">🎤</span>
                Start
              </>
            )}
          </button>
          
          {transcript && (
            <button
              className="clear-btn"
              onClick={clearTranscript}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="voice-input-content">
        <div className="transcript-area">
          <textarea
            value={transcript + interimTranscript}
            placeholder={placeholder}
            readOnly
            className={`transcript-text ${isListening ? 'listening' : ''}`}
            rows={4}
          />
          
          {isListening && (
            <div className="listening-indicator">
              <div className="pulse-animation"></div>
              <span>Listening... Speak now</span>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="voice-info">
          <div className="language-info">
            Language: {language}
          </div>
          <div className="status-info">
            Status: {isListening ? 'Listening' : 'Ready'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;