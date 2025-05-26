import React from 'react';
import './Home.css';
import Navbar from '../Navbar/Navbar';

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home-content">
        <h2>Welcome to the Home Page!</h2>
        <p>This is a placeholder for your social media feed.</p>
      </div>
    </>
  );
};

export default Home;
