import React, { useState } from 'react';
import './styles.css';

export default function NoShowTracker() {
  const [noShows] = useState([
    { id: '1', invitee: 'John Doe', event: 'Sales Demo', date: '2024-02-10', email: 'john@example.com' },
    { id: '2', invitee: 'Jane Smith', event: 'Onboarding', date: '2024-02-12', email: 'jane@example.com' },
  ]);

  const unmarkNoShow = (id: string) => {
    // Call MCP tool calendly_unmark_no_show
    alert(`Removing no-show status for ${id}`);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>🚫 No-Show Tracker</h1>
        <p>Track and manage no-shows</p>
      </header>
      {noShows.map(noShow => (
        <div key={noShow.id} className="detail-card">
          <h3>{noShow.invitee}</h3>
          <p><strong>Event:</strong> {noShow.event}</p>
          <p><strong>Date:</strong> {noShow.date}</p>
          <p><strong>Email:</strong> {noShow.email}</p>
          <button onClick={() => unmarkNoShow(noShow.id)} style={{marginTop: '0.5rem'}}>
            Remove No-Show Status
          </button>
        </div>
      ))}
    </div>
  );
}
