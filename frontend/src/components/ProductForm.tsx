import React, { useState } from 'react';

interface ProductFormProps {
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to list a product.');
        return;
    }

    try {
      const response = await fetch('/api/market', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, price: parseFloat(price), imageUrl }),
      });

      if (response.ok) {
        setName('');
        setDescription('');
        setPrice('');
        setImageUrl('');
        onSuccess(); // Callback to refresh the list
      } else {
        alert('Failed to list product.');
      }
    } catch (error) {
      console.error('Error listing product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>List a Product</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        required
        step="0.01"
      />
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
      />
      <button type="submit">List Product</button>
    </form>
  );
};

export default ProductForm;
