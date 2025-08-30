import { useState } from 'react';
import axios from 'axios';
import './CreatePost.css';
import { toast } from 'react-toastify';

const CreatePost = ({ onPostCreated }) => {
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) {
      toast.error("Caption can't be empty");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:8989/katta/posts/post',
        { caption },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Post created!');
      setCaption('');
      if (onPostCreated) onPostCreated(response.data);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          placeholder="What's on your mind?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          className="post-textarea"
        />
        <button type="submit" disabled={loading} className="post-btn">
          {loading ? 'Posting...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;