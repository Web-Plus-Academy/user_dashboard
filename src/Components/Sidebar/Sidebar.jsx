import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
    return (
        <div className="sidebar-container">
            <button className="sidebar-container-button">
                <NavLink className="sidebar-container-link" to="/dashboard">
                    Dashboard
                </NavLink>
            </button>

            <br />
            <hr />

            <button className="sidebar-container-button">
                <NavLink className="sidebar-container-link" to="/tasks">
                    Tasks
                </NavLink>
            </button>

            <br />
            <hr />

            <button className="sidebar-container-button">
                <NavLink className="sidebar-container-link" to="/pod">
                    POD
                </NavLink>
            </button>
        </div>
    );
};

export default Sidebar;
