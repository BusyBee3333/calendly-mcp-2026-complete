import React, { useState } from 'react';
import './styles.css';

export default function WebhookManager() {
  const [webhooks] = useState([
    { id: '1', url: 'https://api.example.com/webhook', events: ['invitee.created'], status: 'active' },
  ]);
  const [newUrl, setNewUrl] = useState('');

  const createWebhook = async () => {
    // Call MCP tool calendly_create_webhook_subscription
    alert(`Creating webhook for ${newUrl}`);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>🪝 Webhook Manager</h1>
        <p>Manage webhook subscriptions</p>
      </header>
      <div className="search-box">
        <input
          type="url"
          placeholder="Webhook URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <button onClick={createWebhook}>Create Webhook</button>
      </div>
      {webhooks.map(webhook => (
        <div key={webhook.id} className="detail-card">
          <p><strong>URL:</strong> {webhook.url}</p>
          <p><strong>Events:</strong> {webhook.events.join(', ')}</p>
          <span className={`status-badge ${webhook.status}`}>{webhook.status}</span>
          <button className="btn-cancel" style={{marginTop: '1rem'}}>Delete</button>
        </div>
      ))}
    </div>
  );
}
