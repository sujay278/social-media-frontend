import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (path === 'logout') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      navigate(`/${path}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">Katta!</div>
      <div className="navbar-links">
        <button className="nav-button" onClick={() => handleNavigation('home')}>Home</button>
        <button className="nav-button" onClick={() => handleNavigation('search')}>Search</button>
        <button className="nav-button" onClick={() => handleNavigation('profile')}>Profile</button>
        <button className="nav-button logout" onClick={() => handleNavigation('logout')}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
