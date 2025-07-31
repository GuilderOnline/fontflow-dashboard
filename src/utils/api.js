// src/utils/api.js
let API_BASE = '';

if (window.location.hostname === 'localhost') {
  // ✅ Local backend
  API_BASE = 'http://localhost:4000/api';
} else {
  // ✅ Production backend (Render)
  API_BASE = 'https://fontflow-backend.onrender.com/api';
}

export default API_BASE;
