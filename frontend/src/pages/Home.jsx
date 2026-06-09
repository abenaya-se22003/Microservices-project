import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-glow hero-glow--left"></div>
        <div className="hero-glow hero-glow--right"></div>

        <span className="hero-eyebrow">✨ Premium Hotel Management</span>
        <h1 className="hero-title">
          The Smartest Way to
          <br />
          <span className="gradient-text">Manage Your Hotel</span>
        </h1>
        <p className="hero-subtitle">
          Browse available rooms, book your perfect stay, and let our team handle the rest.
          An all-in-one system for guests and administrators.
        </p>
        <div className="hero-actions">
          <Link to="/rooms" className="btn btn-primary btn-lg" id="browse-rooms-btn">
            🛏️ Browse Rooms
          </Link>
          <Link to="/admin" className="btn btn-secondary btn-lg" id="admin-login-btn">
            ⚙ Admin Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="feature-card">
          <div className="feature-icon-wrap">
            <span className="feature-icon">🔍</span>
          </div>
          <h3>Browse Rooms</h3>
          <p>Explore our curated selection of rooms with real-time availability and pricing.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrap">
            <span className="feature-icon">📅</span>
          </div>
          <h3>Instant Booking</h3>
          <p>Select your dates, fill in your details, and confirm your reservation in seconds.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrap">
            <span className="feature-icon">🛡️</span>
          </div>
          <h3>Admin Dashboard</h3>
          <p>Full control over rooms, guests, and reservations from a powerful admin panel.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
