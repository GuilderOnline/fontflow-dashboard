import React, { useEffect, useState } from 'react';
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
  const [generatedCodes, setGeneratedCodes] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  const token = localStorage.getItem('token');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  useEffect(() => {
    fetchProjects();
    fetchFonts();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE}/projects`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setProjects(res.data);
    } catch (err) {
      console.error('❌ Error fetching projects:', err.response?.data || err.message);
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
      console.error('❌ Error fetching fonts:', err.response?.data || err.message);
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
      showToast('✅ Project created');
    } catch (err) {
      console.error('❌ Error creating project:', err.response?.data || err.message);
    }
  };

  const updateProject = async (id) => {
    try {
      const res = await axios.put(`${API_BASE}/projects/${id}`, editedProject, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setProjects(projects.map((p) => (p._id === id ? res.data : p)));
      setEditingId(null);
      showToast('✅ Project updated');
    } catch (err) {
      console.error('❌ Error updating project:', err.response?.data || err.message);
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API_BASE}/projects/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setProjects(projects.filter((p) => p._id !== id));
      showToast('🗑️ Project deleted');
    } catch (err) {
      console.error('❌ Error deleting project:', err.response?.data || err.message);
    }
  };

  const assignFont = async (projectId, fontId) => {
    try {
      await axios.post(`${API_BASE}/projects/${projectId}/fonts`, { fontId }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      fetchProjects();
      showToast('🎯 Font assigned');
    } catch (err) {
      console.error('❌ Error assigning font:', err.response?.data || err.message);
    }
  };

  const removeFont = async (projectId, fontId) => {
    try {
      await axios.delete(`${API_BASE}/projects/${projectId}/fonts/${fontId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      fetchProjects();
      showToast('❌ Font removed');
    } catch (err) {
      console.error('❌ Error removing font:', err.response?.data || err.message);
    }
  };

  const generateCodeForProject = async (projectId) => {
    try {
      const res = await axios.get(`${API_BASE}/projects/${projectId}/generate-code`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      setGeneratedCodes((prev) => ({
        ...prev,
        [projectId]: {
          embedCode: res.data.embedCode,
          cssCode: res.data.cssCode
        }
      }));
      showToast('📄 Code generated');
    } catch (err) {
      console.error('❌ Error generating code:', err.response?.data || err.message);
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="dashboard-container flex">
      <Sidebar />
      <div className="dashboard-content p-6 flex-1 relative">
        
        {/* ✅ Toast Message */}
        {toastMessage && (
          <div className="fixed top-5 right-5 bg-gray-900 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
            {toastMessage}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6">Projects</h1>

        {/* Create Project Form */}
        <form onSubmit={createProject} className="bg-white shadow-md rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="border px-4 py-2 rounded shadow-sm"
              required
            />
            <input
              type="text"
              placeholder="Project URL"
              value={newProject.url}
              onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
              className="border px-4 py-2 rounded shadow-sm"
            />
            <input
              type="text"
              placeholder="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="border px-4 py-2 rounded shadow-sm"
            />
          </div>
          <button type="submit" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded shadow">
            Create Project
          </button>
        </form>

        {/* Projects List */}
        {projects.map((project) => (
          <div key={project._id} className="bg-white shadow-md rounded-lg p-6 mb-6">
            {editingId === project._id ? (
              <>
                <input
                  type="text"
                  value={editedProject.name}
                  onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                  className="border px-4 py-2 rounded shadow-sm mb-2"
                />
                <input
                  type="text"
                  value={editedProject.url}
                  onChange={(e) => setEditedProject({ ...editedProject, url: e.target.value })}
                  className="border px-4 py-2 rounded shadow-sm mb-2"
                />
                <input
                  type="text"
                  value={editedProject.description}
                  onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                  className="border px-4 py-2 rounded shadow-sm mb-2"
                />
                <button onClick={() => updateProject(project._id)} className="mr-2 px-4 py-2 bg-green-600 text-white rounded">Save</button>
                <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p>{project.url}</p>
                <p>{project.description}</p>

                {/* Font Assignment */}
                <select
                  value={selectedFontIds[project._id] || ''}
                  onChange={(e) =>
                    setSelectedFontIds({ ...selectedFontIds, [project._id]: e.target.value })
                  }
                  className="border px-4 py-2 rounded shadow-sm mt-2"
                >
                  <option value="">Assign a font</option>
                  {fonts.map((font) => (
                    <option key={font._id} value={font._id}>
                      {font.fullName}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    if (selectedFontIds[project._id]) {
                      assignFont(project._id, selectedFontIds[project._id]);
                    }
                  }}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add Font
                </button>

                {/* Assigned Fonts */}
                <ul className="mt-4">
                  {project.fonts?.map((font) => (
                    <li key={font._id} className="flex items-center justify-between border-b py-1">
                      {font.fullName}
                      <button
                        onClick={() => removeFont(project._id, font._id)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Edit / Delete */}
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setEditingId(project._id);
                      setEditedProject({
                        name: project.name,
                        url: project.url,
                        description: project.description,
                      });
                    }}
                    className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProject(project._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>

                  {/* Create Code Button */}
                  <button
                    onClick={() => generateCodeForProject(project._id)}
                    className="ml-4 px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Create Code
                  </button>
                </div>

                {/* Generated code */}
                {generatedCodes[project._id] && (
                  <div className="mt-4">
                    <h3 className="font-bold mb-2">Generated Embed & CSS Code</h3>
                    
                    {generatedCodes[project._id].embedCode && (
                      <div className="mb-4">
                        <h4 className="font-semibold">Embed Code</h4>
                        <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm whitespace-pre-wrap">
                          {generatedCodes[project._id].embedCode}
                        </pre>
                      </div>
                    )}

                    {generatedCodes[project._id].cssCode && (
                      <div>
                        <h4 className="font-semibold">CSS Code</h4>
                        <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm whitespace-pre-wrap">
                          {generatedCodes[project._id].cssCode}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
