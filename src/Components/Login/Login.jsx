import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../axiosConfig.js';
import './Login.css';
import loginImg from '../../assets/login.jpg';
import headImg from '../../assets/head.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 


const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
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
    <div className='login-panel'>
    <div className="login-container">
      <img src={loginImg} alt="" />
      <div className="right_login">
        <h4>Hi, Welcome Back to</h4>
        <img className='headImg' src={headImg} alt="" />
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Student Login</h2>
          <div className="form-group">
            <label className="form-label">Username:</label>
            <input
              className="form-input"
              type="text"
              value={username}
              placeholder='enter your developer id'
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password:</label>
            <div className="password-container">
              <input
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder='enter your password'
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            className="submit-button-login"
            type="submit"
            disabled={loading} 
          >
            {loading ? 'Logging in...' : 'Login'} 
          </button>
        </form>
      </div>
    </div>
      <div className='address'>
        22-5-97/2 PLOT NO.81, Guestline Rd., Sujatha Nagar, Kothapalli, Tirupati, Andhra Pradesh - 517501 .
        
        <a target="_blank" href="https://www.instagram.com/saredufy_wpa?igsh=ZGVtaXFrcjNjcGN0" class="social-icon-link">
            <i class="fab fa-instagram"></i>
        </a>

        <a target="_blank" href="https://whatsapp.com/channel/0029VajUkpiCxoAuR7Iigj3O" class="social-icon-link">
            <i className="fab fa-whatsapp"></i>
        </a>

        <a target="_blank" href="https://www.linkedin.com/company/saredufy-web-plus-academy-private-limited/" class="social-icon-link">
            <i className="fab fa-linkedin"></i>
        </a>

        <a target="_blank" href="https://saredufywpa.com/" class="social-icon-link">
            <i className="fas fa-globe"></i>
        </a>

        <a target="_blank" href="https://www.facebook.com/profile.php?id=61561544652969&mibextid=ZbWKwL" class="social-icon-link">
            <i className="fab fa-facebook"></i>
        </a>

        </div>
      
    </div>
  );
};

export default Login;
