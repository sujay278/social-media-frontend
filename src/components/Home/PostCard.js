import React from 'react';
import './PostCard.css';
import CommentSection from './CommentSection';

const PostCard = React.forwardRef(({ post }, ref) => {

  return (
    <div className="post-card" ref={ref}>
      <div className="post-header">
        <img
          src={`https://ui-avatars.com/api/?name=${post.name}&background=random`}
          alt="avatar"
          className="avatar"
        />
        <div className="user-info">
          <strong>{post.username}</strong>
          <span className="timestamp">{new Date(post.timestamp).toLocaleString()}</span>
        </div>
      </div>
      <div className="post-content">
        <p>{post.caption}</p>
      </div>
      <div className="post-actions">
        <button className="like-button">❤️ Like</button>
        <CommentSection comments={post.comments} />
      </div>
    </div>
  );
});

export default PostCard;