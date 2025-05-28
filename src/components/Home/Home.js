import React, { useState } from 'react';
import './Home.css';
import Navbar from '../Navbar/Navbar';
import Profile from '../Profile/Profile';
import Search from '../Search/Search';

const Home = () => {
  const [activeSection, setActiveSection] = useState('feed');

  return (
    <>
      <Navbar onNavigate={setActiveSection} />
      <div className="home-content">
        {activeSection === 'feed' && (
          <>
            <h2>Welcome to the Home Page!</h2>
            <p>This is for your social media feed.</p>
          </>
        )}
        {activeSection === 'profile' && <Profile />}
        {activeSection === 'search' && <Search />}
      </div>
    </>
  );
};

export default Home;
