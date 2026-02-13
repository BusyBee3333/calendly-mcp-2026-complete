import React, { useState, useEffect } from 'react';
import { useCallTool } from '../../hooks/useCallTool';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import '../../styles/common.css';

export default function OrganizationOverview() {
  const { callTool, loading, error } = useCallTool();
  const [organization, setOrganization] = useState<any>(null);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = async () => {
    try {
      const user = await callTool('calendly_get_current_user', {});
      const org = await callTool('calendly_get_organization', {
        organization_uri: user.current_organization,
      });
      setOrganization(org);

      const membershipsResult = await callTool('calendly_list_organization_memberships', {
        organization_uri: org.uri,
      });
      setMemberships(membershipsResult.collection || []);

      const invitationsResult = await callTool('calendly_list_organization_invitations', {
        organization_uri: org.uri,
      });
      setInvitations(invitationsResult.collection || []);
    } catch (err) {
      console.error(err);
    }
  };

  const revokeInvitation = async (uri: string) => {
    if (!confirm('Revoke this invitation?')) return;
    try {
      await callTool('calendly_revoke_organization_invitation', {
        invitation_uri: uri,
      });
      loadOrganization();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Organization Overview</h1>
        <p>Manage your organization</p>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {organization && (
        <Card title="Organization Details">
          <div style={{ fontSize: '14px' }}>
            <p><strong>Name:</strong> {organization.name}</p>
            <p><strong>Slug:</strong> {organization.slug}</p>
            <p><strong>Created:</strong> {new Date(organization.created_at).toLocaleDateString()}</p>
          </div>
        </Card>
      )}

      <Card title={`Members (${memberships.length})`}>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((membership) => (
              <tr key={membership.uri}>
                <td>{membership.user.name}</td>
                <td>{membership.user.email}</td>
                <td>
                  <Badge variant="info">{membership.role}</Badge>
                </td>
                <td>{new Date(membership.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title={`Pending Invitations (${invitations.length})`}>
        {invitations.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Sent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((invitation) => (
                <tr key={invitation.uri}>
                  <td>{invitation.email}</td>
                  <td>
                    <Badge variant={invitation.status === 'pending' ? 'warning' : 'info'}>
                      {invitation.status}
                    </Badge>
                  </td>
                  <td>{new Date(invitation.last_sent_at).toLocaleDateString()}</td>
                  <td>
                    {invitation.status === 'pending' && (
                      <button
                        className="btn btn-danger"
                        onClick={() => revokeInvitation(invitation.uri)}
                        disabled={loading}
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#999' }}>No pending invitations</p>
        )}
      </Card>
    </div>
  );
}
