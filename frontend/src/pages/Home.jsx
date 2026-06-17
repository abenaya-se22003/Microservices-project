import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      {/* ─── Full-Width Hero ────────────────────────── */}
      <section className="hero" id="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-badge">Welcome to Grand Horizon</span>
          <h1 className="hero-title">
            Experience Luxury <br />Like Never Before
          </h1>
          <p className="hero-subtitle">
            Discover elegantly appointed rooms, world-class amenities, and unparalleled service 
            at our award-winning hotel. Your perfect getaway starts here.
          </p>
          <div className="hero-actions">
            <Link to="/rooms" className="btn btn-hero-primary btn-lg" id="browse-rooms-btn">
              Book a Room
            </Link>
            <a href="#features" className="btn btn-hero-outline btn-lg" id="learn-more-btn">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ─── Trust Bar ─────────────────────────────── */}
      <section className="trust-bar">
        <div className="trust-item">
          <span className="trust-number">500+</span>
          <span className="trust-label">Happy Guests</span>
        </div>
        <div className="trust-divider"></div>
        <div className="trust-item">
          <span className="trust-number">4.8</span>
          <span className="trust-label">Guest Rating</span>
        </div>
        <div className="trust-divider"></div>
        <div className="trust-item">
          <span className="trust-number">50+</span>
          <span className="trust-label">Luxury Rooms</span>
        </div>
        <div className="trust-divider"></div>
        <div className="trust-item">
          <span className="trust-number">24/7</span>
          <span className="trust-label">Concierge</span>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────── */}
      <section className="features-section" id="features">
        <div className="features-header">
          <span className="section-eyebrow">Why Choose Us</span>
          <h2 className="section-title">A Stay Beyond Expectation</h2>
          <p className="section-subtitle">
            From seamless booking to personalized service, every detail is crafted for your comfort.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card" id="feature-browse">
            <div className="feature-icon-wrap">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3>Browse &amp; Compare</h3>
            <p>Explore our curated selection of rooms with real-time availability, photos, and transparent pricing.</p>
          </div>
          <div className="feature-card" id="feature-booking">
            <div className="feature-icon-wrap">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3>Instant Booking</h3>
            <p>Select your dates, fill in your details, and confirm your reservation in seconds — no phone calls needed.</p>
          </div>
          <div className="feature-card" id="feature-service">
            <div className="feature-icon-wrap">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Trusted Service</h3>
            <p>Our dedicated staff ensure a secure, seamless experience from check-in to check-out.</p>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ────────────────────────────── */}
      <section className="cta-banner" id="cta-banner">
        <div className="cta-content">
          <h2>Ready for an Unforgettable Stay?</h2>
          <p>Browse our rooms and find the perfect match for your next trip.</p>
          <Link to="/rooms" className="btn btn-hero-primary btn-lg" id="cta-book-btn">
            View Available Rooms
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
