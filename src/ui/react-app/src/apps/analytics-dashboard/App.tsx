import React, { useState, useEffect } from 'react';
import { useCallTool } from '../../hooks/useCallTool';
import { Card } from '../../components/Card';
import '../../styles/common.css';

export default function AnalyticsDashboard() {
  const { callTool, loading } = useCallTool();
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    canceledEvents: 0,
    totalInvitees: 0,
    noShows: 0,
    eventTypes: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const user = await callTool('calendly_get_current_user', {});
      
      // Get events
      const eventsResult = await callTool('calendly_list_events', {
        user: user.uri,
        count: 100,
      });
      const events = eventsResult.collection || [];
      
      // Get event types
      const eventTypesResult = await callTool('calendly_list_event_types', {
        user: user.uri,
      });
      
      // Calculate stats
      const activeEvents = events.filter((e: any) => e.status === 'active').length;
      const canceledEvents = events.filter((e: any) => e.status === 'canceled').length;
      const totalInvitees = events.reduce((sum: number, e: any) => sum + e.invitees_counter.total, 0);
      
      setStats({
        totalEvents: events.length,
        activeEvents,
        canceledEvents,
        totalInvitees,
        noShows: 0,
        eventTypes: eventTypesResult.collection?.length || 0,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Analytics Dashboard</h1>
        <p>Overview of your Calendly metrics</p>
      </div>

      {loading && <div className="loading">Loading...</div>}

      <div className="grid grid-3">
        <Card>
          <div className="stat">
            <div className="stat-value">{stats.totalEvents}</div>
            <div className="stat-label">Total Events</div>
          </div>
        </Card>
        <Card>
          <div className="stat">
            <div className="stat-value">{stats.activeEvents}</div>
            <div className="stat-label">Active Events</div>
          </div>
        </Card>
        <Card>
          <div className="stat">
            <div className="stat-value">{stats.canceledEvents}</div>
            <div className="stat-label">Canceled Events</div>
          </div>
        </Card>
        <Card>
          <div className="stat">
            <div className="stat-value">{stats.totalInvitees}</div>
            <div className="stat-label">Total Invitees</div>
          </div>
        </Card>
        <Card>
          <div className="stat">
            <div className="stat-value">{stats.eventTypes}</div>
            <div className="stat-label">Event Types</div>
          </div>
        </Card>
        <Card>
          <div className="stat">
            <div className="stat-value">{stats.noShows}</div>
            <div className="stat-label">No-Shows</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
