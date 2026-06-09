import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
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
        <li>
          <NavLink to="/admin" className="nav-link nav-link--admin">
            ⚙ Admin
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
