import React, { useState } from 'react';

interface BlogPostFormProps {
  onSuccess: () => void;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to create a blog post.');
        return;
    }

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, tags }),
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        setTags('');
        onSuccess(); // Callback to refresh the list
      } else {
        alert('Failed to create blog post.');
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create a Blog Post</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
      />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default BlogPostForm;
