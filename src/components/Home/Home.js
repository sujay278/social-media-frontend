import { useState, useEffect } from 'react';
import './Home.css';
import Navbar from '../Navbar/Navbar';
import Profile from '../Profile/Profile';
import Search from '../Search/Search';
import PostCard from './PostCard';
import axios from 'axios';

const Home = () => {
  const [activeSection, setActiveSection] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFollowedUsersPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8989/katta/users/followings', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const followedUsers = response.data;

        const allPosts = followedUsers.flatMap(user =>
          user.posts.map(post => ({
            ...post,
            username: user.username,
            name: user.name,
            userId: user.userId,
          }))
        );

        const sortedPosts = allPosts.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching followed users or posts:', error);
      }
    };

    if (activeSection === 'feed') {
      fetchFollowedUsersPosts();
    }
  }, [activeSection]);

  const filteredPosts = posts.filter(post =>
    post.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.comments?.some(comment =>
      comment.comment.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <Navbar onNavigate={setActiveSection} />
      <div className="home-content">
        {activeSection === 'feed' && (
          <div className="feed-section">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {filteredPosts.length === 0 ? (
              <p>No posts match your search.</p>
            ) : (
              filteredPosts.map(post => (
                <PostCard key={post.postId} post={post} />
              ))
            )}
          </div>
        )}
        {activeSection === 'profile' && <Profile />}
        {activeSection === 'search' && <Search />}
      </div>
    </>
  );
};

export default Home;
