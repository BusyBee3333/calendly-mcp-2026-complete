import React, { useState, useEffect } from 'react';
import { useCallTool } from '../../hooks/useCallTool';
import { Card } from '../../components/Card';
import '../../styles/common.css';

export default function UserProfile() {
  const { callTool, loading, error } = useCallTool();
  const [user, setUser] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await callTool('calendly_get_current_user', {});
      setUser(userData);

      const schedulesResult = await callTool('calendly_list_user_availability_schedules', {
        user_uri: userData.uri,
      });
      setSchedules(schedulesResult.collection || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>User Profile</h1>
        <p>View your Calendly profile and settings</p>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {user && (
        <>
          <Card title="Profile Information">
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              {user.avatar_url && (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  style={{ width: '80px', height: '80px', borderRadius: '50%' }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '8px' }}>{user.name}</h3>
                <p style={{ color: '#666', marginBottom: '4px' }}>{user.email}</p>
                <p style={{ color: '#666', marginBottom: '4px' }}>Slug: {user.slug}</p>
                <p style={{ color: '#666', marginBottom: '8px' }}>Timezone: {user.timezone}</p>
                <a
                  href={user.scheduling_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ textDecoration: 'none', display: 'inline-block' }}
                >
                  View Scheduling Page
                </a>
              </div>
            </div>
          </Card>

          <Card title={`Availability Schedules (${schedules.length})`}>
            {schedules.map((schedule) => (
              <div key={schedule.uri} style={{ marginBottom: '16px', padding: '12px', background: '#f9f9f9', borderRadius: '6px' }}>
                <h4 style={{ marginBottom: '8px' }}>
                  {schedule.name} {schedule.default && <span style={{ color: '#0066cc' }}>(Default)</span>}
                </h4>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Timezone: {schedule.timezone}
                </p>
                <div style={{ marginTop: '8px', fontSize: '14px' }}>
                  <strong>Rules:</strong>
                  {schedule.rules.map((rule: any, idx: number) => (
                    <div key={idx} style={{ marginTop: '4px', paddingLeft: '12px' }}>
                      • {rule.type === 'wday' ? `Day: ${rule.wday}` : `Date: ${rule.date}`}
                      {rule.intervals.map((interval: any, i: number) => (
                        <span key={i} style={{ marginLeft: '8px' }}>
                          {interval.from} - {interval.to}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {schedules.length === 0 && (
              <p style={{ color: '#999' }}>No availability schedules found</p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
