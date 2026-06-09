import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import './Rooms.css';

function getRoomPrice(room) {
  const price = room.price || room.pricePerNight;
  return price != null ? '$' + price : '—';
}

function isRoomAvailable(room) {
  return room.available === true || room.status === 'AVAILABLE';
}

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/api/rooms')
      .then((res) => {
        setRooms(res.data);
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
          <p>Loading rooms…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <h2>Failed to load rooms</h2>
          <p>{error}</p>
          <p className="error-hint">Make sure your backend is running on <code>http://localhost:8080</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" id="rooms-page">
      <div className="page-header">
        <h1 className="page-title">🛏️ Rooms</h1>
        <p className="page-subtitle">{rooms.length} rooms available</p>
      </div>

      {rooms.length === 0 ? (
        <div className="empty-state">
          <p>No rooms found.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table" id="rooms-table">
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
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td className="room-number">{room.roomNumber}</td>
                  <td>
                    <span className="badge badge-type">{room.type || room.roomType || '—'}</span>
                  </td>
                  <td className="price">{getRoomPrice(room)}</td>
                  <td>
                    <span className={'badge ' + (isRoomAvailable(room) ? 'badge-available' : 'badge-occupied')}>
                      {isRoomAvailable(room) ? 'Available' : 'Occupied'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Rooms;
