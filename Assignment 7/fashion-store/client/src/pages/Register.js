import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
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
      const response = await registerUser(formData);
      const result = response.data;
      console.log('Registration response:', result);

      if (result && (result.message === 'Data Saved' || result.message === 'User Registered Successfully')) {
        register({
          name: formData.name,
          email: formData.email
        });
        alert('Registration Successful! ✨');
        navigate('/login');
      } else if (result === 'Data Saved') {
        register({
          name: formData.name,
          email: formData.email
        });
        alert('Registration Successful! ✨');
        navigate('/login');
      } else {
        setError(result?.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Error during registration. Please try again.';
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
        <h3 className="text-center mb-4">Create Account ✨</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ borderRadius: '8px' }}
          />

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
            className="btn btn-primary w-100"
            disabled={loading}
            style={{ borderRadius: '8px', transition: '0.3s' }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{' '}
          <a href="/login" style={{ color: '#667eea', textDecoration: 'none' }}>
            Login
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

export default Register;
