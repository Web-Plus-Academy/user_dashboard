import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "../../axiosConfig";
import './ChangePassword.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userDetails = JSON.parse(localStorage.getItem('userDetails'));

    if (!userDetails) {
      toast.error('User details not found. Please log in again.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("/api/user/changePassword", {
        username: userDetails.ID,
        oldPassword,
        newPassword,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Clear form fields on successful response
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Old Password:</label>
          <div className="password-input-container">
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <div className="password-input-container">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className="form-group">
          <label>Confirm New Password:</label>
          <div className="password-input-container">
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            >
              {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
