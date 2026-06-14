import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './ManageRooms.css';

function ManageRooms() {
  var [rooms, setRooms] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);
  var [formMsg, setFormMsg] = useState(null);
  var [submitting, setSubmitting] = useState(false);

  // Add Room form state
  var [form, setForm] = useState({
    roomNumber: '',
    roomType: 'Single',
    price: '',
    available: true,
  });

  // Edit state: which room ID is being edited, and edit form values
  var [editingId, setEditingId] = useState(null);
  var [editForm, setEditForm] = useState({
    roomNumber: '',
    roomType: '',
    price: '',
    available: true,
  });
  var [editSubmitting, setEditSubmitting] = useState(false);

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

  function handleEditChange(e) {
    var name = e.target.name;
    var value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setEditForm(function (prev) {
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
      roomType: form.roomType,
      price: Number(form.price),
      available: form.available,
    };

    api.post('/api/rooms', payload)
      .then(function () {
        setFormMsg({ type: 'success', text: 'Room added successfully!' });
        setForm({ roomNumber: '', roomType: 'Single', price: '', available: true });
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

  function startEdit(room) {
    setEditingId(room.id);
    setEditForm({
      roomNumber: room.roomNumber || '',
      roomType: room.roomType || 'Single',
      price: room.price != null ? String(room.price) : '',
      available: room.available === true,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({ roomNumber: '', roomType: '', price: '', available: true });
  }

  function handleEditSave(roomId) {
    setEditSubmitting(true);

    var payload = {
      roomNumber: editForm.roomNumber,
      roomType: editForm.roomType,
      price: Number(editForm.price),
      available: editForm.available,
    };

    api.put('/api/rooms/' + roomId, payload)
      .then(function () {
        setEditingId(null);
        setEditSubmitting(false);
        fetchRooms();
      })
      .catch(function (err) {
        var msg = err.response && err.response.data && err.response.data.message
          ? err.response.data.message : err.message;
        alert('Failed to update room: ' + msg);
        setEditSubmitting(false);
      });
  }

  return (
    <div className="manage-rooms-page" id="manage-rooms">
      <div className="page-header">
        <h1>🛏️ Manage Rooms</h1>
        <p>View all rooms, edit details, and add new ones.</p>
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
            <label className="form-label" htmlFor="roomType">Room Type</label>
            <select id="roomType" name="roomType" className="form-select" value={form.roomType} onChange={handleChange}>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No rooms found.</td></tr>
              ) : rooms.map(function (room) {
                var isEditing = editingId === room.id;

                if (isEditing) {
                  return (
                    <tr key={room.id} className="editing-row">
                      <td>{room.id}</td>
                      <td>
                        <input
                          name="roomNumber"
                          className="form-input form-input--inline"
                          type="text"
                          value={editForm.roomNumber}
                          onChange={handleEditChange}
                          required
                        />
                      </td>
                      <td>
                        <select
                          name="roomType"
                          className="form-select form-select--inline"
                          value={editForm.roomType}
                          onChange={handleEditChange}
                        >
                          <option value="Single">Single</option>
                          <option value="Double">Double</option>
                          <option value="Suite">Suite</option>
                          <option value="Deluxe">Deluxe</option>
                          <option value="Penthouse">Penthouse</option>
                        </select>
                      </td>
                      <td>
                        <input
                          name="price"
                          className="form-input form-input--inline"
                          type="number"
                          min="0"
                          step="0.01"
                          value={editForm.price}
                          onChange={handleEditChange}
                          required
                        />
                      </td>
                      <td>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            name="available"
                            checked={editForm.available}
                            onChange={handleEditChange}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={function () { handleEditSave(room.id); }}
                          disabled={editSubmitting}
                        >
                          {editSubmitting ? 'Saving…' : '💾 Save'}
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={cancelEdit}
                          disabled={editSubmitting}
                        >
                          ✕ Cancel
                        </button>
                      </td>
                    </tr>
                  );
                }

                var available = room.available === true;
                return (
                  <tr key={room.id}>
                    <td>{room.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{room.roomNumber}</td>
                    <td><span className="badge badge-accent">{room.roomType || '—'}</span></td>
                    <td style={{ fontWeight: 600, color: 'var(--accent-hover)' }}>{'$' + (room.price != null ? room.price : '—')}</td>
                    <td><span className={'badge ' + (available ? 'badge-success' : 'badge-danger')}>{available ? 'Available' : 'Occupied'}</span></td>
                    <td className="actions-cell">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={function () { startEdit(room); }}
                        title="Edit this room"
                      >
                        ✏️ Edit
                      </button>
                    </td>
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
