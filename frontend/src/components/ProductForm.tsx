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
    <form onSubmit={handleSubmit} className="bg-container p-6 rounded-lg border border-border">
      <h3 className="text-2xl font-bold text-accent mb-4">List a Product</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        required
        className="w-full p-2 mb-4 bg-background border border-border rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-2 mb-4 bg-background border border-border rounded"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        required
        step="0.01"
        className="w-full p-2 mb-4 bg-background border border-border rounded"
      />
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
        className="w-full p-2 mb-4 bg-background border border-border rounded"
      />
      <button
        type="submit"
        className="w-full bg-accent text-white font-bold py-2 px-4 rounded hover:opacity-90"
      >
        List Product
      </button>
    </form>
  );
};

export default ProductForm;
