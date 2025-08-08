import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import '../css/style.css';

// Use API base from .env or fallback to localhost for dev
const API_BASE_URL =
  process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

const UploadPage = () => {
  const { token } = useAuth(); // Get JWT token from context
  const [file, setFile] = useState(null); // Selected file state
  const [message, setMessage] = useState(''); // UI message state
  const [uploading, setUploading] = useState(false); // Uploading state
 
  // Single file change handler with validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Allowed font extensions
    const allowedExtensions = /\.(ttf|otf|eot|woff|woff2)$/i;

    // Validate file extension
    if (!allowedExtensions.test(selectedFile.name)) {
      setMessage('Wrong format. Only .ttf, .otf, .eot, .woff, or .woff2 are allowed.');
      setFile(null);
      e.target.value = ''; // reset file input
      return;
    }

    setFile(selectedFile);
    setMessage('');
  };

  // Upload handler
  const handleUpload = async (e) => {
    e.preventDefault();

    // Check if file is selected
    if (!file) {
      setMessage('Please select a valid font file to upload.');
      return;
    }

    // Prepare form data for upload
    const formData = new FormData();
    formData.append('font', file);

    try {
      setUploading(true);
      console.log('🔑 Token being sent:', token);

      // Send POST request to upload font
      const res = await axios.post(`${API_BASE_URL}/fonts/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Upload response:", res.data);
      setMessage(`Upload successful: ${res.data.name}`);
      setFile(null);
    } catch (err) {
      // Show error message if upload fails
      setMessage(`Upload failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        {/* Page header */}
        <h2 class ="upload-header">Upload a Font & Convert to WOFF2</h2>
        {/* Upload form */}
        <form onSubmit={handleUpload} className="upload-form">
          <input
            type="file"
            accept=".ttf,.otf,.eot,.woff,.woff2"
            onChange={handleFileChange}
          />
          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...converting...' : 'Upload Font & Convert'}
          </button>
        </form>
        {/* Show upload message */}
        {message && <p className="upload-message">{message}</p>}
      </div>
    </div>
  );
};

export default UploadPage;