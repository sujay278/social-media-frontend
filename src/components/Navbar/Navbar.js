import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    if (path === 'logout') {
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-title">Katta!</div>
      <div className="navbar-links">
        <button
          className={isActive('/home') ? 'nav-button active' : 'nav-button'}
          onClick={() => handleNavigation('/home')}
        >
          Home
        </button>
        <button
          className={isActive('/search') ? 'nav-button active' : 'nav-button'}
          onClick={() => handleNavigation('/search')}
        >
          Search
        </button>
        <button
          className={isActive('/profile') ? 'nav-button active' : 'nav-button'}
          onClick={() => handleNavigation('/profile')}
        >
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
