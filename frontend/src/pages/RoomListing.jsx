import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import './RoomListing.css';

function getRoomType(room) {
  return room.type || room.roomType || 'Standard';
}

function getRoomPrice(room) {
  var price = room.price || room.pricePerNight;
  return price != null ? price : '—';
}

function isAvailable(room) {
  if (room.available === true) return true;
  if (room.available === false) return false;
  if (room.status === 'AVAILABLE') return true;
  return true; // default to available if status is unclear
}

function RoomListing() {
  var [rooms, setRooms] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);

  useEffect(function () {
    api.get('/api/rooms')
      .then(function (res) {
        setRooms(res.data);
        setLoading(false);
      })
      .catch(function (err) {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="room-listing-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading available rooms…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="room-listing-page">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <h2>Unable to load rooms</h2>
          <p>{error}</p>
          <p>Make sure the backend is running on <code>http://localhost:8080</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-listing-page" id="room-listing">
      <div className="page-header">
        <h1>🛏️ Available Rooms</h1>
        <p>{rooms.length} rooms found</p>
      </div>

      {rooms.length === 0 ? (
        <div className="error-state">
          <p>No rooms available at the moment.</p>
        </div>
      ) : (
        <div className="room-grid">
          {rooms.map(function (room) {
            var available = isAvailable(room);
            return (
              <div className="room-card card" key={room.id}>
                <div className="room-card__header">
                  <span className="room-card__number">Room {room.roomNumber}</span>
                  <span className={'badge ' + (available ? 'badge-success' : 'badge-danger')}>
                    {available ? 'Available' : 'Occupied'}
                  </span>
                </div>
                <div className="room-card__body">
                  <span className="room-card__type badge badge-accent">{getRoomType(room)}</span>
                  <div className="room-card__price">
                    <span className="price-value">{'$' + getRoomPrice(room)}</span>
                    <span className="price-label">/ night</span>
                  </div>
                </div>
                <div className="room-card__footer">
                  {available ? (
                    <Link to={'/book/' + room.id} className="btn btn-primary btn-sm room-book-btn" state={{ room: room }}>
                      Book Now →
                    </Link>
                  ) : (
                    <button className="btn btn-secondary btn-sm" disabled>
                      Unavailable
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RoomListing;
