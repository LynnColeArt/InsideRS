import React from 'react';
import Feed from '../components/Feed';
import Chat from '../components/Chat';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-container p-6 rounded-lg border border-border">
        <h1 className="text-3xl font-bold text-accent mb-2">Home Page</h1>
        <p>Welcome to Inside Riverside!</p>
      </div>
      <hr className="border-border my-4" />
      <Chat />
      <hr className="border-border my-4" />
      <Feed />
    </div>
  );
};

export default HomePage;
