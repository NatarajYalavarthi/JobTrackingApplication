
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

function ApplicationDetails() {
  const { id } = useParams();
  const [feedback, setFeedback] = useState([]);
  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    axios
      .get('/applications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => {
        const app = res.data.find((a) => a.id === parseInt(id));
        if (app) {
          axios
            .get(`/applications/${id}/feedback`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then((fb) => setFeedback(fb.data));

          axios
            .get(`/applications/${id}/rounds`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then((rd) => setRounds(rd.data));
        }
      });
  }, [id]);

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4">Application Details</h2>

        <div className="mb-4">
          <h4>Feedback</h4>
          {feedback.length === 0 ? (
            <p className="text-muted">No feedback available.</p>
          ) : (
            <ul className="list-group">
              {feedback.map((f) => (
                <li key={f.id} className="list-group-item">
                  <strong>{f.comments}</strong> <br />
                  <small className="text-muted">By: {f.created_by}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h4>Interview Rounds</h4>
          {rounds.length === 0 ? (
            <p className="text-muted">No interview rounds available.</p>
          ) : (
            <ul className="list-group">
              {rounds.map((r) => (
                <li key={r.id} className="list-group-item">
                  <strong>{r.title}</strong>: {r.notes}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetails;
