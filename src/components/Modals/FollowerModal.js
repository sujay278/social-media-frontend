import { useState } from "react";
import axios from "axios";
import './FollowerModal.css';

const FollowerModal = ({ title, users, onclose, currentUserFollowing, onFollowToggle }) => {
    const [localFollowingIds, setLocalFollowingIds] = useState(new Set(currentUserFollowing.map(user => user.id)));
    const [searchTerm, setSearchTerm] = useState('');

    const toggleFollow = async (userId, username) => {
        const token = localStorage.getItem("token");
        const isFollowing = localFollowingIds.has(userId);
        try {
            const url = `http://localhost:8989/katta/users/${isFollowing ? 'unfollow' : 'follow'}/${userId}`;
            await axios.post(url, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLocalFollowingIds(prev => {
                const updated = new Set(prev);
                isFollowing ? updated.delete(userId) : updated.add(userId);
                return updated;
            });
            onFollowToggle(userId, username, isFollowing);
        } catch (err) {
            console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, err);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{title}</h3>
                <button className="close-btn" onClick={onclose}>X</button>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <ul className="user-list">
                    {filteredUsers.length === 0 ? (
                        <li>No matching users</li>
                    ) : (
                        filteredUsers.map((user) => {
                            const isFollowing = localFollowingIds.has(user.id);
                            return (
                                <li key={user.id} className="user-item">
                                    {user.username}
                                    <button
                                        className={isFollowing ? "unfollow-btn" : "follow-btn"}
                                        onClick={() => toggleFollow(user.id, user.username)}
                                    >
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </button>
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>
        </div>
    );
};

export default FollowerModal;
