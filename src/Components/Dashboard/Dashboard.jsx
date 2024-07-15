import React from 'react';
import './Dashboard.css';

const Dashboard = ({ userDetails }) => {
  return (
    <div className="dashboard-container">
      <h4 className="dashboard-welcome">Welcome,</h4>
      <h1 className="dashboard-name">{userDetails.name}</h1>
      <p className="dashboard-id">ID: {userDetails.ID}</p>
      {/* Add more user details as needed */}
    </div>
  );
};

export default Dashboard;
