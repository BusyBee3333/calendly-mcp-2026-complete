import React, { useState, useEffect } from 'react';
import { useCallTool } from '../../hooks/useCallTool';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import '../../styles/common.css';

export default function WebhookManager() {
  const { callTool, loading, error } = useCallTool();
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [orgUri, setOrgUri] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    events: [] as string[],
    scope: 'organization',
  });

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    try {
      const user = await callTool('calendly_get_current_user', {});
      const org = user.current_organization;
      setOrgUri(org);
      const result = await callTool('calendly_list_webhooks', {
        organization: org,
        scope: 'organization',
      });
      setWebhooks(result.collection || []);
    } catch (err) {
      console.error(err);
    }
  };

  const createWebhook = async () => {
    try {
      await callTool('calendly_create_webhook', {
        url: formData.url,
        events: formData.events,
        organization: orgUri,
        scope: formData.scope,
      });
      setShowForm(false);
      setFormData({ url: '', events: [], scope: 'organization' });
      loadWebhooks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteWebhook = async (uri: string) => {
    if (!confirm('Delete this webhook?')) return;
    try {
      await callTool('calendly_delete_webhook', { webhook_uri: uri });
      loadWebhooks();
    } catch (err) {
      console.error(err);
    }
  };

  const eventOptions = [
    'invitee.created',
    'invitee.canceled',
    'routing_form_submission.created',
    'invitee_no_show.created',
    'invitee_no_show.deleted',
  ];

  return (
    <div className="app-container">
      <div className="header">
        <h1>Webhook Manager</h1>
        <p>Manage Calendly webhook subscriptions</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Webhook'}
        </button>
      </div>

      {showForm && (
        <Card title="Create New Webhook">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label className="label">Callback URL</label>
              <input
                className="input"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/webhook"
              />
            </div>
            <div>
              <label className="label">Events</label>
              {eventOptions.map((event) => (
                <div key={event} style={{ marginBottom: '8px' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.events.includes(event)}
                      onChange={(e) => {
                        const newEvents = e.target.checked
                          ? [...formData.events, event]
                          : formData.events.filter((ev) => ev !== event);
                        setFormData({ ...formData, events: newEvents });
                      }}
                      style={{ marginRight: '8px' }}
                    />
                    {event}
                  </label>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={createWebhook} disabled={loading || !formData.url || formData.events.length === 0}>
              Create
            </button>
          </div>
        </Card>
      )}

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <div className="grid grid-2">
        {webhooks.map((webhook) => (
          <Card key={webhook.uri}>
            <div style={{ marginBottom: '12px' }}>
              <Badge variant={webhook.state === 'active' ? 'success' : 'danger'}>
                {webhook.state}
              </Badge>
            </div>
            <div style={{ marginBottom: '12px', fontSize: '14px', wordBreak: 'break-all' }}>
              <strong>URL:</strong> {webhook.callback_url}
            </div>
            <div style={{ marginBottom: '12px', fontSize: '14px' }}>
              <strong>Events:</strong> {webhook.events.join(', ')}
            </div>
            <div style={{ marginBottom: '12px', fontSize: '12px', color: '#666' }}>
              Created: {new Date(webhook.created_at).toLocaleString()}
            </div>
            <button className="btn btn-danger" onClick={() => deleteWebhook(webhook.uri)} disabled={loading}>
              Delete
            </button>
          </Card>
        ))}
      </div>

      {webhooks.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No webhooks found
        </div>
      )}
    </div>
  );
}
