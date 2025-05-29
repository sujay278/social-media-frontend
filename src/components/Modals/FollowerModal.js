import React, { useState } from "react";
import axios from "axios";
import './FollowerModal.css';

const FollowerModal = ({ title, users, onclose, currentUserFollowing, onUserUnfollowed }) => {
    const [unfollowedUserIds, setUnfollowedUserIds] = useState(new Set());
    const followingIds = new Set(currentUserFollowing?.map(user => user.id));

    const handleUnfollow = async (userId) => {
        const token = localStorage.getItem("token");
        setUnfollowedUserIds(prev => new Set(prev).add(userId));
        try {
            const res = await axios.post(`http://localhost:8989/katta/users/unfollow/${userId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Unfollowed:", res.data);
            onUserUnfollowed(userId); // Notify parent
        } catch (err) {
            console.error("Error unfollowing user:", err);
            setUnfollowedUserIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{title}</h3>
                <button className="close-btn" onClick={onclose}>X</button>
                <ul className="user-list">
                    {(!users || users.length === 0) ? (
                        <li>No {title}</li>
                    ) : (
                        users.map((user) => {
                            const showUnfollow = (title === "Following" || followingIds.has(user.id)) && !unfollowedUserIds.has(user.id);
                            return (
                                <li key={user.id} className="user-item">
                                    {user.username}
                                    {showUnfollow && (
                                        <button
                                            className="unfollow-btn"
                                            onClick={() => handleUnfollow(user.id)}
                                        >
                                            Unfollow
                                        </button>
                                    )}
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
