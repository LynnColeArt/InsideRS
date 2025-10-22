import React, { useState, useEffect } from 'react';

interface FriendRequest {
  id: number;
  username: string;
}

const FriendRequests: React.FC = () => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/friends/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAcceptRequest = async (friendId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/friends/accept/${friendId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchRequests(); // Refresh the requests list
        // You might also want to trigger a refresh of the main friends list
      } else {
        alert('Failed to accept friend request.');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  return (
    <div>
      <h3>Friend Requests</h3>
      <ul>
        {requests.map((request) => (
          <li key={request.id}>
            {request.username}
            <button onClick={() => handleAcceptRequest(request.id)}>Accept</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequests;
