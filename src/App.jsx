import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import Dashboard from './Components/Dashboard/Dashboard';
import POD from './Components/POD/POD';
import Login from './Components/Login/Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {isAuthenticated ? (
        <>
          <Navbar />
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pod" element={<POD />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
