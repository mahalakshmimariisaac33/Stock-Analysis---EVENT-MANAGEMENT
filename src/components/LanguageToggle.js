import React from 'react';
import './LanguageToggle.css';

const LanguageToggle = ({ language = 'en', setLanguage }) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' }
  ];

  return (
    <div className="language-toggle">
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
        className="language-select"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageToggle;