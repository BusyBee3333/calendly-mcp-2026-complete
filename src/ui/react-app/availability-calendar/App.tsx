import React, { useState } from 'react';
import './styles.css';

export default function AvailabilityCalendar() {
  const [availableTimes] = useState([
    { time: '2024-02-15 09:00', available: true },
    { time: '2024-02-15 10:00', available: true },
    { time: '2024-02-15 11:00', available: false },
    { time: '2024-02-15 14:00', available: true },
  ]);

  return (
    <div className="app-container">
      <header className="header">
        <h1>📅 Availability Calendar</h1>
        <p>View available time slots</p>
      </header>
      <div className="search-box">
        <input type="date" placeholder="Start Date" />
        <input type="date" placeholder="End Date" />
        <button>Load Availability</button>
      </div>
      <div className="detail-grid">
        {availableTimes.map((slot, i) => (
          <div key={i} className="grid-item">
            <strong>{new Date(slot.time).toLocaleString()}</strong>
            <span className={`status-badge ${slot.available ? 'active' : 'canceled'}`}>
              {slot.available ? 'Available' : 'Busy'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
