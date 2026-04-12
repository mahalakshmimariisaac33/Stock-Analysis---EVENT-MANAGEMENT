import React from 'react';
import './EventSelection.css';

const EventSelection = ({ selectedEvent, setSelectedEvent, language = 'en' }) => {
  const translations = {
    en: {
      title: 'Select Event Type',
      placeholder: 'Choose event type...',
      wedding: 'Wedding',
      birthday: 'Birthday Party',
      corporate: 'Corporate Event',
      other: 'Other'
    },
    ta: {
      title: 'நிகழ்வு வகையை தேர்ந்தெடுக்கவும்',
      placeholder: 'நிகழ்வு வகையை தேர்வு செய்யவும்...',
      wedding: 'திருமணம்',
      birthday: 'பிறந்தநாள் விழா',
      corporate: 'கார்ப்பரேட் நிகழ்வு',
      other: 'மற்றவை'
    }
  };

  const t = translations[language] || translations['en'];

  const eventTypes = [
    { value: 'wedding', label: t.wedding, icon: '💒' },
    { value: 'birthday', label: t.birthday, icon: '🎂' },
    { value: 'corporate', label: t.corporate, icon: '🏢' },
    { value: 'other', label: t.other, icon: '🎉' }
  ];

  return (
    <div className="event-selection">
      <h3>{t.title}</h3>
      
      <select 
        className="event-dropdown"
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
      >
        <option value="">{t.placeholder}</option>
        {eventTypes.map(event => (
          <option key={event.value} value={event.value}>
            {event.icon} {event.label}
          </option>
        ))}
      </select>

      {selectedEvent && (
        <div className="selected-event">
          <div className="event-icon">
            {eventTypes.find(e => e.value === selectedEvent)?.icon}
          </div>
          <p>{eventTypes.find(e => e.value === selectedEvent)?.label}</p>
        </div>
      )}
    </div>
  );
};

export default EventSelection;