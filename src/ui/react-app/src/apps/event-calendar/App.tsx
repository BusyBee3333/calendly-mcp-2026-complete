import React, { useState, useEffect } from 'react';
import { useCallTool } from '../../hooks/useCallTool';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import '../../styles/common.css';

export default function EventCalendar() {
  const { callTool, loading, error } = useCallTool();
  const [events, setEvents] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  const loadEvents = async () => {
    try {
      const user = await callTool('calendly_get_current_user', {});
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const result = await callTool('calendly_list_events', {
        user: user.uri,
        min_start_time: startOfMonth.toISOString(),
        max_start_time: endOfMonth.toISOString(),
        sort: 'start_time:asc',
      });
      setEvents(result.collection || []);
    } catch (err) {
      console.error(err);
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_time);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth();

  return (
    <div className="app-container">
      <div className="header">
        <h1>Event Calendar</h1>
        <p>Monthly calendar view of events</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button className="btn btn-secondary" onClick={previousMonth}>
          ← Previous
        </button>
        <h2>{monthYear}</h2>
        <button className="btn btn-secondary" onClick={nextMonth}>
          Next →
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} style={{ padding: '8px', fontWeight: 'bold', textAlign: 'center' }}>
            {day}
          </div>
        ))}
        {days.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} style={{ minHeight: '100px', border: '1px solid #e0e0e0', borderRadius: '6px' }} />;
          }
          const dayEvents = getEventsForDate(date);
          const isToday =
            date.getDate() === new Date().getDate() &&
            date.getMonth() === new Date().getMonth() &&
            date.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={idx}
              style={{
                minHeight: '100px',
                border: isToday ? '2px solid #0066cc' : '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '8px',
                background: isToday ? '#e6f2ff' : '#fff',
              }}
            >
              <div style={{ fontWeight: isToday ? 'bold' : 'normal', marginBottom: '4px' }}>
                {date.getDate()}
              </div>
              {dayEvents.map((event) => (
                <div
                  key={event.uri}
                  style={{
                    fontSize: '11px',
                    padding: '4px',
                    marginBottom: '4px',
                    background: event.status === 'active' ? '#d4edda' : '#f8d7da',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={`${event.name} - ${new Date(event.start_time).toLocaleTimeString()}`}
                >
                  {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                  {event.name}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '20px' }}>
        <Card title="Legend">
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
            <div>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#d4edda', marginRight: '4px', borderRadius: '2px' }} />
              Active Events
            </div>
            <div>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#f8d7da', marginRight: '4px', borderRadius: '2px' }} />
              Canceled Events
            </div>
            <div>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid #0066cc', marginRight: '4px', borderRadius: '2px' }} />
              Today
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
