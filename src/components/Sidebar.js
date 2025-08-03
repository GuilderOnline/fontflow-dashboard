import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper: check if path is active
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/fontflow-logo.png" alt="FontFlow Logo"/>
      </div>
      <ul className="sidebar-menu">
        <li
          id="d-link"
          className={isActive('/dashboard')}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </li>
        <li
          id="u-link"
          className={isActive('/upload')}
          onClick={() => navigate('/upload')}
        >
          Upload Font
        </li>
        <li
          id="p-link"
          className={isActive('/projects')}
          onClick={() => navigate('/projects')}
        >
          Projects
        </li>
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
