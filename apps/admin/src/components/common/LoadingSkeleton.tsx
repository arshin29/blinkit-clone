import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => {
  return (
    <div className="table-container">
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {Array.from({ length: cols }).map((_, c) => (
                <div
                  key={c}
                  className="skeleton"
                  style={{
                    height: '24px',
                    flex: c === 0 ? 1.5 : 1,
                    borderRadius: '4px',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const StatsSkeleton: React.FC = () => {
  return (
    <div className="stats-grid">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card" style={{ height: '94px', padding: '16px' }}>
          <div className="skeleton" style={{ height: '14px', width: '40%', marginBottom: '12px' }} />
          <div className="skeleton" style={{ height: '28px', width: '60%' }} />
        </div>
      ))}
    </div>
  );
};
