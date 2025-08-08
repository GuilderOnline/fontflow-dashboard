import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Sidebar component for navigation and logout
const Sidebar = () => {
  const navigate = useNavigate();      // Hook for navigation
  const location = useLocation();      // Hook for current route
  const { logout } = useAuth();        // Get logout function from context

  // Handle logout: clear auth and redirect to login
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper: check if path is active for styling
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar">
      {/* Logo section */}
      <div className="sidebar-logo">
        <img src="/fontflow-logo.png" alt="FontFlow Logo"/>
      </div>
      {/* Navigation menu */}
      <ul className="sidebar-menu">
        {/* Dashboard link */}
        <li
          id="d-link"
          className={isActive('/dashboard')}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </li>
        {/* Upload Font link */}
        <li
          id="u-link"
          className={isActive('/upload')}
          onClick={() => navigate('/upload')}
        >
          Upload Font
        </li>
        {/* Projects link */}
        <li
          id="p-link"
          className={isActive('/projects')}
          onClick={() => navigate('/projects')}
        >
          Projects
        </li>
        {/* Logout link */}
        <li
          id="l-link"
          onClick={handleLogout}
        >
          Logout
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;