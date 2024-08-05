import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import ChangePassword from '../Changepassword/Changepassword';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleOpenModal = () => setShowChangePassword(true);
  const handleCloseModal = () => setShowChangePassword(false);

  return (
    <nav className="navbar">
      <h1>Dashboard</h1>
      <div className="navbar-buttons">
        <button onClick={handleOpenModal} className="change-password-button">
          Change Password
        </button>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>
      <Modal isOpen={showChangePassword} onClose={handleCloseModal}>
        <ChangePassword />
      </Modal>
    </nav>
  );
};

export default Navbar;
