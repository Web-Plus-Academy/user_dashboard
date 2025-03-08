import React, { useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ userDetails }) => {
  useEffect(() => {
    const card = document.querySelector('.dashboard-container');
    const body = document.querySelector('.body');

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = body.getBoundingClientRect();

      const xRotation = ((clientY - top) / height - 0.5) * 30;
      const yRotation = ((clientX - left) / width - 0.5) * 30;

      card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    };

    body.addEventListener('mousemove', handleMouseMove);

    return () => {
      body.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className='body'>
      <div className="dashboard-container">
        <h4 className="dashboard-welcome">Welcome,</h4>
        <h1 className="dashboard-name">{userDetails.name}</h1>
        <p className="dashboard-id">ID: {userDetails.ID}</p>
      </div>
    </div>
  );
};

export default Dashboard;
