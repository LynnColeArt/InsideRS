import React from 'react';
import Feed from '../components/Feed';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to Inside Riverside!</p>
      <hr />
      <Feed />
    </div>
  );
};

export default HomePage;
