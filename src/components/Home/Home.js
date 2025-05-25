import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { toast } from 'react-toastify';

const Home = () => {
  const navigate = useNavigate();


  const handleLogout = () => {
      localStorage.removeItem('token');
      toast.success('Logged out successfully!', {
        position: 'top-right',
        autoClose: 2000,
        onClose: () => navigate('/login') // Redirect after toast closes
      });
    };
    

  return (
    <div>
      <nav className="navbar">
        <h3>Social Media App</h3>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </nav>
      <div className="home-content">
        <h2>Welcome to the Home Page!</h2>
        <p>This is a placeholder for your social media feed.</p>
      </div>
    </div>
  );
};

export default Home;
