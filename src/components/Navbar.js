import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Navbar component for main navigation and logout
const Navbar = () => {
  const { logout } = useAuth();         // Get logout function from AuthContext
  const navigate = useNavigate();       // React Router navigation hook

  // Handle logout: clear auth and redirect to login
  const handleLogout = () => {
    logout();            // Clear context and localStorage
    navigate('/login');  // Redirect to login page
  };

  return (
    <nav className="navbar">
      <h1>FontFlow</h1>
      <ul>
        {/* Navigation links */}
        <li>Dashboard</li>
        <li>Upload</li>
        <li>Fonts</li>
        <li>Settings</li>
        {/* Logout button */}
        <li>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;