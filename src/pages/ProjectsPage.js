import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import API_BASE from '../utils/api';
import '../css/dashboard.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({ name: '', url: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editedProject, setEditedProject] = useState({});
  const [selectedFontIds, setSelectedFontIds] = useState({});
  const navigate = useNavigate();

  const { user, token } = useAuth();

  // ✅ useCallback so they are stable references
  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const visibleProjects =
        user?.role === 'admin'
          ? res.data
          : res.data.filter((p) => p.ownerId === user?.id);

      setProjects(visibleProjects);
    } catch (err) {
      console.error('❌ Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const fetchFonts = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/fonts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFonts(res.data);
    } catch (err) {
      console.error('❌ Error fetching fonts:', err);
    }
  }, [token]);

  // ✅ Dependency array now correct
  useEffect(() => {
    if (!token) return;
    fetchProjects();
    fetchFonts();
  }, [token, fetchProjects, fetchFonts]);

  // ... rest of your component code stays exactly the same
};

export default ProjectsPage;
