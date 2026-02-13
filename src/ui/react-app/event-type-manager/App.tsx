import React, { useState } from 'react';
import './styles.css';

export default function EventTypeManager() {
  const [eventTypes] = useState([
    { id: '1', name: '30 Minute Meeting', duration: 30, active: true },
    { id: '2', name: 'Sales Demo', duration: 60, active: true },
    { id: '3', name: 'Quick Chat', duration: 15, active: false },
  ]);

  return (
    <div className="app-container">
      <header className="header">
        <h1>⚙️ Event Type Manager</h1>
        <p>Manage your Calendly event types</p>
      </header>
      <button style={{marginBottom: '1rem'}}>+ Create New Event Type</button>
      <div className="detail-grid">
        {eventTypes.map(type => (
          <div key={type.id} className="grid-item">
            <h3>{type.name}</h3>
            <p>Duration: {type.duration} minutes</p>
            <span className={`status-badge ${type.active ? 'active' : 'canceled'}`}>
              {type.active ? 'Active' : 'Inactive'}
            </span>
            <div style={{marginTop: '1rem'}}>
              <button>Edit</button>
              <button className="btn-cancel" style={{marginLeft: '0.5rem'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
