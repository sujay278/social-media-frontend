import { useState } from 'react';
import './PostCard.css';

const PostCard = ({ post }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="post-card">
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
        <div className="post-caption">
          <p>{post.caption}</p>
        </div>
      </div>

      <div className="post-actions">
        <div className="action-left">
          <button className="like-button">❤️</button>
          <button className="comment-toggle" onClick={() => setExpanded(!expanded)}>
            💬 {post.comments.length}
          </button>
        </div>
        <button className="expand-toggle" onClick={() => setExpanded(!expanded)}>
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {expanded && (
        <ul className="comment-list">
          {post.comments.map((comment) => (
            <li key={comment.commentId} className="comment-item">
              {comment.comment}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostCard;
