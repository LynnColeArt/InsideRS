import React, { useState } from 'react';

interface BusinessPageFormProps {
  onSuccess: () => void;
}

const BusinessPageForm: React.FC<BusinessPageFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to create a business page.');
        return;
    }

    try {
      const response = await fetch('/api/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, address }),
      });

      if (response.ok) {
        setName('');
        setDescription('');
        setAddress('');
        onSuccess(); // Callback to refresh the list
      } else {
        alert('Failed to create business page.');
      }
    } catch (error) {
      console.error('Error creating business page:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create a Business Page</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Business Name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
      />
      <button type="submit">Create Page</button>
    </form>
  );
};

export default BusinessPageForm;
