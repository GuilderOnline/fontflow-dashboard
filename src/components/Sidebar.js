import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo"><img src="/fontflow-logo.png" alt="FontFlow Logo"/></div>
      <ul className="sidebar-menu">
        <li onClick={() => navigate('/dashboard')}>Dashboard</li>
        <li onClick={() => navigate('/upload')}>Upload Font</li>
        <li onClick={() => navigate('/projects')}>Projects</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
