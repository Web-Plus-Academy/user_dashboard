import React from 'react';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <h1>Dashboard</h1>
      <button onClick={onLogout} className="logout-button">Logout</button>
    </nav>
  );
};

export default Navbar;
