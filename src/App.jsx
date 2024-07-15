import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import Dashboard from './Components/Dashboard/Dashboard';
import POD from './Components/POD/POD';
import Login from './Components/Login/Login';
import TaskSubmit from './Components/TaskSubmit/TaskSubmit';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check localStorage for authentication state
    const authState = localStorage.getItem('isAuthenticated');
    if (authState) {
      setIsAuthenticated(JSON.parse(authState));
    }
  }, []);

  const handleLogin = (authState) => {
    // Save authentication state to localStorage
    localStorage.setItem('isAuthenticated', JSON.stringify(authState));
    setIsAuthenticated(authState);
  };

  const handleLogout = () => {
    // Remove authentication state from localStorage
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <ToastContainer />
      {isAuthenticated ? (
        <>
          <Navbar onLogout={handleLogout} />
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<TaskSubmit />} />
                <Route path="/pod" element={<POD />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login setIsAuthenticated={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
