import React, { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    username: string;
  };
}

const BlogPostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-accent">Blog Posts</h3>
      {posts.length > 0 ? (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="bg-container p-4 rounded-lg border border-border">
              <h4 className="text-xl font-bold text-accent mb-2">{post.title}</h4>
              <p className="mb-2">{post.content}</p>
              <small className="text-gray-400">by {post.author.username}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No blog posts yet.</p>
      )}
    </div>
  );
};

export default BlogPostList;
