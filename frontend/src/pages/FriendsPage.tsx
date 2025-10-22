import React, { useState } from 'react';
import FriendsList from '../components/FriendsList';
import FriendRequests from '../components/FriendRequests';
import UserSearch from '../components/UserSearch';

const FriendsPage: React.FC = () => {
    const [refreshFriends, setRefreshFriends] = useState(false);

    const handleSuccess = () => {
        setRefreshFriends(prev => !prev);
    }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-container p-6 rounded-lg border border-border">
        <h2 className="text-3xl font-bold text-accent mb-2">Friends</h2>
      </div>
      <hr className="border-border my-4" />
      <UserSearch onSuccess={handleSuccess} />
      <hr className="border-border my-4" />
      <FriendRequests onSuccess={handleSuccess} />
      <hr className="border-border my-4" />
      <FriendsList key={`friends-${refreshFriends}`} />
    </div>
  );
};

export default FriendsPage;
