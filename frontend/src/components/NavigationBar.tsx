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
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/market">Marketplace</Link></li>
          <li><Link to="/business">Business</Link></li>
          <li><Link to="/friends">Friends</Link></li>
          <li><Link to="/posts">Posts</Link></li>
          <li><Link to="/users">Users</Link></li>
        </ul>
      </nav>

      <h1>Inside Riverside</h1>
      {!token ? (
        <div>
          <form onSubmit={onSignup}>
            <h2>Sign Up</h2>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Sign Up</button>
          </form>
          <form onSubmit={onLogin}>
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
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
