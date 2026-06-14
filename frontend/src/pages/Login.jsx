import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import './Auth.css';

function Login() {
  var navigate = useNavigate();
  var [searchParams] = useSearchParams();
  var { login } = useAuth();

  var [form, setForm] = useState({
    email: '',
    password: '',
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
    setSubmitting(true);
    setError(null);

    api.post('/api/guests/login', {
      email: form.email,
      password: form.password,
    })
      .then(function (res) {
        login(res.data);
        // Redirect to the page they were trying to visit, or home
        var redirect = searchParams.get('redirect') || '/';
        navigate(redirect, { replace: true });
      })
      .catch(function (err) {
        var message = 'Login failed. ';
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
    <div className="auth-page" id="login-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h1>Welcome Back</h1>
          <p>Sign in to your HotelHub account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} id="login-form">
          {error && (
            <div className="alert alert-error">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address *</label>
            <input
              id="login-email"
              name="email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password *</label>
            <input
              id="login-password"
              name="password"
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={submitting}
            id="login-submit-btn"
          >
            {submitting ? 'Signing in…' : '→ Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup">Create one here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
