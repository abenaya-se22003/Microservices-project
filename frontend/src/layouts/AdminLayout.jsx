import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout() {
  return (
    <div className="admin-layout" id="admin-layout">
      <aside className="admin-sidebar" id="admin-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-icon">🏨</span>
          <h2 className="sidebar-title">HotelHub</h2>
          <span className="sidebar-badge">Admin</span>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Overview</span>
          <NavLink to="/admin" end className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
            <span className="sidebar-link-icon">📊</span>
            Dashboard
          </NavLink>

          <span className="sidebar-section-label">Management</span>
          <NavLink to="/admin/rooms" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
            <span className="sidebar-link-icon">🛏️</span>
            Manage Rooms
          </NavLink>
          <NavLink to="/admin/guests" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
            <span className="sidebar-link-icon">👤</span>
            Manage Guests
          </NavLink>
          <NavLink to="/admin/reservations" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
            <span className="sidebar-link-icon">📋</span>
            Reservations
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/" className="sidebar-link sidebar-link--back">
            <span className="sidebar-link-icon">←</span>
            Back to Site
          </NavLink>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
