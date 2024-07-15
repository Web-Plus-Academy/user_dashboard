import React from 'react';
import './Dashboard.css';

const Dashboard = ({ userDetails }) => {
  return (
    <div className="dashboard-container">
      <h1>Welcome, {userDetails.name}</h1>
      <p>Email: {userDetails.email}</p>
      {/* Add more user details as needed */}
    </div>
  );
};

export default Dashboard;
