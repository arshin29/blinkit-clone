import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  actionLink,
  onActionClick,
}) => {
  return (
    <div className="empty-state-box">
      <div className="empty-icon-wrap">
        {icon || <PackageOpen size={36} />}
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
        {description}
      </p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="empty-action-btn"
        >
          {actionText}
        </Link>
      )}

      {actionText && onActionClick && !actionLink && (
        <button
          onClick={onActionClick}
          className="empty-action-btn"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
