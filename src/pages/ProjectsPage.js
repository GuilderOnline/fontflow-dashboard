// src/pages/ProjectsPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
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

  // ✅ Get token directly from localStorage (without touching AuthContext)
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProjects();
    fetchFonts();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE}/projects`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {} // ✅ Add token if exists
      });
      setProjects(res.data);
    } catch (err) {
      console.error('❌ Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFonts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/fonts`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setFonts(res.data);
    } catch (err) {
      console.error('❌ Error fetching fonts:', err);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/projects`, newProject, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setProjects([...projects, res.data]);
      setNewProject({ name: '', url: '', description: '' });
    } catch (err) {
      console.error('❌ Error creating project:', err);
    }
  };

  const updateProject = async (id) => {
    try {
      const res = await axios.put(`${API_BASE}/projects/${id}`, editedProject, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setProjects(projects.map((p) => (p._id === id ? res.data : p)));
      setEditingId(null);
    } catch (err) {
      console.error('❌ Error updating project:', err);
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API_BASE}/projects/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      console.error('❌ Error deleting project:', err);
    }
  };

  const assignFont = async (projectId, fontId) => {
    try {
      await axios.post(`${API_BASE}/projects/${projectId}/fonts`, { fontId }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      fetchProjects();
    } catch (err) {
      console.error('❌ Error assigning font:', err);
    }
  };

  const removeFont = async (projectId, fontId) => {
    try {
      await axios.delete(`${API_BASE}/projects/${projectId}/fonts/${fontId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      fetchProjects();
    } catch (err) {
      console.error('❌ Error removing font:', err);
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="dashboard-container flex">
      <Sidebar />
      <div className="dashboard-content p-6 flex-1">
        <h1 className="text-2xl font-bold mb-6">Projects</h1>
        {/* rest of your component unchanged */}
      </div>
    </div>
  );
};

export default ProjectsPage;
