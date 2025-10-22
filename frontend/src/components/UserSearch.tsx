import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
}

const UserSearch: React.FC = () => {
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
      } else {
        const message = await response.text();
        alert(`Failed to send friend request: ${message}`);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div className="bg-container p-6 rounded-lg border border-border">
      <h3 className="text-2xl font-bold text-accent mb-4">Find Friends</h3>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center">
            <span>{user.username}</span>
            <button
              onClick={() => handleAddFriend(user.id)}
              className="bg-accent text-white font-bold py-1 px-3 rounded hover:opacity-90 text-sm"
            >
              Add Friend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
