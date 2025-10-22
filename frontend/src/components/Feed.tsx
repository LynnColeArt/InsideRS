import React, { useState, useEffect } from 'react';

interface Post {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
  likes: number;
  shares: number;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch posts.');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to like posts.');
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchPosts(); // Refresh posts to show updated like count
      } else {
        alert('Failed to like post.');
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = async (postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to share posts.');
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/share`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchPosts(); // Refresh posts to show updated share count
      } else {
        alert('Failed to share post.');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-container p-4 rounded-lg border border-border">
          <p className="mb-2">{post.content}</p>
          <small className="text-gray-400">Posted at: {new Date(post.created_at).toLocaleString()}</small>
          <div className="flex justify-end space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <span>{post.likes}</span>
              <button
                onClick={() => handleLike(post.id)}
                className="bg-accent text-white font-bold py-1 px-3 rounded hover:opacity-90 text-sm"
              >
                Like
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span>{post.shares}</span>
              <button
                onClick={() => handleShare(post.id)}
                className="bg-accent text-white font-bold py-1 px-3 rounded hover:opacity-90 text-sm"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
