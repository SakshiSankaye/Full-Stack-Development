import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(formData);
      const result = response.data;
      console.log('Login response:', result);

      if (result && (result.message === 'Login Success' || result.user)) {
        login({
          email: formData.email,
          name: result.user?.name
        });
        alert('Login Successful! 🎉');
        navigate('/');
      } else if (result === 'Login Success') {
        login({
          email: formData.email
        });
        alert('Login Successful! 🎉');
        navigate('/');
      } else {
        setError(result?.message || 'Invalid Email or Password');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Error logging in. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        height: '100vh'
      }}
    >
      <div
        className="card"
        style={{
          width: '350px',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          animation: 'fadeIn 0.6s ease-in-out'
        }}
      >
        <h3 className="text-center mb-4">Welcome Back 👋</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ borderRadius: '8px' }}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ borderRadius: '8px' }}
          />

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
            style={{ borderRadius: '8px', transition: '0.3s' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-3">
          Don't have account?{' '}
          <a href="/register" style={{ color: '#667eea', textDecoration: 'none' }}>
            Register
          </a>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
