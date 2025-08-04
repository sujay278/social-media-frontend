import { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import Modal from '../Modals/FollowerModal';
import PostCard from '../PostCard/PostCard';

const Profile = ({ userData }) => {
  const [user, setUser] = useState(userData || null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsers, setModalUsers] = useState([]);

  // Get the logged-in user from sessionStorage
  const loggedInUser = JSON.parse(sessionStorage.getItem("userData"));
  const isOwnProfile = user?.username === loggedInUser?.username;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userData) {
      const storedUser = sessionStorage.getItem("userData");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        axios.get("http://localhost:8989/katta/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then((res) => {
            setUser(res.data);
            sessionStorage.setItem("userData", JSON.stringify(res.data));
          })
          .catch((err) => console.error("Error fetching user:", err));
      }
    }
  }, [userData]);

  const openModal = (title, users) => {
    setModalTitle(title);
    setModalUsers(users);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleFollowToggle = async () => {
    try {
      const endpoint = user.isFollowing
        ? `http://localhost:8989/katta/users/unfollow/${user.userId}`
        : `http://localhost:8989/katta/users/follow/${user.userId}`;

      await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser((prev) => ({
        ...prev,
        isFollowing: !prev.isFollowing
      }));
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
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
            {isOwnProfile ? (
              <button className='edit-btn'>Edit Profile</button>
            ) : (
              <button
                className={user.isFollowing ? "unfollow-btn" : "follow-btn"}
                onClick={handleFollowToggle}
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </button>

            )}
          </div>
          <div className='hamburger'>&#9776;</div>
        </div>

        <div className='posts-section'>
          <h3>Posts</h3>
          {user.posts?.map((post) => (
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
          onFollowToggle={(userId, username, isCurrentlyFollowing) => {
            // optional: this handles follow toggle inside modal
            console.log(`Toggling follow for ${username}`);
          }}
        />
      )}
    </div>
  );
};

export default Profile;