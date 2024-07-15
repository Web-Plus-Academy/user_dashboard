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
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const authState = localStorage.getItem('isAuthenticated');
    const userDetails = localStorage.getItem('userDetails');
    if (authState) {
      setIsAuthenticated(JSON.parse(authState));
      setUserDetails(JSON.parse(userDetails));
    }
  }, []);

  const handleLogin = (authState) => {
    localStorage.setItem('isAuthenticated', JSON.stringify(authState));
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    setIsAuthenticated(authState);
    setUserDetails(userDetails);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userDetails');
    setIsAuthenticated(false);
    setUserDetails(null);
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
                <Route path="/dashboard" element={<Dashboard userDetails={userDetails} />} />
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
