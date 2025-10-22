import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import MarketplacePage from './pages/MarketplacePage';
import BusinessPage from './pages/BusinessPage';
import FriendsPage from './pages/FriendsPage';
import PostsPage from './pages/PostsPage';
import UsersPage from './pages/UsersPage';
import NavigationBar from './components/NavigationBar';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSignup = async (e: React.FormEvent, username: string, email: string, password: string) => {
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

  const handleLogin = async (e: React.FormEvent, email: string, password: string) => {
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

  return (
    <Router>
      <div className="bg-background text-text font-sans min-h-screen">
        <NavigationBar
          token={token}
          handleSignup={handleSignup}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
        {token && (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/market" element={<MarketplacePage />} />
            <Route path="/business" element={<BusinessPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
