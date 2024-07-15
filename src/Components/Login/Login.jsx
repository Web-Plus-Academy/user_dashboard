import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Login.css';
import loginImg from '../../assets/login.jpg'

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    if (username === '1' && password === '1') { // Example validation
      const userDetails = {
        name: 'John Doe',
        email: 'john.doe@example.com',
      };
      localStorage.setItem('auth', 'true');
      localStorage.setItem('userDetails', JSON.stringify(userDetails));
      setIsAuthenticated(true);
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials');
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
          <button className="submit-button" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
