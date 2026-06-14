import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import './Auth.css';

function Signup() {
  var navigate = useNavigate();
  var { login } = useAuth();

  var [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  var [submitting, setSubmitting] = useState(false);
  var [error, setError] = useState(null);

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
    setError(null);

    // Client-side validation
    if (form.password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    api.post('/api/guests/signup', {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone || null,
      password: form.password,
    })
      .then(function (res) {
        // Auto-login after successful signup
        login(res.data);
        navigate('/', { replace: true });
      })
      .catch(function (err) {
        var message = 'Signup failed. ';
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

  return (
    <div className="auth-page" id="signup-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">✨</div>
          <h1>Create Account</h1>
          <p>Join HotelHub to start booking rooms</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} id="signup-form">
          {error && (
            <div className="alert alert-error">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="signup-fullName">Full Name *</label>
            <input
              id="signup-fullName"
              name="fullName"
              className="form-input"
              type="text"
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email Address *</label>
            <input
              id="signup-email"
              name="email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-phone">Phone (Optional)</label>
            <input
              id="signup-phone"
              name="phone"
              className="form-input"
              type="tel"
              placeholder="+1 234 567 8900"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="auth-divider">Secure your account</div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Password *</label>
              <input
                id="signup-password"
                name="password"
                className="form-input"
                type="password"
                placeholder="Min 4 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={4}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirmPassword">Confirm *</label>
              <input
                id="signup-confirmPassword"
                name="confirmPassword"
                className="form-input"
                type="password"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength={4}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={submitting}
            id="signup-submit-btn"
          >
            {submitting ? 'Creating account…' : '🚀 Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
