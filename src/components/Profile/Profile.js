import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import './Profile.css'
import Modal from '../Modals/FollowerModal';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsers, setModalUsers] = useState([]);
  const openModal = (title, user) => {
    setModalTitle(title);
    setModalUsers(user);
    setModalOpen(true);
  }
  const closeModal = () => {
    setModalOpen(false);
  }

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
      .catch((err) => console.error("Error fetching user :", err));
  }, []);

  const toggleComments = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handleUserUnfollowed = (userId) => {
    setUser(prevUser => {
      const updatedFollowing = { ...prevUser.following };
      delete updatedFollowing[userId];

      const updatedFollowers = { ...prevUser.followers };
      // Optional: remove from followers if needed

      return {
        ...prevUser,
        following: updatedFollowing,
        followers: updatedFollowers
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
                    <div>
                      {/* <strong>comment.commenter</strong><br/> later commenter's id can be added once added BE response */}
                      {comment.comment}
                    </div>
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
          onUserUnfollowed={handleUserUnfollowed}
        />

      )}
    </div>
  )
};

export default Profile;
