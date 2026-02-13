import React, { useState, useEffect } from 'react';
import './styles.css';

interface Event {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  invitees_counter: {
    total: number;
    active: number;
  };
}

export default function EventDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'canceled'>('active');
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    loadEvents();
  }, [statusFilter, dateRange]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      // Call MCP tool via parent window
      const params: any = {};
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      // Date range calculation
      const now = new Date();
      const minDate = new Date();
      if (dateRange === 'week') {
        minDate.setDate(now.getDate() - 7);
      } else if (dateRange === 'month') {
        minDate.setMonth(now.getMonth() - 1);
      }
      
      params.min_start_time = minDate.toISOString();
      params.max_start_time = now.toISOString();
      params.sort = 'start_time:desc';

      const result = await window.parent.postMessage({
        type: 'mcp_tool_call',
        tool: 'calendly_list_scheduled_events',
        params,
      }, '*');

      // In real implementation, would listen for response
      // For now, mock data
      setEvents([
        {
          uri: 'https://api.calendly.com/scheduled_events/001',
          name: 'Sales Demo',
          status: 'active',
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600000).toISOString(),
          invitees_counter: { total: 1, active: 1 },
        },
        {
          uri: 'https://api.calendly.com/scheduled_events/002',
          name: 'Customer Onboarding',
          status: 'active',
          start_time: new Date(Date.now() - 86400000).toISOString(),
          end_time: new Date(Date.now() - 82800000).toISOString(),
          invitees_counter: { total: 2, active: 2 },
        },
      ]);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>📅 Event Dashboard</h1>
        <p>Manage your Calendly scheduled events</p>
      </header>

      <div className="filters">
        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date Range:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <button onClick={loadEvents} className="btn-refresh">↻ Refresh</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Events</h3>
          <div className="stat-value">{events.length}</div>
        </div>
        <div className="stat-card">
          <h3>Active Events</h3>
          <div className="stat-value">{events.filter(e => e.status === 'active').length}</div>
        </div>
        <div className="stat-card">
          <h3>Total Invitees</h3>
          <div className="stat-value">{events.reduce((acc, e) => acc + e.invitees_counter.total, 0)}</div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <div key={event.uri} className="event-card">
              <div className="event-header">
                <h3>{event.name}</h3>
                <span className={`status-badge ${event.status}`}>{event.status}</span>
              </div>
              <div className="event-details">
                <p><strong>Start:</strong> {formatDate(event.start_time)}</p>
                <p><strong>End:</strong> {formatDate(event.end_time)}</p>
                <p><strong>Invitees:</strong> {event.invitees_counter.active} / {event.invitees_counter.total}</p>
              </div>
              <div className="event-actions">
                <button className="btn-view">View Details</button>
                {event.status === 'active' && (
                  <button className="btn-cancel">Cancel Event</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
