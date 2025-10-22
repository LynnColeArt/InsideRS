import React, { useState } from 'react';
import BusinessPageList from '../components/BusinessPageList';
import BusinessPageForm from '../components/BusinessPageForm';

const BusinessPage: React.FC = () => {
    const [refreshBusinessPages, setRefreshBusinessPages] = useState(false);

    const handleSuccess = () => {
        setRefreshBusinessPages(prev => !prev);
    }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-container p-6 rounded-lg border border-border">
        <h2 className="text-3xl font-bold text-accent mb-2">Business Pages</h2>
      </div>
      <hr className="border-border my-4" />
      <BusinessPageForm onSuccess={handleSuccess} />
      <hr className="border-border my-4" />
      <BusinessPageList key={`business-${refreshBusinessPages}`} />
    </div>
  );
};

export default BusinessPage;
