import { useState } from 'react';
import axios from 'axios';
import './PostCard.css';

const PostCard = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [showMenuId, setShowMenuId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const loggedInUser = JSON.parse(sessionStorage.getItem("userData"));
  const loggedInUserId = loggedInUser?.userId;

  const token = localStorage.getItem('token');

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      setSubmitting(true);
      const response = await axios.post(
        'http://localhost:8989/katta/comments/comment',
        {
          comment: commentText,
          post: { postId: post.postId },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments([...comments, response.data]);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8989/katta/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((c) => c.commentId !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editedCommentText.trim()) return;
    try {
      await axios.put(
        'http://localhost:8989/katta/comments/comment',
        {
          commentId,
          comment: editedCommentText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(
        comments.map((c) =>
          c.commentId === commentId ? { ...c, comment: editedCommentText } : c
        )
      );
      setEditingCommentId(null);
      setEditedCommentText('');
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const toggleMenu = (commentId) => {
    setShowMenuId((prev) => (prev === commentId ? null : commentId));
  };

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
          <span className="timestamp">
            {new Date(post.timestamp).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="post-caption">
        <p>{post.caption}</p>
      </div>

      <div className="post-actions">
        <div className="action-left">
          <button className="like-button">❤️</button>
          <button className="comment-toggle" onClick={() => setExpanded(!expanded)}>
            💬 {comments.length}
          </button>
        </div>
        <button className="expand-toggle" onClick={() => setExpanded(!expanded)}>
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {expanded && (
        <>
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment.commentId} className="comment-item">
                {editingCommentId === comment.commentId ? (
                  <div className="edit-comment-wrapper">
                    <input
                      type="text"
                      value={editedCommentText}
                      onChange={(e) => setEditedCommentText(e.target.value)}
                      autoFocus
                    />
                    <button
                      className="edit-submit-button"
                      onClick={() => handleEditComment(comment.commentId)}
                      disabled={!editedCommentText.trim()}
                    >
                      Save
                    </button>
                  </div>

                ) : (
                  <div className="comment-text">{comment.comment}</div>
                )}

                {comment.commenterId === loggedInUserId && (
                  <div className="comment-menu-wrapper">
                    <button
                      className="comment-menu-button"
                      onClick={() => toggleMenu(comment.commentId)}
                    >
                      ⋮
                    </button>
                    {showMenuId === comment.commentId && (
                      <div className="comment-menu-dropdown">
                        <button
                          className="comment-menu-option"
                          onClick={() => {
                            setEditingCommentId(comment.commentId);
                            setEditedCommentText(comment.comment);
                            setShowMenuId(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="comment-menu-option"
                          onClick={() => handleDeleteComment(comment.commentId)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </li>
            ))}
          </ul>

          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={submitting}
            />
            <button type="submit" disabled={submitting || !commentText.trim()}>
              ➤
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default PostCard;
