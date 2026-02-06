import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <h2>Progress Tracker</h2>
                </div>

                <div className="navbar-menu">
                    <div className="navbar-user">
                        <FaUser />
                        <div className="user-info">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-role badge badge-primary">{user?.role}</span>
                        </div>
                    </div>

                    <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
