import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import './RoomListing.css';

var FALLBACK_IMAGES = {
  Single: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
  Double: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  Suite: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  Deluxe: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
  Penthouse: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
};

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
  return true;
}

function getRoomImage(room) {
  if (room.imageUrl) return room.imageUrl;
  var type = getRoomType(room);
  return FALLBACK_IMAGES[type] || FALLBACK_IMAGES.default;
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
      <div className="browse-rooms-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading available rooms…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="browse-rooms-page">
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
    <div className="browse-rooms-page" id="room-listing">
      {/* Page Header */}
      <div className="browse-header">
        <div className="browse-header__text">
          <span className="browse-eyebrow">Our Rooms</span>
          <h1 className="browse-title">Find Your Perfect Room</h1>
          <p className="browse-subtitle">
            {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} available for your stay
          </p>
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏨</div>
          <h3>No Rooms Available</h3>
          <p>We're currently updating our inventory. Please check back soon.</p>
        </div>
      ) : (
        <div className="rooms-grid">
          {rooms.map(function (room) {
            var available = isAvailable(room);
            var type = getRoomType(room);
            var price = getRoomPrice(room);
            var imgSrc = getRoomImage(room);

            return (
              <div className={'room-card' + (available ? '' : ' room-card--unavailable')} key={room.id}>
                <div className="room-card__image-wrap">
                  <img
                    className="room-card__image"
                    src={imgSrc}
                    alt={type + ' room'}
                    loading="lazy"
                    onError={function (e) {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGES.default;
                    }}
                  />
                  {!available && (
                    <div className="room-card__sold-overlay">
                      <span>Occupied</span>
                    </div>
                  )}
                  <span className="room-card__type-badge">{type}</span>
                </div>

                <div className="room-card__details">
                  <div className="room-card__top-row">
                    <span className="room-card__room-number">Room {room.roomNumber}</span>
                    <span className={'room-card__status ' + (available ? 'status--available' : 'status--occupied')}>
                      {available ? 'Available' : 'Occupied'}
                    </span>
                  </div>

                  <div className="room-card__pricing">
                    <span className="room-card__price">{'$' + price}</span>
                    <span className="room-card__per-night">/ night</span>
                  </div>

                  <div className="room-card__action">
                    {available ? (
                      <Link
                        to={'/book/' + room.id}
                        className="btn btn-book"
                        state={{ room: room }}
                        id={'book-room-' + room.id}
                      >
                        Book Now
                      </Link>
                    ) : (
                      <button className="btn btn-book btn-book--disabled" disabled>
                        Unavailable
                      </button>
                    )}
                  </div>
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
