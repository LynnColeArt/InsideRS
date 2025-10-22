import React, { useState } from 'react';
import PostForm from '../components/PostForm';
import Feed from '../components/Feed';
import FriendsList from '../components/FriendsList';
import FriendRequests from '../components/FriendRequests';
import UserSearch from '../components/UserSearch';
import BusinessPageList from '../components/BusinessPageList';
import BusinessPageForm from '../components/BusinessPageForm';
import Chat from '../components/Chat';

const HomePage: React.FC = () => {
    const [refreshBusinessPages, setRefreshBusinessPages] = useState(false);

    const handleSuccess = () => {
        setRefreshBusinessPages(prev => !prev);
    }

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to Inside Riverside!</p>
      <hr />
      <Chat />
      <hr />
      <PostForm />
      <hr />
      <FriendsList />
      <FriendRequests />
      <UserSearch />
      <hr />
      <BusinessPageForm onSuccess={handleSuccess} />
      <hr />
      <BusinessPageList key={`business-${refreshBusinessPages}`} />
      <hr />
      <Feed />
    </div>
  );
};

export default HomePage;
