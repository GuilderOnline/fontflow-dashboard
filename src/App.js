import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import LoginPage from './pages/LoginPage';
import { useAuth } from './context/AuthContext';
import ProjectsPage from './pages/ProjectsPage';

// Main App component with routing logic
function App() {
  const { token } = useAuth(); // Get JWT token from context

  return (
    <Router>
      {/* If authenticated, show protected routes */}
      {token ? (
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/projects/:projectId" element={<ProjectsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/apikeys" element={<APIKeysPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Redirect any unknown route to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      ) : (
        // If not authenticated, show login routes only
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Redirect any unknown route to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;