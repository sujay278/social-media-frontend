import { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import Modal from '../Modals/FollowerModal';
import PostCard from '../PostCard/PostCard';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsers, setModalUsers] = useState([]);

  const openModal = (title, users) => {
    setModalTitle(title);
    setModalUsers(users);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:8989/katta/users/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  const handleFollowToggle = (userId, username, isCurrentlyFollowing) => {
    setUser(prev => {
      const updatedFollowing = { ...prev.following };
      if (isCurrentlyFollowing) {
        delete updatedFollowing[userId];
      } else {
        updatedFollowing[userId] = username;
      }
      return {
        ...prev,
        following: updatedFollowing
      };
    });
  };

  if (!user) return <div>Loading...!</div>;

  return (
    <div className='profile-container'>
      <div className='profile-header'>
        <div className='profile-info'>
          <div className='profile-photo'>
            <img src="path-to-photo.jpg" alt="" />
            <span className='username'>{user.username}</span>
          </div>
          <div className='user-details'>
            <span className='name'>{user.name}</span>
            <div className='stats'>
              <div>{user.posts?.length || 0} Posts</div>
              <div
                onClick={() =>
                  openModal(
                    'Followers',
                    Object.entries(user.followers || {}).map(([id, username]) => ({ id, username }))
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                {Object.keys(user.followers || {}).length} Followers
              </div>
              <div
                onClick={() =>
                  openModal(
                    'Following',
                    Object.entries(user.following || {}).map(([id, username]) => ({ id, username }))
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                {Object.keys(user.following || {}).length} Following
              </div>
            </div>
            <button className='edit-btn'>Edit Profile</button>
          </div>
          <div className='hamburger'>&#9776;</div>
        </div>

        <div className='posts-section'>
          <h3>Posts</h3>
          {user.posts.map((post) => (
            <PostCard
              key={post.postId}
              post={{
                ...post,
                username: user.username,
                name: user.name,
                userId: user.userId,
              }}
            />
          ))}
        </div>
      </div>

      {modalOpen && (
        <Modal
          title={modalTitle}
          users={modalUsers}
          onclose={closeModal}
          currentUserFollowing={Object.entries(user.following || {}).map(([id, username]) => ({ id, username }))}
          onFollowToggle={handleFollowToggle}
        />
      )}
    </div>
  );
};

export default Profile;
