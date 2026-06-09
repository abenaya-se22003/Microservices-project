import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './Dashboard.css';

function Dashboard() {
  var [stats, setStats] = useState({ rooms: 0, guests: 0, reservations: 0 });
  var [loading, setLoading] = useState(true);

  useEffect(function () {
    Promise.all([
      api.get('/api/rooms').catch(function () { return { data: [] }; }),
      api.get('/api/guests').catch(function () { return { data: [] }; }),
      api.get('/api/reservations').catch(function () { return { data: [] }; }),
    ]).then(function (results) {
      setStats({
        rooms: results[0].data.length,
        guests: results[1].data.length,
        reservations: results[2].data.length,
      });
      setLoading(false);
    });
  }, []);

  return (
    <div className="dashboard-page" id="admin-dashboard">
      <div className="page-header">
        <h1>📊 Dashboard</h1>
        <p>Welcome back! Here is an overview of your hotel.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-card__icon stat-card__icon--rooms">🛏️</div>
          <div className="stat-card__info">
            <span className="stat-card__value">{loading ? '…' : stats.rooms}</span>
            <span className="stat-card__label">Total Rooms</span>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-card__icon stat-card__icon--guests">👤</div>
          <div className="stat-card__info">
            <span className="stat-card__value">{loading ? '…' : stats.guests}</span>
            <span className="stat-card__label">Registered Guests</span>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-card__icon stat-card__icon--reservations">📋</div>
          <div className="stat-card__info">
            <span className="stat-card__value">{loading ? '…' : stats.reservations}</span>
            <span className="stat-card__label">Reservations</span>
          </div>
        </div>
      </div>

      <div className="dashboard-tip card">
        <h3>💡 Quick Tip</h3>
        <p>Use the sidebar to navigate between Rooms, Guests, and Reservations management.</p>
      </div>
    </div>
  );
}

export default Dashboard;
