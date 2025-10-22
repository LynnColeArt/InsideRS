import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

const MarketplacePage: React.FC = () => {
    const [refreshProducts, setRefreshProducts] = useState(false);

    const handleSuccess = () => {
        setRefreshProducts(prev => !prev);
    }

  return (
    <div>
      <h1>Marketplace</h1>
      <p>Buy and sell goods with your neighbors.</p>
      <hr />
      <ProductForm onSuccess={handleSuccess} />
      <hr />
      <ProductList key={`products-${refreshProducts}`} />
    </div>
  );
};

export default MarketplacePage;
