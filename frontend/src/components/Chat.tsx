import React, { useState, useEffect, useRef } from 'react';

interface Message {
    senderId?: number;
    content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Connect to the WebSocket server
    const socket = new WebSocket(`ws://localhost:5173/ws?token=${token}`);
    ws.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const parsedMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      } catch (error) {
        // Handle non-JSON messages if necessary
        setMessages((prevMessages) => [...prevMessages, { content: event.data }]);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    // Clean up the connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws.current && newMessage && recipientId) {
      const message = {
        recipientId: parseInt(recipientId),
        content: newMessage,
      };
      ws.current.send(JSON.stringify(message));
      // Display the user's own message
      setMessages((prevMessages) => [...prevMessages, { content: `You to ${recipientId}: ${newMessage}` }]);
      setNewMessage('');
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            {msg.senderId ? `User ${msg.senderId}: ` : ''}
            {msg.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
        placeholder="Recipient User ID"
      />
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
