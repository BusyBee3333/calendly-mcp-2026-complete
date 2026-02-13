import React from 'react';
import './styles.css';

export default function AnalyticsDashboard() {
  const stats = {
    totalEvents: 245,
    activeEvents: 32,
    totalInvitees: 489,
    noShows: 12,
    cancelRate: '4.9%',
    avgDuration: '45 min',
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>📊 Analytics Dashboard</h1>
        <p>Calendly metrics and insights</p>
      </header>
      <div className="detail-grid">
        <div className="grid-item">
          <h3>Total Events</h3>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#58a6ff'}}>{stats.totalEvents}</div>
        </div>
        <div className="grid-item">
          <h3>Active Events</h3>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#58a6ff'}}>{stats.activeEvents}</div>
        </div>
        <div className="grid-item">
          <h3>Total Invitees</h3>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#58a6ff'}}>{stats.totalInvitees}</div>
        </div>
        <div className="grid-item">
          <h3>No-Shows</h3>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#f85149'}}>{stats.noShows}</div>
        </div>
        <div className="grid-item">
          <h3>Cancel Rate</h3>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#d29922'}}>{stats.cancelRate}</div>
        </div>
        <div className="grid-item">
          <h3>Avg Duration</h3>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#58a6ff'}}>{stats.avgDuration}</div>
        </div>
      </div>
    </div>
  );
}
