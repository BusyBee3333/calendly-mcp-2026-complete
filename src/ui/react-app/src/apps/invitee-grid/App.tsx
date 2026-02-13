import React, { useState, useEffect } from 'react';
import { useCallTool } from '../../hooks/useCallTool';
import { Badge } from '../../components/Badge';
import '../../styles/common.css';

export default function InviteeGrid() {
  const { callTool, loading, error } = useCallTool();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [invitees, setInvitees] = useState<any[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const user = await callTool('calendly_get_current_user', {});
      const result = await callTool('calendly_list_events', {
        user: user.uri,
        count: 20,
        sort: 'start_time:desc',
      });
      setEvents(result.collection || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadInvitees = async (eventUri: string) => {
    try {
      const result = await callTool('calendly_list_event_invitees', {
        event_uri: eventUri,
      });
      setInvitees(result.collection || []);
    } catch (err) {
      console.error(err);
    }
  };

  const markNoShow = async (inviteeUri: string) => {
    try {
      await callTool('calendly_create_no_show', { invitee_uri: inviteeUri });
      loadInvitees(selectedEvent);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Invitee Grid</h1>
        <p>View and manage event invitees</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label className="label">Select Event</label>
        <select
          className="input"
          value={selectedEvent}
          onChange={(e) => {
            setSelectedEvent(e.target.value);
            loadInvitees(e.target.value);
          }}
        >
          <option value="">-- Select an event --</option>
          {events.map((event) => (
            <option key={event.uri} value={event.uri}>
              {event.name} - {new Date(event.start_time).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {invitees.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Timezone</th>
              <th>Rescheduled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invitees.map((invitee) => (
              <tr key={invitee.uri}>
                <td>{invitee.name}</td>
                <td>{invitee.email}</td>
                <td>
                  <Badge variant={invitee.status === 'active' ? 'success' : 'danger'}>
                    {invitee.status}
                  </Badge>
                  {invitee.no_show && <Badge variant="warning" style={{ marginLeft: '8px' }}>No Show</Badge>}
                </td>
                <td>{invitee.timezone}</td>
                <td>{invitee.rescheduled ? 'Yes' : 'No'}</td>
                <td>
                  {!invitee.no_show && invitee.status === 'active' && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => markNoShow(invitee.uri)}
                      disabled={loading}
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                    >
                      Mark No-Show
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {invitees.length === 0 && selectedEvent && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No invitees found for this event
        </div>
      )}
    </div>
  );
}
