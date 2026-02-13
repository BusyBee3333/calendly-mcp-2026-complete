import React, { useState, useEffect } from 'react';
import { useCallTool } from '../../hooks/useCallTool';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import '../../styles/common.css';

export default function NoShowTracker() {
  const { callTool, loading, error } = useCallTool();
  const [events, setEvents] = useState<any[]>([]);
  const [noShowInvitees, setNoShowInvitees] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await callTool('calendly_get_current_user', {});
      const eventsResult = await callTool('calendly_list_events', {
        user: user.uri,
        count: 100,
        status: 'active',
      });
      
      const events = eventsResult.collection || [];
      setEvents(events);

      // Load all invitees and filter those with no-shows
      const allNoShows: any[] = [];
      for (const event of events) {
        const inviteesResult = await callTool('calendly_list_event_invitees', {
          event_uri: event.uri,
        });
        const invitees = inviteesResult.collection || [];
        const noShows = invitees.filter((inv: any) => inv.no_show);
        allNoShows.push(...noShows.map((inv: any) => ({ ...inv, event })));
      }
      setNoShowInvitees(allNoShows);
    } catch (err) {
      console.error(err);
    }
  };

  const removeNoShow = async (invitee: any) => {
    if (!confirm('Remove no-show marking?')) return;
    try {
      await callTool('calendly_delete_no_show', {
        no_show_uri: invitee.no_show.uri,
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>No-Show Tracker</h1>
        <p>Track and manage no-show invitees</p>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <Card>
        <div className="stat">
          <div className="stat-value">{noShowInvitees.length}</div>
          <div className="stat-label">Total No-Shows</div>
        </div>
      </Card>

      {noShowInvitees.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Event</th>
              <th>Event Date</th>
              <th>Marked No-Show</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {noShowInvitees.map((invitee, idx) => (
              <tr key={idx}>
                <td>{invitee.name}</td>
                <td>{invitee.email}</td>
                <td>{invitee.event.name}</td>
                <td>{new Date(invitee.event.start_time).toLocaleString()}</td>
                <td>{new Date(invitee.no_show.created_at).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => removeNoShow(invitee)}
                    disabled={loading}
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  >
                    Remove Marking
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            No no-shows found
          </div>
        )
      )}
    </div>
  );
}
