import React, { useState } from 'react';
import { FaRegCommentDots } from 'react-icons/fa';
import './CommentSection.css';

const CommentSection = ({ comments }) => {
    const [expanded, setExpanded] = useState(false);

    if (!comments || comments.length === 0) return null;

    return (
        <div className="comment-section">
            <button
                className="toggle-comments"
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
            >
                <FaRegCommentDots className="comment-icon" />
                <span className="comment-count">{comments.length}</span>
            </button>

            {expanded && (
                <ul className="comment-list">
                    {comments.map((comment) => (
                        <li key={comment.commentId} className="comment-item">
                            {comment.comment}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CommentSection;
