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
        <li id ="d-link" onClick={() => navigate('/dashboard')}>Dashboard</li>
        <li id ="u-link" onClick={() => navigate('/upload')}>Upload Font</li>
        <li id ="p-link" onClick={() => navigate('/projects')}>Projects</li>
        <li id ="l-link" onClick={handleLogout}>Logout</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
