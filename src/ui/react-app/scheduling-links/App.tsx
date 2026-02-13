import React, { useState } from 'react';
import './styles.css';

export default function SchedulingLinks() {
  const [links, setLinks] = useState<any[]>([]);
  const [eventTypeUri, setEventTypeUri] = useState('');

  const createLink = async () => {
    // Call MCP tool calendly_create_scheduling_link
    const newLink = {
      url: 'https://calendly.com/link/abc123',
      created: new Date().toISOString(),
    };
    setLinks([...links, newLink]);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>🔗 Scheduling Links</h1>
        <p>Create single-use scheduling links</p>
      </header>
      <div className="search-box">
        <input
          type="text"
          placeholder="Event Type URI"
          value={eventTypeUri}
          onChange={(e) => setEventTypeUri(e.target.value)}
        />
        <button onClick={createLink}>Create Link</button>
      </div>
      {links.map((link, i) => (
        <div key={i} className="detail-card">
          <p><strong>URL:</strong> <a href={link.url} target="_blank">{link.url}</a></p>
          <p><strong>Created:</strong> {new Date(link.created).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
