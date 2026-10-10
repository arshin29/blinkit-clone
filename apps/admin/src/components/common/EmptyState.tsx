import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="card empty-state">
      <div className="empty-icon-box">{icon || <PackageOpen size={30} />}</div>
      <h4 className="empty-title">{title}</h4>
      <p className="empty-subtitle">{subtitle}</p>
      {actionText && onAction && (
        <button type="button" onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};
