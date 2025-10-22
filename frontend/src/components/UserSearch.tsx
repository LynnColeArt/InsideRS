import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
}

interface UserSearchProps {
  onSuccess?: () => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSuccess }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // In a real app, you would have a dedicated endpoint for searching users.
    // For now, we'll just fetch all users for simplicity. This is not scalable.
    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddFriend = async (userId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/friends/request/${userId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        alert('Friend request sent!');
        onSuccess?.();
      } else {
        const message = await response.text();
        alert(`Failed to send friend request: ${message}`);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div>
      <h3>Find Friends</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username}
            <button onClick={() => handleAddFriend(user.id)}>Add Friend</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
