import React, { useState } from 'react';
import './styles.css';

export default function EventGrid() {
  const [events] = useState([
    { id: '1', name: 'Sales Demo', date: '2024-02-15 10:00', status: 'active' },
    { id: '2', name: 'Onboarding Call', date: '2024-02-16 14:00', status: 'active' },
    { id: '3', name: 'Team Sync', date: '2024-02-17 09:00', status: 'active' },
  ]);

  return (
    <div className="app-container">
      <header className="header">
        <h1>📊 Event Grid</h1>
        <p>Calendar grid view of all events</p>
      </header>
      <div className="detail-grid">
        {events.map(event => (
          <div key={event.id} className="grid-item">
            <h3>{event.name}</h3>
            <p>{event.date}</p>
            <span className={`status-badge ${event.status}`}>{event.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
