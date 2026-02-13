import React, { useState, useEffect } from 'react';
import { useCallTool } from '../../hooks/useCallTool';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import '../../styles/common.css';

export default function AvailabilityManager() {
  const { callTool, loading, error } = useCallTool();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [userUri, setUserUri] = useState('');

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const user = await callTool('calendly_get_current_user', {});
      setUserUri(user.uri);
      const result = await callTool('calendly_list_user_availability_schedules', {
        user_uri: user.uri,
      });
      setSchedules(result.collection || []);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDayName = (wday: string) => {
    const days: Record<string, string> = {
      sunday: 'Sunday',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
    };
    return days[wday] || wday;
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Availability Manager</h1>
        <p>Manage your availability schedules</p>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <div className="grid grid-2">
        {schedules.map((schedule) => (
          <Card key={schedule.uri}>
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ display: 'inline', marginRight: '8px' }}>{schedule.name}</h3>
              {schedule.default && <Badge variant="success">Default</Badge>}
            </div>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
              Timezone: {schedule.timezone}
            </p>
            <div>
              <strong style={{ fontSize: '14px' }}>Availability Rules:</strong>
              {schedule.rules.map((rule: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px',
                    marginTop: '8px',
                    background: '#f9f9f9',
                    borderRadius: '6px',
                  }}
                >
                  {rule.type === 'wday' ? (
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                      {getDayName(rule.wday)}
                    </div>
                  ) : (
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                      Date: {rule.date}
                    </div>
                  )}
                  {rule.intervals.map((interval: any, i: number) => (
                    <div key={i} style={{ fontSize: '14px', color: '#666', marginLeft: '12px' }}>
                      {formatTime(interval.from)} - {formatTime(interval.to)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {schedules.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No availability schedules found
        </div>
      )}
    </div>
  );
}
