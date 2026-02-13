import React, { useState } from 'react';
import './styles.css';

export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventType: '',
    time: '',
  });

  return (
    <div className="app-container">
      <header className="header">
        <h1>📝 Booking Flow</h1>
        <p>Create a booking experience</p>
      </header>
      <div className="detail-card">
        <h2>Step {step} of 3</h2>
        {step === 1 && (
          <div>
            <h3>Select Event Type</h3>
            <select onChange={(e) => setFormData({...formData, eventType: e.target.value})}>
              <option value="">Choose...</option>
              <option value="demo">Sales Demo (60 min)</option>
              <option value="meeting">Quick Meeting (30 min)</option>
            </select>
            <button onClick={() => setStep(2)} style={{marginTop: '1rem'}}>Next</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h3>Select Time</h3>
            <input type="datetime-local" onChange={(e) => setFormData({...formData, time: e.target.value})} />
            <div style={{marginTop: '1rem'}}>
              <button onClick={() => setStep(1)}>Back</button>
              <button onClick={() => setStep(3)} style={{marginLeft: '0.5rem'}}>Next</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h3>Your Information</h3>
            <input type="text" placeholder="Name" onChange={(e) => setFormData({...formData, name: e.target.value})} style={{marginBottom: '0.5rem'}} />
            <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <div style={{marginTop: '1rem'}}>
              <button onClick={() => setStep(2)}>Back</button>
              <button style={{marginLeft: '0.5rem'}}>Book Event</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
