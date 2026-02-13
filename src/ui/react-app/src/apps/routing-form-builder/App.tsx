import React, { useState, useEffect } from 'react';
import { useCallTool } from '../../hooks/useCallTool';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import '../../styles/common.css';

export default function RoutingFormBuilder() {
  const { callTool, loading, error } = useCallTool();
  const [routingForms, setRoutingForms] = useState<any[]>([]);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    loadRoutingForms();
  }, []);

  const loadRoutingForms = async () => {
    try {
      const user = await callTool('calendly_get_current_user', {});
      const result = await callTool('calendly_list_routing_forms', {
        organization_uri: user.current_organization,
      });
      setRoutingForms(result.collection || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadFormDetail = async (formUri: string) => {
    try {
      const form = await callTool('calendly_get_routing_form', {
        routing_form_uri: formUri,
      });
      setSelectedForm(form);

      const submissionsResult = await callTool('calendly_list_routing_form_submissions', {
        routing_form_uri: formUri,
      });
      setSubmissions(submissionsResult.collection || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Routing Form Builder</h1>
        <p>Manage routing forms and view submissions</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label className="label">Select Routing Form</label>
        <select
          className="input"
          value={selectedForm?.uri || ''}
          onChange={(e) => loadFormDetail(e.target.value)}
        >
          <option value="">-- Select a form --</option>
          {routingForms.map((form) => (
            <option key={form.uri} value={form.uri}>
              {form.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {selectedForm && (
        <>
          <Card title="Form Details">
            <div style={{ fontSize: '14px' }}>
              <p style={{ marginBottom: '8px' }}>
                <strong>Name:</strong> {selectedForm.name}
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>Status:</strong>{' '}
                <Badge variant={selectedForm.published ? 'success' : 'warning'}>
                  {selectedForm.published ? 'Published' : 'Draft'}
                </Badge>
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>Created:</strong> {new Date(selectedForm.created_at).toLocaleString()}
              </p>
              <div style={{ marginTop: '16px' }}>
                <strong>Questions ({selectedForm.questions.length}):</strong>
                {selectedForm.questions.map((q: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      marginTop: '8px',
                      background: '#f9f9f9',
                      borderRadius: '6px',
                    }}
                  >
                    <div style={{ fontWeight: '500' }}>
                      {q.name} {q.required && <span style={{ color: '#dc3545' }}>*</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      Type: {q.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title={`Submissions (${submissions.length})`}>
            {submissions.length > 0 ? (
              submissions.map((submission, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#f9f9f9',
                    borderRadius: '6px',
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>
                    <strong>{submission.submitter.name || submission.submitter.email}</strong>
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                    {submission.questions_and_answers.map((qa: any, qaIdx: number) => (
                      <div key={qaIdx} style={{ marginTop: '4px' }}>
                        <strong>{qa.question}:</strong> {qa.answer}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Result: {submission.result.type} - {submission.result.value}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    Submitted: {new Date(submission.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#999' }}>No submissions yet</p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
