import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import './Profile.css';
import Modal from '../Modals/FollowerModal';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
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

  const toggleComments = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

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
            <div className='post-card' key={post.postId}>
              <div className='caption'>{post.caption}</div>
              <div className='comment-count'>
                <span>&#128172;</span>
                <span>{post.comments.length}</span>
                <span className='comment-toggle' onClick={() => toggleComments(post.postId)}>
                  {expandedPostId === post.postId ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              </div>
              {expandedPostId === post.postId &&
                post.comments.map((comment) => (
                  <div className='comment' key={comment.commentId}>
                    <div className='comment-profile'></div>
                    <div>{comment.comment}</div>
                  </div>
                ))}
            </div>
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
