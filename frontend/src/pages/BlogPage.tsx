import React, { useState } from 'react';
import BlogPostList from '../components/BlogPostList';
import BlogPostForm from '../components/BlogPostForm';

const BlogPage: React.FC = () => {
    const [refreshBlogPosts, setRefreshBlogPosts] = useState(false);

    const handleSuccess = () => {
        setRefreshBlogPosts(prev => !prev);
    }

  return (
    <div>
      <h1>Blog</h1>
      <p>Read the latest posts from the community.</p>
      <hr />
      <BlogPostForm onSuccess={handleSuccess} />
      <hr />
      <BlogPostList key={`blog-${refreshBlogPosts}`} />
    </div>
  );
};

export default BlogPage;
