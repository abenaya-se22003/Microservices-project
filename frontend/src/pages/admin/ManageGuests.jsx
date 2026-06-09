import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './ManageGuests.css';

function getGuestName(guest) {
  if (guest.name) return guest.name;
  var first = guest.firstName || '';
  var last = guest.lastName || '';
  return (first + ' ' + last).trim() || '—';
}

function ManageGuests() {
  var [guests, setGuests] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);
  var [formMsg, setFormMsg] = useState(null);
  var [submitting, setSubmitting] = useState(false);

  var [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  function fetchGuests() {
    api.get('/api/guests')
      .then(function (res) { setGuests(res.data); setLoading(false); })
      .catch(function (err) { setError(err.message); setLoading(false); });
  }

  useEffect(function () { fetchGuests(); }, []);

  function handleChange(e) {
    var name = e.target.name;
    var value = e.target.value;
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

    api.post('/api/guests', form)
      .then(function () {
        setFormMsg({ type: 'success', text: 'Guest added successfully!' });
        setForm({ name: '', email: '', phone: '' });
        setSubmitting(false);
        fetchGuests();
      })
      .catch(function (err) {
        var msg = err.response && err.response.data && err.response.data.message
          ? err.response.data.message : err.message;
        setFormMsg({ type: 'error', text: 'Failed: ' + msg });
        setSubmitting(false);
      });
  }

  return (
    <div className="manage-guests-page" id="manage-guests">
      <div className="page-header">
        <h1>👤 Manage Guests</h1>
        <p>View registered guests and add new ones.</p>
      </div>

      {/* Add Guest Form */}
      <div className="card add-form-card">
        <h3>Add New Guest</h3>

        {formMsg && (
          <div className={'alert ' + (formMsg.type === 'success' ? 'alert-success' : 'alert-error')}>
            {formMsg.text}
          </div>
        )}

        <form className="add-form-grid" onSubmit={handleSubmit} id="add-guest-form">
          <div className="form-group">
            <label className="form-label" htmlFor="guest-name">Full Name</label>
            <input id="guest-name" name="name" className="form-input" type="text"
              placeholder="John Doe" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="guest-email">Email</label>
            <input id="guest-email" name="email" className="form-input" type="email"
              placeholder="john@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="guest-phone">Phone</label>
            <input id="guest-phone" name="phone" className="form-input" type="tel"
              placeholder="+1 234 567 8900" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group form-group--submit">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding…' : '+ Add Guest'}
            </button>
          </div>
        </form>
      </div>

      {/* Guests Table */}
      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Loading guests…</p></div>
      ) : error ? (
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <h2>Error loading guests</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table" id="admin-guests-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {guests.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No guests found.</td></tr>
              ) : guests.map(function (guest) {
                return (
                  <tr key={guest.id}>
                    <td>{guest.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{getGuestName(guest)}</td>
                    <td>{guest.email || '—'}</td>
                    <td>{guest.phone || guest.phoneNumber || '—'}</td>
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

export default ManageGuests;
