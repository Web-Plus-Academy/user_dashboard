import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar-container">

            <button className='dashboard_button'>
                <Link className='dashboard_name' to="/dashboard">Dashboard</Link>
            </button>

            <br /><hr />

            <button className='pod_button'>
                <Link className='pod_name' to="/pod">POD</Link>
            </button>

        </div>
    );
};

export default Sidebar;
