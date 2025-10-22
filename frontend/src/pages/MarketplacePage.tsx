import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

const MarketplacePage: React.FC = () => {
    const [refreshProducts, setRefreshProducts] = useState(false);

    const handleSuccess = () => {
        setRefreshProducts(prev => !prev);
    }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-container p-6 rounded-lg border border-border">
        <h1 className="text-3xl font-bold text-accent mb-2">Marketplace</h1>
        <p>Buy and sell goods with your neighbors.</p>
      </div>
      <hr className="border-border my-4" />
      <ProductForm onSuccess={handleSuccess} />
      <hr className="border-border my-4" />
      <ProductList key={`products-${refreshProducts}`} />
    </div>
  );
};

export default MarketplacePage;
