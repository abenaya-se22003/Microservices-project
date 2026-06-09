import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './ManageRooms.css';

function ManageRooms() {
  var [rooms, setRooms] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);
  var [formMsg, setFormMsg] = useState(null);
  var [submitting, setSubmitting] = useState(false);

  var [form, setForm] = useState({
    roomNumber: '',
    type: 'Single',
    price: '',
    available: true,
  });

  function fetchRooms() {
    api.get('/api/rooms')
      .then(function (res) { setRooms(res.data); setLoading(false); })
      .catch(function (err) { setError(err.message); setLoading(false); });
  }

  useEffect(function () { fetchRooms(); }, []);

  function handleChange(e) {
    var name = e.target.name;
    var value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(function (prev) {
      var updated = {};
      for (var k in prev) updated[k] = prev[k];
      updated[name] = value;
      return updated;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setFormMsg(null);

    var payload = {
      roomNumber: form.roomNumber,
      type: form.type,
      price: Number(form.price),
      available: form.available,
    };

    api.post('/api/rooms', payload)
      .then(function () {
        setFormMsg({ type: 'success', text: 'Room added successfully!' });
        setForm({ roomNumber: '', type: 'Single', price: '', available: true });
        setSubmitting(false);
        fetchRooms();
      })
      .catch(function (err) {
        var msg = err.response && err.response.data && err.response.data.message
          ? err.response.data.message : err.message;
        setFormMsg({ type: 'error', text: 'Failed: ' + msg });
        setSubmitting(false);
      });
  }

  return (
    <div className="manage-rooms-page" id="manage-rooms">
      <div className="page-header">
        <h1>🛏️ Manage Rooms</h1>
        <p>View all rooms and add new ones.</p>
      </div>

      {/* Add Room Form */}
      <div className="card add-form-card">
        <h3>Add New Room</h3>

        {formMsg && (
          <div className={'alert ' + (formMsg.type === 'success' ? 'alert-success' : 'alert-error')}>
            {formMsg.text}
          </div>
        )}

        <form className="add-form-grid" onSubmit={handleSubmit} id="add-room-form">
          <div className="form-group">
            <label className="form-label" htmlFor="roomNumber">Room Number</label>
            <input id="roomNumber" name="roomNumber" className="form-input" type="text"
              placeholder="101" value={form.roomNumber} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="type">Room Type</label>
            <select id="type" name="type" className="form-select" value={form.type} onChange={handleChange}>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="price">Price / Night ($)</label>
            <input id="price" name="price" className="form-input" type="number" min="0" step="0.01"
              placeholder="150" value={form.price} onChange={handleChange} required />
          </div>
          <div className="form-group form-group--inline">
            <label className="form-label">Available</label>
            <label className="toggle">
              <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="form-group form-group--submit">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding…' : '+ Add Room'}
            </button>
          </div>
        </form>
      </div>

      {/* Rooms Table */}
      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Loading rooms…</p></div>
      ) : error ? (
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <h2>Error loading rooms</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table" id="admin-rooms-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Room Number</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No rooms found.</td></tr>
              ) : rooms.map(function (room) {
                var available = room.available === true || room.status === 'AVAILABLE';
                return (
                  <tr key={room.id}>
                    <td>{room.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{room.roomNumber}</td>
                    <td><span className="badge badge-accent">{room.type || room.roomType || '—'}</span></td>
                    <td style={{ fontWeight: 600, color: 'var(--accent-hover)' }}>{'$' + (room.price || room.pricePerNight || '—')}</td>
                    <td><span className={'badge ' + (available ? 'badge-success' : 'badge-danger')}>{available ? 'Available' : 'Occupied'}</span></td>
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

export default ManageRooms;
