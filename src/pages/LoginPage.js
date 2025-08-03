import React, { useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ✅ Dynamically choose backend URL based on environment
const API_BASE = process.env.REACT_APP_API_BASE;

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      console.log('✅ Login success:', { token, user });

      login(token, user);

      // Small delay before redirect
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate(`/dashboard?user=${user.id}`);
        }
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <div className="logo"><img src="/fontflow-logo.png" alt="FontFlow Logo"/></div>
        
      </header>

      <main className="login-main">
        <section className="welcome">
          <h1>Welcome to <strong>Font Flow</strong></h1>
          <p>Self-host and manage your fonts with ease.</p>
          <h2>About Font Flow</h2>
        <p>
          Font Flow provides a reliable, privacy-friendly platform for uploading, optimizing,
          and serving web fonts, tailored for developers and designers.
        </p>
        <p>
          Set up a basic account with us and start embedding fonts in yiur websites & apps.
          
        </p>
        <button className="btn-primary" type="submit">New Account</button>
        </section>

        <section className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <div className="forgot">
              <a href="#">Forgot password?</a>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </section>
      </main>

      
    </div>
  );
};

export default LoginPage;
