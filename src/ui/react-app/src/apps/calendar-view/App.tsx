import React, { useState, useEffect } from 'react';
import { useCallTool } from '../../hooks/useCallTool';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import '../../styles/common.css';

export default function CalendarView() {
  const { callTool, loading, error } = useCallTool();
  const [events, setEvents] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    loadEvents();
  }, [timeRange]);

  const loadEvents = async () => {
    try {
      const user = await callTool('calendly_get_current_user', {});
      const now = new Date();
      const minTime = new Date(now);
      const maxTime = new Date(now);

      if (timeRange === 'week') {
        minTime.setDate(now.getDate() - 7);
        maxTime.setDate(now.getDate() + 7);
      } else if (timeRange === 'month') {
        minTime.setDate(now.getDate() - 30);
        maxTime.setDate(now.getDate() + 30);
      }

      const result = await callTool('calendly_list_events', {
        user: user.uri,
        min_start_time: minTime.toISOString(),
        max_start_time: maxTime.toISOString(),
        sort: 'start_time:asc',
      });
      setEvents(result.collection || []);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const groupByDate = () => {
    const grouped: Record<string, any[]> = {};
    events.forEach((event) => {
      const date = new Date(event.start_time).toLocaleDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(event);
    });
    return grouped;
  };

  const grouped = groupByDate();

  return (
    <div className="app-container">
      <div className="header">
        <h1>Calendar View</h1>
        <p>View your scheduled events</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <select
          className="input"
          style={{ width: 'auto' }}
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {Object.keys(grouped).map((date) => (
        <div key={date} style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>{date}</h3>
          {grouped[date].map((event) => (
            <Card key={event.uri}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h4 style={{ marginBottom: '8px', fontSize: '16px' }}>{event.name}</h4>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    {formatDate(event.start_time)} - {new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <Badge variant={event.status === 'active' ? 'success' : 'danger'}>
                    {event.status}
                  </Badge>
                  {event.location && (
                    <div style={{ marginTop: '8px', fontSize: '14px' }}>
                      📍 {event.location.type}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '14px', textAlign: 'right' }}>
                  <div>{event.invitees_counter.active} / {event.invitees_counter.limit} invitees</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ))}

      {events.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No events found in this time range
        </div>
      )}
    </div>
  );
}
