import React, { useState } from 'react';
import PostForm from '../components/PostForm';
import Feed from '../components/Feed';

const PostsPage: React.FC = () => {
    const [refreshFeed, setRefreshFeed] = useState(false);

    const handleSuccess = () => {
        setRefreshFeed(prev => !prev);
    }

  return (
    <div>
      <h2>Posts</h2>
      <hr />
      <PostForm onSuccess={handleSuccess} />
      <hr />
      <Feed key={`feed-${refreshFeed}`} />
    </div>
  );
};

export default PostsPage;
