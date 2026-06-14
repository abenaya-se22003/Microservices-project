import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  var { user, logout } = useAuth();
  var navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar" id="main-nav">
      <NavLink to="/" className="navbar-brand">
        <span className="brand-icon">🏨</span>
        <span className="brand-title">HotelHub</span>
      </NavLink>
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/rooms" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            Browse Rooms
          </NavLink>
        </li>

        {/* Only show Admin link if user is an ADMIN */}
        {user && user.role === 'ADMIN' && (
          <li>
            <NavLink to="/admin" className="nav-link nav-link--admin">
              ⚙ Admin
            </NavLink>
          </li>
        )}

        {/* Auth section */}
        {user ? (
          <li className="nav-auth">
            <span className="nav-user-greeting">
              <span className="nav-user-avatar">{user.fullName.charAt(0).toUpperCase()}</span>
              <span className="nav-user-name">{user.fullName}</span>
              {user.role === 'ADMIN' && (
                <span className="badge badge-accent nav-role-badge">ADMIN</span>
              )}
            </span>
            <button className="btn btn-sm nav-logout-btn" onClick={handleLogout} id="logout-btn">
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <NavLink to="/login" className={({ isActive }) => 'nav-link nav-link--auth' + (isActive ? ' active' : '')}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" className="btn btn-primary btn-sm nav-signup-btn" id="nav-signup-btn">
                Sign Up
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
