import React from 'react';
import './Navbar.css';

const Navbar = ({ onNavigate }) => {
  const handleNavigation = (section) => {
    if (section === 'logout') {
      localStorage.removeItem('token');
      window.location.href = '/login'; // or use navigate if available
    } else {
      onNavigate(section);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">Katta!</div>
      <div className="navbar-links">
        <button className="nav-button" onClick={() => handleNavigation('feed')}>
          Home
        </button>
        <button className="nav-button" onClick={() => handleNavigation('search')}>
          Search
        </button>
        <button className="nav-button" onClick={() => handleNavigation('profile')}>
          Profile
        </button>
        <button className="nav-button logout" onClick={() => handleNavigation('logout')}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
