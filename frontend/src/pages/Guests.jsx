import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import './Guests.css';

function getGuestName(guest) {
  if (guest.name) return guest.name;
  const first = guest.firstName || '';
  const last = guest.lastName || '';
  return (first + ' ' + last).trim() || '—';
}

function getGuestPhone(guest) {
  return guest.phone || guest.phoneNumber || '—';
}

function Guests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/api/guests')
      .then((res) => {
        setGuests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading guests…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <h2>Failed to load guests</h2>
          <p>{error}</p>
          <p className="error-hint">Make sure your backend is running on <code>http://localhost:8080</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" id="guests-page">
      <div className="page-header">
        <h1 className="page-title">👤 Guests</h1>
        <p className="page-subtitle">{guests.length} registered guests</p>
      </div>

      {guests.length === 0 ? (
        <div className="empty-state">
          <p>No guests found.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table" id="guests-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.id}>
                  <td>{guest.id}</td>
                  <td className="guest-name">{getGuestName(guest)}</td>
                  <td>{guest.email || '—'}</td>
                  <td>{getGuestPhone(guest)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Guests;
