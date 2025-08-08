import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PrivateRoute component to protect routes based on authentication and user role
const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuth(); // Get auth status and user role from context

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not allowed, redirect to home page
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and role allowed, render child routes
  return <Outlet />;
};

export default PrivateRoute;
