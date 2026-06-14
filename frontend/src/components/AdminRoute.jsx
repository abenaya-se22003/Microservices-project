import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminRoute.css';

function AdminRoute({ children }) {
  var { user } = useAuth();

  // Not logged in at all — redirect to login
  if (!user) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  // Logged in but not an ADMIN — show unauthorized message
  if (user.role !== 'ADMIN') {
    return (
      <div className="unauthorized-page" id="unauthorized-page">
        <div className="unauthorized-card">
          <span className="unauthorized-icon">🔒</span>
          <h1>Access Denied</h1>
          <p>You don't have permission to access the Admin Dashboard.</p>
          <p className="unauthorized-role">
            Your role: <span className="badge badge-warning">{user.role}</span>
          </p>
          <a href="/" className="btn btn-primary" id="unauthorized-home-btn">← Back to Home</a>
        </div>
      </div>
    );
  }

  // User is ADMIN — render the admin content
  return children;
}

export default AdminRoute;
