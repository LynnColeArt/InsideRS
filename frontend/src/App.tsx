import React, { useState, useEffect } from 'react';
import PostForm from './components/PostForm';
import Feed from './components/Feed';
import FriendsList from './components/FriendsList';
import FriendRequests from './components/FriendRequests';
import UserSearch from './components/UserSearch';
import BusinessPageList from './components/BusinessPageList';
import BusinessPageForm from './components/BusinessPageForm';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import BlogPostList from './components/BlogPostList';
import BlogPostForm from './components/BlogPostForm';
import Chat from './components/Chat';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [refreshBusinessPages, setRefreshBusinessPages] = useState(false);
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [refreshBlogPosts, setRefreshBlogPosts] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        alert('Signup successful! Please log in.');
      } else {
        alert('Signup failed.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        alert('Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleSuccess = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(prev => !prev);
  }

  return (
    <div>
      <h1>Inside Riverside</h1>
      {!token ? (
        <div>
          <form onSubmit={handleSignup}>
            <h2>Sign Up</h2>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Sign Up</button>
          </form>
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Login</button>
          </form>
        </div>
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <hr />
          <Chat />
          <hr />
          <PostForm />
          <hr />
          <FriendsList />
          <FriendRequests />
          <UserSearch />
          <hr />
          <BusinessPageForm onSuccess={() => handleSuccess(setRefreshBusinessPages)} />
          <hr />
          <ProductForm onSuccess={() => handleSuccess(setRefreshProducts)} />
          <hr />
          <BlogPostForm onSuccess={() => handleSuccess(setRefreshBlogPosts)} />
        </div>
      )}
      <hr />
      <BusinessPageList key={`business-${refreshBusinessPages}`} />
      <hr />
      <ProductList key={`products-${refreshProducts}`} />
      <hr />
      <BlogPostList key={`blog-${refreshBlogPosts}`} />
      <hr />
      <Feed />
    </div>
  );
};

export default App;
