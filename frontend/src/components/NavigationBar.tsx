import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavigationBarProps {
  token: string | null;
  handleSignup: (e: React.FormEvent, username: string, email: string, password: string) => Promise<void>;
  handleLogin: (e: React.FormEvent, email: string, password: string) => Promise<void>;
  handleLogout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ token, handleSignup, handleLogin, handleLogout }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignup = (e: React.FormEvent) => {
    handleSignup(e, username, email, password);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const onLogin = (e: React.FormEvent) => {
    handleLogin(e, email, password);
    setEmail('');
    setPassword('');
  };

  return (
    <header className="bg-container border-b border-border p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-accent">
          <Link to="/">Inside Riverside</Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-accent">Home</Link></li>
            <li><Link to="/blog" className="hover:text-accent">Blog</Link></li>
            <li><Link to="/market" className="hover:text-accent">Marketplace</Link></li>
            <li><Link to="/business" className="hover:text-accent">Business</Link></li>
            <li><Link to="/friends" className="hover:text-accent">Friends</Link></li>
            <li><Link to="/posts" className="hover:text-accent">Posts</Link></li>
            <li><Link to="/users" className="hover:text-accent">Users</Link></li>
          </ul>
        </nav>
        <div>
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-accent text-white font-bold py-2 px-4 rounded hover:opacity-90"
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
      {!token ? (
        <div className="container mx-auto mt-4 flex justify-center space-x-8">
          <form onSubmit={onSignup} className="bg-container p-6 rounded-lg border border-border w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-accent">Sign Up</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-2 mb-4 bg-background border border-border rounded"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 mb-4 bg-background border border-border rounded"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 mb-4 bg-background border border-border rounded"
            />
            <button
              type="submit"
              className="w-full bg-accent text-white font-bold py-2 px-4 rounded hover:opacity-90"
            >
              Sign Up
            </button>
          </form>
          <form onSubmit={onLogin} className="bg-container p-6 rounded-lg border border-border w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-accent">Login</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 mb-4 bg-background border border-border rounded"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 mb-4 bg-background border border-border rounded"
            />
            <button
              type="submit"
              className="w-full bg-accent text-white font-bold py-2 px-4 rounded hover:opacity-90"
            >
              Login
            </button>
          </form>
        </div>
      ) : null}
    </header>
  );
};

export default NavigationBar;
