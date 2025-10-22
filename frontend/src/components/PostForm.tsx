import React, { useState } from 'react';

const postMaxLength = process.env.POST_MAX_LENGTH || 300;

const PostForm: React.FC = () => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to post.');
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setContent('');
        // You might want to trigger a refresh of the feed here
      } else {
        const message = await response.text();
        alert(`Failed to create post: ${message}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred while creating the post.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        maxLength={postMaxLength}
      />
      <button type="submit">Post</button>
    </form>
  );
};

export default PostForm;
