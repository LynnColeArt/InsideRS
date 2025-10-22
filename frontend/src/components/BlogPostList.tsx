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
    <div>
      <h3>Blog Posts</h3>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h4>{post.title}</h4>
              <p>{post.content}</p>
              <small>by {post.author.username}</small>
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
