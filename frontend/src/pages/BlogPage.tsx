import React, { useState } from 'react';
import BlogPostList from '../components/BlogPostList';
import BlogPostForm from '../components/BlogPostForm';

const BlogPage: React.FC = () => {
    const [refreshBlogPosts, setRefreshBlogPosts] = useState(false);

    const handleSuccess = () => {
        setRefreshBlogPosts(prev => !prev);
    }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-container p-6 rounded-lg border border-border">
        <h1 className="text-3xl font-bold text-accent mb-2">Blog</h1>
        <p>Read the latest posts from the community.</p>
      </div>
      <hr className="border-border my-4" />
      <BlogPostForm onSuccess={handleSuccess} />
      <hr className="border-border my-4" />
      <BlogPostList key={`blog-${refreshBlogPosts}`} />
    </div>
  );
};

export default BlogPage;
