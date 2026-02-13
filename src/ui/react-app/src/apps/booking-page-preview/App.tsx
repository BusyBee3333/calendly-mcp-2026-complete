import React, { useState, useEffect } from 'react';
import { useCallTool } from '../../hooks/useCallTool';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import '../../styles/common.css';

export default function BookingPagePreview() {
  const { callTool, loading, error } = useCallTool();
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<any>(null);

  useEffect(() => {
    loadEventTypes();
  }, []);

  const loadEventTypes = async () => {
    try {
      const user = await callTool('calendly_get_current_user', {});
      const result = await callTool('calendly_list_event_types', {
        user: user.uri,
      });
      setEventTypes(result.collection || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadEventTypeDetail = async (uri: string) => {
    try {
      const eventType = await callTool('calendly_get_event_type', {
        event_type_uri: uri,
      });
      setSelectedEventType(eventType);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Booking Page Preview</h1>
        <p>Preview your event type booking pages</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label className="label">Select Event Type</label>
        <select
          className="input"
          value={selectedEventType?.uri || ''}
          onChange={(e) => loadEventTypeDetail(e.target.value)}
        >
          <option value="">-- Select event type --</option>
          {eventTypes.map((et) => (
            <option key={et.uri} value={et.uri}>
              {et.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {selectedEventType && (
        <>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ marginBottom: '8px' }}>{selectedEventType.name}</h2>
                <div style={{ marginBottom: '12px' }}>
                  <Badge variant={selectedEventType.active ? 'success' : 'warning'}>
                    {selectedEventType.active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="info" style={{ marginLeft: '8px' }}>
                    {selectedEventType.duration} minutes
                  </Badge>
                  <Badge variant="info" style={{ marginLeft: '8px' }}>
                    {selectedEventType.kind}
                  </Badge>
                </div>
                {selectedEventType.description_plain && (
                  <p style={{ marginBottom: '12px', color: '#666' }}>
                    {selectedEventType.description_plain}
                  </p>
                )}
                {selectedEventType.internal_note && (
                  <div
                    style={{
                      padding: '12px',
                      background: '#fff3cd',
                      borderRadius: '6px',
                      marginBottom: '12px',
                    }}
                  >
                    <strong>Internal Note:</strong> {selectedEventType.internal_note}
                  </div>
                )}
                <a
                  href={selectedEventType.scheduling_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  Open Booking Page
                </a>
              </div>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  background: selectedEventType.color || '#0066cc',
                  borderRadius: '6px',
                  marginLeft: '16px',
                }}
                title={`Color: ${selectedEventType.color}`}
              />
            </div>
          </Card>

          {selectedEventType.custom_questions && selectedEventType.custom_questions.length > 0 && (
            <Card title="Custom Questions">
              {selectedEventType.custom_questions.map((q: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    marginBottom: '8px',
                    background: '#f9f9f9',
                    borderRadius: '6px',
                  }}
                >
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    {q.position}. {q.name}
                    {q.required && <span style={{ color: '#dc3545' }}> *</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Type: {q.type}
                    {!q.enabled && <Badge variant="warning" style={{ marginLeft: '8px' }}>Disabled</Badge>}
                  </div>
                  {q.answer_choices && q.answer_choices.length > 0 && (
                    <div style={{ marginTop: '6px', fontSize: '14px' }}>
                      Choices: {q.answer_choices.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </Card>
          )}
        </>
      )}
    </div>
  );
}
