import React, { useState, useEffect } from 'react';
import { useCallTool } from '../../hooks/useCallTool';
import { Card } from '../../components/Card';
import '../../styles/common.css';

export default function SchedulingLinkManager() {
  const { callTool, loading, error } = useCallTool();
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [maxCount, setMaxCount] = useState(1);
  const [generatedLink, setGeneratedLink] = useState<any>(null);

  useEffect(() => {
    loadEventTypes();
  }, []);

  const loadEventTypes = async () => {
    try {
      const user = await callTool('calendly_get_current_user', {});
      const result = await callTool('calendly_list_event_types', {
        user: user.uri,
        active: true,
      });
      setEventTypes(result.collection || []);
    } catch (err) {
      console.error(err);
    }
  };

  const generateLink = async () => {
    if (!selectedEventType) return;
    try {
      const link = await callTool('calendly_create_scheduling_link', {
        max_event_count: maxCount,
        owner: selectedEventType,
        owner_type: 'EventType',
      });
      setGeneratedLink(link);
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Scheduling Link Manager</h1>
        <p>Generate single-use scheduling links</p>
      </div>

      {error && <div className="error">{error}</div>}

      <Card title="Generate New Link">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="label">Event Type</label>
            <select
              className="input"
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
            >
              <option value="">-- Select event type --</option>
              {eventTypes.map((et) => (
                <option key={et.uri} value={et.uri}>
                  {et.name} ({et.duration} min)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Maximum Event Count</label>
            <input
              type="number"
              className="input"
              value={maxCount}
              onChange={(e) => setMaxCount(parseInt(e.target.value) || 1)}
              min="1"
              max="10"
            />
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Number of times this link can be used to book events
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={generateLink}
            disabled={loading || !selectedEventType}
          >
            {loading ? 'Generating...' : 'Generate Link'}
          </button>
        </div>
      </Card>

      {generatedLink && (
        <Card title="Generated Link">
          <div style={{ marginBottom: '12px' }}>
            <strong>Booking URL:</strong>
          </div>
          <div
            style={{
              padding: '12px',
              background: '#f9f9f9',
              borderRadius: '6px',
              marginBottom: '12px',
              wordBreak: 'break-all',
              fontFamily: 'monospace',
              fontSize: '14px',
            }}
          >
            {generatedLink.booking_url}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => copyToClipboard(generatedLink.booking_url)}
          >
            Copy to Clipboard
          </button>
        </Card>
      )}
    </div>
  );
}
