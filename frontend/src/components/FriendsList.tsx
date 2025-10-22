import React, { useState, useEffect } from 'react';

interface Friend {
  id: number;
  username: string;
}

const FriendsList: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);

  const fetchFriends = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/friends', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleRemoveFriend = async (friendId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/friends/${friendId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchFriends(); // Refresh the friends list
      } else {
        alert('Failed to remove friend.');
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <div>
      <h3>Friends</h3>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>
            {friend.username}
            <button onClick={() => handleRemoveFriend(friend.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
