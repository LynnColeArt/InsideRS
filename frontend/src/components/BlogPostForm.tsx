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
    <form onSubmit={handleSubmit} className="bg-container p-6 rounded-lg border border-border">
      <h3 className="text-2xl font-bold text-accent mb-4">Create a Blog Post</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        className="w-full p-2 mb-4 bg-background border border-border rounded"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
        className="w-full p-2 mb-4 bg-background border border-border rounded"
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
        className="w-full p-2 mb-4 bg-background border border-border rounded"
      />
      <button
        type="submit"
        className="w-full bg-accent text-white font-bold py-2 px-4 rounded hover:opacity-90"
      >
        Create Post
      </button>
    </form>
  );
};

export default BlogPostForm;
