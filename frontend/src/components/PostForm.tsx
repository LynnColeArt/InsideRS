import React, { useState } from 'react';

interface PostFormProps {
  onSuccess?: () => void;
}

const resolveMaxLength = () => {
  const rawValue = import.meta.env.VITE_POST_MAX_LENGTH;
  const parsedValue = rawValue ? Number(rawValue) : Number.NaN;
  return Number.isFinite(parsedValue) ? parsedValue : 300;
};

const PostForm: React.FC<PostFormProps> = ({ onSuccess }) => {
  const [content, setContent] = useState('');
  const postMaxLength = resolveMaxLength();

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
        onSuccess?.();
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
    <form onSubmit={handleSubmit} className="bg-container p-6 rounded-lg border border-border">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        maxLength={postMaxLength}
        className="w-full p-2 mb-4 bg-background border border-border rounded"
      />
      <button
        type="submit"
        className="w-full bg-accent text-white font-bold py-2 px-4 rounded hover:opacity-90"
      >
        Post
      </button>
    </form>
  );
};

export default PostForm;
