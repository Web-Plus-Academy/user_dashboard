import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../axiosConfig.js';
import './Login.css';
import loginImg from '../../assets/login.jpg';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the request starts

    let userData = {
      username: username.toUpperCase(),
      password
    };
    
    try {
      const response = await axios.post('api/user/logInUser', userData);

      if (response.data.success) {
        const userDetails = {
          name: response.data.name,
          ID: response.data.ID,
        };

        localStorage.setItem('auth', 'true');
        localStorage.setItem('userDetails', JSON.stringify(userDetails));
        setIsAuthenticated(true);
        toast.success(response.data.message);
        navigate('/dashboard');
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false when the request completes
    }
  };

  return (
    <div className="login-container">
      <img src={loginImg} alt="" />
      <div className="right_login">
        <h4>Hi, Welcome Back to</h4>
        <h1>Web <b>Plus</b> Academy</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Login</h2>
          <div className="form-group">
            <label className="form-label">Username:</label>
            <input
              className="form-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="submit-button"
            type="submit"
            disabled={loading} 
          >
            {loading ? 'Logging in...' : 'Login'} 
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
