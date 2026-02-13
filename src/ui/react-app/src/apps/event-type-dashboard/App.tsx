import React, { useState, useEffect } from 'react';
import { useCallTool } from '../../hooks/useCallTool';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import '../../styles/common.css';

export default function EventTypeDashboard() {
  const { callTool, loading, error } = useCallTool();
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [userUri, setUserUri] = useState('');

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await callTool('calendly_get_current_user', {});
      setUserUri(user.uri);
      loadEventTypes(user.uri);
    } catch (err) {
      console.error(err);
    }
  };

  const loadEventTypes = async (uri: string) => {
    try {
      const result = await callTool('calendly_list_event_types', { user: uri });
      setEventTypes(result.collection || []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleActive = async (eventType: any) => {
    try {
      await callTool('calendly_update_event_type', {
        event_type_uri: eventType.uri,
        active: !eventType.active,
      });
      loadEventTypes(userUri);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Event Type Dashboard</h1>
        <p>Manage your Calendly event types</p>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <div className="grid grid-3">
        {eventTypes.map((et) => (
          <Card key={et.uri} title={et.name}>
            <div style={{ marginBottom: '12px' }}>
              <Badge variant={et.active ? 'success' : 'warning'}>
                {et.active ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="info" style={{ marginLeft: '8px' }}>
                {et.duration} min
              </Badge>
            </div>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
              {et.description_plain || 'No description'}
            </p>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>
              Type: {et.kind} • {et.type}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-primary"
                onClick={() => toggleActive(et)}
                disabled={loading}
              >
                {et.active ? 'Deactivate' : 'Activate'}
              </button>
              <a
                href={et.scheduling_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                View
              </a>
            </div>
          </Card>
        ))}
      </div>

      {eventTypes.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No event types found
        </div>
      )}
    </div>
  );
}
