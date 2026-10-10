import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="product-card" style={{ height: '310px' }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio: '1', borderRadius: '10px', marginBottom: '10px' }} />
      <div className="skeleton" style={{ width: '50px', height: '14px', marginBottom: '8px' }} />
      <div className="skeleton" style={{ width: '90%', height: '18px', marginBottom: '6px' }} />
      <div className="skeleton" style={{ width: '70%', height: '18px', marginBottom: '16px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <div className="skeleton" style={{ width: '60px', height: '22px' }} />
        <div className="skeleton" style={{ width: '75px', height: '34px', borderRadius: '8px' }} />
      </div>
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="category-card">
      <div className="skeleton" style={{ width: '72px', height: '72px', borderRadius: '10px', marginBottom: '10px' }} />
      <div className="skeleton" style={{ width: '80%', height: '14px' }} />
    </div>
  );
};
