import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', to: '/', icon: LayoutDashboard },
    { label: 'Products', to: '/products', icon: Package },
    { label: 'Categories', to: '/categories', icon: Layers },
    { label: 'Orders', to: '/orders', icon: ShoppingBag },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-badge">b</div>
          <div className="brand-title">
            <span className="brand-name">blinkit</span>
            <span className="brand-tagline">Admin Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={18} className="nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-profile-card">
            <div className="admin-avatar">{getInitials(user?.name)}</div>
            <div className="admin-details">
              <div className="admin-name" title={user?.name || 'Administrator'}>
                {user?.name || 'Administrator'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <span className="admin-role">
                  <ShieldCheck size={11} style={{ marginRight: '2px' }} />
                  {user?.role || 'ADMIN'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="logout-btn"
            title="Sign out of admin session"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
