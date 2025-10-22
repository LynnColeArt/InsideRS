import React, { useState, useEffect } from 'react';

interface BusinessPage {
  id: number;
  name: string;
  description: string;
  address: string;
}

const BusinessPageList: React.FC = () => {
  const [pages, setPages] = useState<BusinessPage[]>([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch('/api/business');
        if (response.ok) {
          const data = await response.json();
          setPages(data);
        }
      } catch (error) {
        console.error('Error fetching business pages:', error);
      }
    };

    fetchPages();
  }, []);

  return (
    <div>
      <h2>Business Pages</h2>
      {pages.map((page) => (
        <div key={page.id}>
          <h3>{page.name}</h3>
          <p>{page.description}</p>
          <p>{page.address}</p>
        </div>
      ))}
    </div>
  );
};

export default BusinessPageList;
