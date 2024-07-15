import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar-container">

            <button className='sidebar-container-button'>
                <Link className='sidebar-container-link' to="/dashboard">Dashboard</Link>
            </button>

            <br /><hr />

            <button className='sidebar-container-button'>
                <Link className='sidebar-container-link' to="/tasks">Tasks</Link>
            </button>

            <br /><hr />

            <button className='sidebar-container-button'>
                <Link className='sidebar-container-link' to="/pod">POD</Link>
            </button>

        </div>
    );
};

export default Sidebar;
