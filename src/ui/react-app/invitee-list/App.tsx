import React, { useState } from 'react';
import './styles.css';

export default function InviteeList() {
  const [invitees] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', event: 'Sales Demo', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', event: 'Onboarding', status: 'active' },
  ]);

  const markNoShow = (id: string) => {
    // Call MCP tool calendly_mark_no_show
    alert(`Marking invitee ${id} as no-show`);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>👥 Invitee List</h1>
        <p>Manage event invitees</p>
      </header>
      {invitees.map(invitee => (
        <div key={invitee.id} className="detail-card">
          <h3>{invitee.name}</h3>
          <p><strong>Email:</strong> {invitee.email}</p>
          <p><strong>Event:</strong> {invitee.event}</p>
          <span className={`status-badge ${invitee.status}`}>{invitee.status}</span>
          <div style={{marginTop: '1rem'}}>
            <button onClick={() => markNoShow(invitee.id)}>Mark No-Show</button>
          </div>
        </div>
      ))}
    </div>
  );
}
