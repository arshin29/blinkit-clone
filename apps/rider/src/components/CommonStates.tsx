import React from 'react';
import { AlertCircle, RotateCw, PackageOpen } from 'lucide-react';

export const SkeletonOrderCard: React.FC = () => {
  return (
    <div className="rider-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="skeleton" style={{ width: '110px', height: '18px' }} />
        <div className="skeleton" style={{ width: '80px', height: '22px', borderRadius: '12px' }} />
      </div>
      <div className="skeleton" style={{ width: '60%', height: '14px' }} />
      <div className="skeleton" style={{ width: '90%', height: '14px' }} />
      <div className="flex justify-between items-center pt-2">
        <div className="skeleton" style={{ width: '90px', height: '16px' }} />
        <div className="skeleton" style={{ width: '70px', height: '16px' }} />
      </div>
    </div>
  );
};

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div
      className="rider-card flex flex-col items-center text-center p-6 my-4 gap-3"
      style={{ borderColor: 'var(--color-danger-border)', backgroundColor: 'var(--color-danger-bg)' }}
    >
      <AlertCircle size={36} color="var(--color-danger)" />
      <div>
        <h4 className="font-bold text-sm text-danger mb-1">Something went wrong</h4>
        <p className="text-xs text-secondary leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 mt-1"
        >
          <RotateCw size={13} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

interface EmptyStateProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No orders assigned to you',
  description = 'When new delivery orders are assigned to your rider profile, they will appear here.',
  onRefresh,
}) => {
  return (
    <div className="rider-card flex flex-col items-center text-center p-8 my-6 gap-3">
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PackageOpen size={28} className="text-muted" />
      </div>
      <h3 className="font-display font-bold text-base text-primary">{title}</h3>
      <p className="text-xs text-muted max-w-xs leading-relaxed">{description}</p>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="btn btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 mt-2"
        >
          <RotateCw size={13} />
          <span>Refresh Feed</span>
        </button>
      )}
    </div>
  );
};
