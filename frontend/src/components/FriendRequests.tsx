import React, { useState, useEffect } from 'react';

interface FriendRequest {
  id: number;
  username: string;
}

interface FriendRequestsProps {
  onSuccess: () => void;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({ onSuccess }) => {
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
        onSuccess(); // Refresh the main friends list
      } else {
        alert('Failed to accept friend request.');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  return (
    <div className="bg-container p-6 rounded-lg border border-border">
      <h3 className="text-2xl font-bold text-accent mb-4">Friend Requests</h3>
      <ul className="space-y-2">
        {requests.map((request) => (
          <li key={request.id} className="flex justify-between items-center">
            <span>{request.username}</span>
            <button
              onClick={() => handleAcceptRequest(request.id)}
              className="bg-accent text-white font-bold py-1 px-3 rounded hover:opacity-90 text-sm"
            >
              Accept
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequests;
