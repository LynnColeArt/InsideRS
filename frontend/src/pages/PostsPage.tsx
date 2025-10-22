import React, { useState } from 'react';
import PostForm from '../components/PostForm';
import Feed from '../components/Feed';

const PostsPage: React.FC = () => {
    const [refreshFeed, setRefreshFeed] = useState(false);

    const handleSuccess = () => {
        setRefreshFeed(prev => !prev);
    }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-container p-6 rounded-lg border border-border">
        <h2 className="text-3xl font-bold text-accent mb-2">Posts</h2>
      </div>
      <hr className="border-border my-4" />
      <PostForm onSuccess={handleSuccess} />
      <hr className="border-border my-4" />
      <Feed key={`feed-${refreshFeed}`} />
    </div>
  );
};

export default PostsPage;
