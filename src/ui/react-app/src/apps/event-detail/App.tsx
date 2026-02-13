import React, { useState, useEffect } from 'react';
import { useCallTool } from '../../hooks/useCallTool';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import '../../styles/common.css';

export default function EventDetail() {
  const { callTool, loading, error } = useCallTool();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [invitees, setInvitees] = useState<any[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const user = await callTool('calendly_get_current_user', {});
      const result = await callTool('calendly_list_events', {
        user: user.uri,
        count: 50,
        sort: 'start_time:desc',
      });
      setEvents(result.collection || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadEventDetail = async (eventUri: string) => {
    try {
      const event = await callTool('calendly_get_event', { event_uri: eventUri });
      setSelectedEvent(event);

      const inviteesResult = await callTool('calendly_list_event_invitees', {
        event_uri: eventUri,
      });
      setInvitees(inviteesResult.collection || []);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEvent = async () => {
    if (!selectedEvent || !confirm('Cancel this event?')) return;
    try {
      await callTool('calendly_cancel_event', {
        event_uri: selectedEvent.uri,
        reason: 'Canceled via MCP',
      });
      loadEvents();
      setSelectedEvent(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Event Detail View</h1>
        <p>View detailed information about events</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label className="label">Select Event</label>
        <select
          className="input"
          value={selectedEvent?.uri || ''}
          onChange={(e) => loadEventDetail(e.target.value)}
        >
          <option value="">-- Select an event --</option>
          {events.map((event) => (
            <option key={event.uri} value={event.uri}>
              {event.name} - {new Date(event.start_time).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {selectedEvent && (
        <>
          <Card title="Event Information">
            <div style={{ fontSize: '14px' }}>
              <h3 style={{ marginBottom: '12px' }}>{selectedEvent.name}</h3>
              <p style={{ marginBottom: '8px' }}>
                <strong>Status:</strong>{' '}
                <Badge variant={selectedEvent.status === 'active' ? 'success' : 'danger'}>
                  {selectedEvent.status}
                </Badge>
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>Start:</strong> {new Date(selectedEvent.start_time).toLocaleString()}
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>End:</strong> {new Date(selectedEvent.end_time).toLocaleString()}
              </p>
              {selectedEvent.location && (
                <p style={{ marginBottom: '8px' }}>
                  <strong>Location:</strong> {selectedEvent.location.type}
                  {selectedEvent.location.join_url && (
                    <a
                      href={selectedEvent.location.join_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: '8px' }}
                    >
                      Join
                    </a>
                  )}
                </p>
              )}
              <p style={{ marginBottom: '8px' }}>
                <strong>Invitees:</strong> {selectedEvent.invitees_counter.active} /{' '}
                {selectedEvent.invitees_counter.limit}
              </p>
              {selectedEvent.meeting_notes_plain && (
                <div style={{ marginTop: '12px' }}>
                  <strong>Meeting Notes:</strong>
                  <p style={{ marginTop: '4px', whiteSpace: 'pre-wrap' }}>
                    {selectedEvent.meeting_notes_plain}
                  </p>
                </div>
              )}
              {selectedEvent.status === 'active' && (
                <button
                  className="btn btn-danger"
                  onClick={cancelEvent}
                  disabled={loading}
                  style={{ marginTop: '16px' }}
                >
                  Cancel Event
                </button>
              )}
            </div>
          </Card>

          <Card title={`Invitees (${invitees.length})`}>
            {invitees.map((invitee) => (
              <div
                key={invitee.uri}
                style={{
                  padding: '12px',
                  marginBottom: '8px',
                  background: '#f9f9f9',
                  borderRadius: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h4>{invitee.name}</h4>
                    <p style={{ color: '#666', fontSize: '14px' }}>{invitee.email}</p>
                    <div style={{ marginTop: '4px' }}>
                      <Badge variant={invitee.status === 'active' ? 'success' : 'danger'}>
                        {invitee.status}
                      </Badge>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>
                    {invitee.timezone}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  );
}
