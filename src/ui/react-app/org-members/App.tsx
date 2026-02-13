import React, { useState } from 'react';
import './styles.css';

export default function OrgMembers() {
  const [members] = useState([
    { id: '1', name: 'Alice Johnson', email: 'alice@company.com', role: 'admin' },
    { id: '2', name: 'Bob Wilson', email: 'bob@company.com', role: 'user' },
  ]);
  const [newEmail, setNewEmail] = useState('');

  const inviteMember = async () => {
    // Call MCP tool calendly_invite_user
    alert(`Inviting ${newEmail}`);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>👨‍💼 Organization Members</h1>
        <p>Manage team members</p>
      </header>
      <div className="search-box">
        <input
          type="email"
          placeholder="Email to invite"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button onClick={inviteMember}>Invite Member</button>
      </div>
      {members.map(member => (
        <div key={member.id} className="detail-card">
          <h3>{member.name}</h3>
          <p><strong>Email:</strong> {member.email}</p>
          <p><strong>Role:</strong> {member.role}</p>
          <button className="btn-cancel" style={{marginTop: '0.5rem'}}>Remove</button>
        </div>
      ))}
    </div>
  );
}
