import React from 'react';
import { Menu, Zap } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const location = useLocation();

  const getPageTitle = (path: string) => {
    if (path === '/' || path === '/dashboard') return 'Operations Dashboard';
    if (path.startsWith('/products')) return 'Product Inventory';
    if (path.startsWith('/categories')) return 'Store Categories';
    if (path.startsWith('/orders')) return 'Customer Orders';
    return 'Admin';
  };

  return (
    <header className="header-topbar">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <div className="page-title-box">
          <h1 className="page-title">{getPageTitle(location.pathname)}</h1>
        </div>
      </div>

      <div className="header-right">
        <div className="live-badge" title="Express 10-Minute Store System Online">
          <Zap size={14} className="pulse-dot" />
          <span>Quick Commerce Active</span>
        </div>
      </div>
    </header>
  );
};
