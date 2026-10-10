import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="rider-header">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="brand-badge">b</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base tracking-tight text-white">
                blink<span style={{ color: 'var(--color-brand-yellow)' }}>it</span>
              </span>
              <span className="partner-tag">Delivery Partner</span>
            </div>
            {user && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="status-dot-active" />
                <span className="text-xs text-muted font-medium truncate max-w-[160px]" style={{ color: '#9ca3af' }}>
                  {user.name}
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
          style={{
            minHeight: '36px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#f3f4f6',
            borderColor: 'rgba(255, 255, 255, 0.15)',
          }}
          title="Sign out of delivery partner portal"
          aria-label="Logout"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
