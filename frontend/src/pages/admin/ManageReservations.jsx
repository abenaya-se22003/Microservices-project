import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './ManageReservations.css';

function ManageReservations() {
  var [reservations, setReservations] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);

  useEffect(function () {
    api.get('/api/reservations')
      .then(function (res) { setReservations(res.data); setLoading(false); })
      .catch(function (err) { setError(err.message); setLoading(false); });
  }, []);

  return (
    <div className="manage-reservations-page" id="manage-reservations">
      <div className="page-header">
        <h1>📋 Reservations</h1>
        <p>{loading ? '…' : reservations.length + ' total reservations'}</p>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Loading reservations…</p></div>
      ) : error ? (
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <h2>Error loading reservations</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table" id="admin-reservations-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Room ID</th>
                <th>Guest ID</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No reservations found.</td></tr>
              ) : reservations.map(function (r) {
                var status = r.status || 'CONFIRMED';
                var badgeClass = 'badge-info';
                if (status === 'CONFIRMED' || status === 'ACTIVE') badgeClass = 'badge-success';
                if (status === 'CANCELLED') badgeClass = 'badge-danger';
                if (status === 'PENDING') badgeClass = 'badge-warning';

                return (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td style={{ fontWeight: 600 }}>{r.roomId}</td>
                    <td>{r.guestId}</td>
                    <td>{r.checkInDate}</td>
                    <td>{r.checkOutDate}</td>
                    <td><span className={'badge ' + badgeClass}>{status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageReservations;
