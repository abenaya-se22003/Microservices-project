import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import './BookingForm.css';

function BookingForm() {
  var params = useParams();
  var location = useLocation();
  var navigate = useNavigate();
  var { user } = useAuth();
  var roomId = params.roomId;
  var room = location.state && location.state.room;

  var [form, setForm] = useState({
    checkInDate: '',
    checkOutDate: '',
  });
  var [submitting, setSubmitting] = useState(false);
  var [success, setSuccess] = useState(false);
  var [error, setError] = useState(null);

  // If not logged in, redirect to login with return URL
  if (!user) {
    navigate('/login?redirect=/book/' + roomId, { replace: true });
    return null;
  }

  function handleChange(e) {
    setForm(function (prev) {
      var updated = {};
      for (var key in prev) updated[key] = prev[key];
      updated[e.target.name] = e.target.value;
      return updated;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Directly create the reservation using the session's guestId
    var reservationPayload = {
      roomId: Number(roomId),
      guestId: user.guestId,
      checkInDate: form.checkInDate,
      checkOutDate: form.checkOutDate,
    };

    api.post('/api/reservations', reservationPayload)
      .then(function () {
        setSuccess(true);
        setSubmitting(false);
      })
      .catch(function (err) {
        var message = 'Booking failed. ';
        if (err.response && err.response.data) {
          if (typeof err.response.data === 'string') {
            message += err.response.data;
          } else if (err.response.data.message) {
            message += err.response.data.message;
          }
        } else {
          message += err.message;
        }
        setError(message);
        setSubmitting(false);
      });
  }

  // Success view
  if (success) {
    return (
      <div className="booking-page">
        <div className="booking-success card">
          <span className="success-icon">🎉</span>
          <h2>Booking Confirmed!</h2>
          <p>Your reservation has been successfully created.</p>
          <div className="success-details">
            <p><strong>Room:</strong> {room ? room.roomNumber : roomId}</p>
            <p><strong>Check-in:</strong> {form.checkInDate}</p>
            <p><strong>Check-out:</strong> {form.checkOutDate}</p>
            <p><strong>Guest:</strong> {user.fullName}</p>
          </div>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={function () { navigate('/rooms'); }}>
              Browse More Rooms
            </button>
            <button className="btn btn-secondary" onClick={function () { navigate('/'); }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page" id="booking-page">
      <div className="booking-container">
        {/* Room Info sidebar */}
        <div className="booking-room-info card">
          <h3>Room Details</h3>
          <div className="room-info-row">
            <span className="room-info-label">Room</span>
            <span className="room-info-value">{room ? room.roomNumber : '#' + roomId}</span>
          </div>
          {room && (
            <>
              <div className="room-info-row">
                <span className="room-info-label">Type</span>
                <span className="badge badge-accent">{room.type || room.roomType || 'Standard'}</span>
              </div>
              <div className="room-info-row">
                <span className="room-info-label">Price</span>
                <span className="room-info-value room-info-price">
                  {'$' + (room.price || room.pricePerNight || '—')}
                  <span className="price-label"> / night</span>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Booking Form */}
        <form className="booking-form card" onSubmit={handleSubmit} id="booking-form">
          <h2>Complete Your Booking</h2>

          {/* Booking-as info bar */}
          <div className="booking-as-bar">
            <span className="booking-as-avatar">{user.fullName.charAt(0).toUpperCase()}</span>
            <div className="booking-as-info">
              <span className="booking-as-name">{user.fullName}</span>
              <span className="booking-as-email">{user.email}</span>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              ⚠️ {error}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="checkInDate">Check-in Date *</label>
              <input
                id="checkInDate"
                name="checkInDate"
                className="form-input"
                type="date"
                value={form.checkInDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="checkOutDate">Check-out Date *</label>
              <input
                id="checkOutDate"
                name="checkOutDate"
                className="form-input"
                type="date"
                value={form.checkOutDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg booking-submit"
            disabled={submitting}
            id="submit-booking-btn"
          >
            {submitting ? 'Processing…' : '✅ Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
