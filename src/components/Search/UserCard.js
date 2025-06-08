import './UserCard.css';

const UserCard = ({ user, onClick }) => {
  return (
    <div className="user-card" onClick={() => onClick(user)} style={{ cursor: 'pointer' }}>
      <div className="user-avatar">
        <div className="avatar-placeholder">👤</div>
      </div>
      <div className="user-info">
        <div className="user-name">{user.name}</div>
        <div className="user-username">@{user.username}</div>
      </div>
    </div>
  );
};

export default UserCard;
