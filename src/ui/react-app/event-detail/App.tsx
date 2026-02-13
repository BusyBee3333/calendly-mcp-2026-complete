import React, { useState, useEffect } from 'react';
import './styles.css';

export default function EventDetail() {
  const [event, setEvent] = useState<any>(null);
  const [invitees, setInvitees] = useState<any[]>([]);
  const [eventUuid, setEventUuid] = useState('');

  const loadEvent = async () => {
    if (!eventUuid) return;
    // Call MCP tool calendly_get_event
    setEvent({
      name: 'Sales Demo',
      status: 'active',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 3600000).toISOString(),
      location: { type: 'zoom', join_url: 'https://zoom.us/j/123' },
      meeting_notes_plain: 'Please prepare your questions.',
    });
  };

  const loadInvitees = async () => {
    if (!eventUuid) return;
    // Call MCP tool calendly_list_event_invitees
    setInvitees([
      { name: 'John Doe', email: 'john@example.com', status: 'active' },
    ]);
  };

  const cancelEvent = async () => {
    if (!confirm('Cancel this event?')) return;
    // Call MCP tool calendly_cancel_event
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>📋 Event Details</h1>
      </header>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter Event UUID..."
          value={eventUuid}
          onChange={(e) => setEventUuid(e.target.value)}
        />
        <button onClick={loadEvent}>Load Event</button>
      </div>

      {event && (
        <div className="detail-card">
          <h2>{event.name}</h2>
          <div className="detail-grid">
            <div><strong>Status:</strong> <span className={`status-badge ${event.status}`}>{event.status}</span></div>
            <div><strong>Start:</strong> {new Date(event.start_time).toLocaleString()}</div>
            <div><strong>End:</strong> {new Date(event.end_time).toLocaleString()}</div>
            <div><strong>Location:</strong> {event.location.type}</div>
          </div>
          {event.meeting_notes_plain && (
            <div className="notes">
              <h3>Meeting Notes</h3>
              <p>{event.meeting_notes_plain}</p>
            </div>
          )}
          <div className="invitees-section">
            <h3>Invitees</h3>
            {invitees.map((inv, i) => (
              <div key={i} className="invitee-row">
                <span>{inv.name}</span>
                <span>{inv.email}</span>
                <span className={`status-badge ${inv.status}`}>{inv.status}</span>
              </div>
            ))}
          </div>
          {event.status === 'active' && (
            <button onClick={cancelEvent} className="btn-cancel">Cancel Event</button>
          )}
        </div>
      )}
    </div>
  );
}
